import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let supabase: ReturnType<typeof createClient>

if (typeof window !== 'undefined') {
	// 브라우저 환경에서는 createBrowserClient를 사용해 쿠키 기반 세션을 처리합니다.
	supabase = createBrowserClient(supabaseUrl!, supabaseAnonKey!) as any
} else {
	// 서버 환경(빌드/SSR)에서는 일반 createClient를 사용합니다.
	supabase = createClient(supabaseUrl!, supabaseAnonKey!)
}

export { supabase }