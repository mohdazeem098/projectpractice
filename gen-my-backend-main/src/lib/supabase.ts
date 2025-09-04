import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          email?: string
          full_name?: string
          subscription_tier: 'free' | 'pro' | 'enterprise'
          daily_usage: number
          total_summaries: number
          last_usage_date?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email?: string
          full_name?: string
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          daily_usage?: number
          total_summaries?: number
          last_usage_date?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          full_name?: string
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          daily_usage?: number
          total_summaries?: number
          last_usage_date?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      summary_history: {
        Row: {
          id: string
          user_id: string
          original_url?: string
          original_text?: string
          summary: string
          settings: any
          word_count_original?: number
          word_count_summary?: number
          compression_ratio?: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_url?: string
          original_text?: string
          summary: string
          settings?: any
          word_count_original?: number
          word_count_summary?: number
          compression_ratio?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_url?: string
          original_text?: string
          summary?: string
          settings?: any
          word_count_original?: number
          word_count_summary?: number
          compression_ratio?: number
          created_at?: string
        }
      }
    }
  }
}