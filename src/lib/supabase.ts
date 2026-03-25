import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _supabase
}

/** @deprecated Use getSupabase() instead */
export const supabase = typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  : (null as unknown as SupabaseClient)

export type Order = {
  id: string
  created_at: string
  email: string
  product_type: 'soundwave' | 'coordinates' | 'cityscape'
  product_data: Record<string, unknown>
  material: string
  price: number
  stripe_session_id: string | null
  status: 'pending' | 'paid' | 'manufacturing' | 'shipped' | 'delivered'
  audio_url: string | null
  waveform_svg: string | null
}
