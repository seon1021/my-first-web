import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * 간단한 인증 미들웨어
 * - 보호 대상: `/posts/new`, `/posts/:id/edit`
 * - Supabase 브라우저 세션 구현에서 사용하는 쿠키(`sb-access-token`)가 없으면 `/login`으로 리다이렉트
 *
 * 참고: 이 미들웨어는 애플리케이션 요구에 맞춰 확장하거나, Supabase 서버사이드 클라이언트로
 * 세션 검증 로직을 추가하는 것이 안전합니다.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // 보호 대상 경로만 처리
  const isProtected = pathname === '/posts/new'
  if (!isProtected) return NextResponse.next()

  // Supabase에서 브라우저 세션을 쿠키에 저장하는 경우 보통 `sb-access-token` 쿠키를 사용합니다.
  // 없는 경우 비인증으로 간주하고 로그인 페이지로 리다이렉트합니다.
  const accessToken = req.cookies.get('sb-access-token')?.value

  if (!accessToken) {
    const loginUrl = new URL('/login', req.url)
    // 원래 접근하려던 경로를 쿼리로 전달해 로그인 후 복귀하도록 함
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/posts/new'],
}
