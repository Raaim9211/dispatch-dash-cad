import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Call = {
  id: string
  type: string
  location: string
  priority: string
  created_at: string
}

export type Unit = {
  id: string
  unit_number: string
  status: 'Available' | 'Busy' | 'Out of Service'
  location: string
  created_at: string
}