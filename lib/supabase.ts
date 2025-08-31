import {createClient} from "@supabase/supabase-js"

const supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const anon_key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabaseClient = createClient(supabase_url, anon_key)