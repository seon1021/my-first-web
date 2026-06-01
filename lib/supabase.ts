import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// 서버에서만 사용해야 하는 키 (서비스 역할 키). 절대 클라이언트에 노출하지 마세요.
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

let supabase: any

if (typeof window !== 'undefined') {
	// 브라우저 환경에서는 createBrowserClient를 사용해 쿠키 기반 세션을 처리합니다.
	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY')
	}
	supabase = createBrowserClient(supabaseUrl, supabaseAnonKey) as any
} else {
	// 서버 환경(빌드/SSR)에서는 가능한 경우 서비스 역할 키를 사용합니다.
	// 서비스 역할 키는 DB 읽기/쓰기 권한이 있으므로 절대 클라이언트에 노출하지 마세요.
	const keyToUse = supabaseServiceRoleKey || supabaseAnonKey
	if (!supabaseUrl || !keyToUse) {
		throw new Error('Missing SUPABASE configuration for server: ensure SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is set')
	}
	supabase = createClient(supabaseUrl, keyToUse) as any
}

export { supabase }