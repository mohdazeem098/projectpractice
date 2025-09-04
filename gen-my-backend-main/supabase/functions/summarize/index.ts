import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SummarizeRequest {
  url?: string;
  text?: string;
  mode: 'extractive' | 'abstractive';
  format: 'paragraph' | 'bullet';
  length: 'short' | 'medium' | 'long';
  extractKeywords: boolean;
  showStats: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check user's subscription and usage limits
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('subscription_tier, daily_usage, last_usage_date')
      .eq('user_id', user.id)
      .single()

    // Check daily limits
    const today = new Date().toDateString()
    const isToday = profile?.last_usage_date === today
    const currentUsage = isToday ? (profile?.daily_usage || 0) : 0

    const limits = {
      'free': 5,
      'pro': Infinity,
      'enterprise': Infinity
    }

    const userLimit = limits[profile?.subscription_tier as keyof typeof limits] || limits.free

    if (currentUsage >= userLimit) {
      return new Response(
        JSON.stringify({ error: 'Daily limit reached. Upgrade to Pro for unlimited summaries.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const request: SummarizeRequest = await req.json()
    let contentToSummarize = request.text

    // If URL provided, fetch content
    if (request.url) {
      try {
        const response = await fetch(request.url)
        const html = await response.text()
        
        // Simple text extraction (you might want to use a more sophisticated library)
        contentToSummarize = html
          .replace(/<script[^>]*>.*?<\/script>/gs, '')
          .replace(/<style[^>]*>.*?<\/style>/gs, '')
          .replace(/<[^>]*>/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      } catch (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch content from URL' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    if (!contentToSummarize) {
      return new Response(
        JSON.stringify({ error: 'No content to summarize' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare OpenAI prompt based on settings
    const lengthInstructions = {
      'short': 'in 50-100 words',
      'medium': 'in 100-200 words', 
      'long': 'in 200-300 words'
    }

    const modeInstructions = {
      'extractive': 'by selecting and combining the most important sentences from the original text',
      'abstractive': 'by rewriting and paraphrasing the key concepts in your own words'
    }

    const formatInstructions = {
      'paragraph': 'as a coherent paragraph',
      'bullet': 'as bullet points with clear, concise statements'
    }

    const prompt = `Summarize the following text ${lengthInstructions[request.length]} ${modeInstructions[request.mode]} and format it ${formatInstructions[request.format]}:

${contentToSummarize}

${request.extractKeywords ? 'Also extract 5-8 key keywords from the text and list them at the end.' : ''}`

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at summarizing articles and extracting key information. Provide accurate, concise summaries that capture the main points.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: request.length === 'short' ? 150 : request.length === 'medium' ? 300 : 450,
        temperature: 0.3
      })
    })

    const openaiData = await openaiResponse.json()
    
    if (!openaiResponse.ok) {
      throw new Error(openaiData.error?.message || 'OpenAI API error')
    }

    const summary = openaiData.choices[0]?.message?.content

    // Update user usage
    await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        daily_usage: currentUsage + 1,
        last_usage_date: today,
        total_summaries: (profile?.total_summaries || 0) + 1
      })

    // Save summary to history
    await supabase
      .from('summary_history')
      .insert({
        user_id: user.id,
        original_url: request.url,
        original_text: contentToSummarize.substring(0, 1000), // Store first 1000 chars
        summary: summary,
        settings: {
          mode: request.mode,
          format: request.format,
          length: request.length,
          extractKeywords: request.extractKeywords
        }
      })

    return new Response(
      JSON.stringify({
        summary,
        usage: {
          today: currentUsage + 1,
          limit: userLimit,
          tier: profile?.subscription_tier || 'free'
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})