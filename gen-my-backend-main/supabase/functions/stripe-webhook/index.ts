import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')!
  const body = await req.text()
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message)
    return new Response(`Webhook signature verification failed`, { status: 400 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string
        const userId = session.metadata?.supabase_user_id
        const tier = session.metadata?.subscription_tier

        if (userId && tier) {
          // Update user subscription
          await supabase
            .from('user_profiles')
            .update({
              subscription_tier: tier,
              stripe_subscription_id: subscriptionId,
              stripe_customer_id: customerId,
            })
            .eq('user_id', userId)

          // Log the upgrade
          await supabase
            .from('usage_analytics')
            .insert({
              user_id: userId,
              action_type: 'upgrade',
              metadata: {
                tier,
                subscription_id: subscriptionId,
                customer_id: customerId
              }
            })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user by customer ID
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          const status = subscription.status
          let tier = 'free'

          if (status === 'active') {
            // Determine tier based on price ID or product
            const priceId = subscription.items.data[0]?.price.id
            tier = priceId?.includes('pro') ? 'pro' : 'enterprise'
          }

          await supabase
            .from('user_profiles')
            .update({
              subscription_tier: tier,
              stripe_subscription_id: subscription.id,
            })
            .eq('user_id', profile.user_id)
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user by customer ID and downgrade to free
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single()

        if (profile) {
          await supabase
            .from('user_profiles')
            .update({
              subscription_tier: 'free',
              stripe_subscription_id: null,
            })
            .eq('user_id', profile.user_id)

          // Log the downgrade
          await supabase
            .from('usage_analytics')
            .insert({
              user_id: profile.user_id,
              action_type: 'downgrade',
              metadata: {
                reason: 'subscription_cancelled',
                subscription_id: subscription.id
              }
            })
        }
        break
      }

      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook handler failed:', error)
    return new Response(`Webhook handler failed: ${error.message}`, {
      status: 400,
    })
  }
})