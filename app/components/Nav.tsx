'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default function Nav() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (err) {
      console.error('로그아웃 실패:', err)
    }
  }

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">내 블로그</Link>
        <div className="space-x-4 flex items-center">
          <Link href="/" className="text-sm hover:underline">홈</Link>
          <Link href="/posts" className="text-sm hover:underline">포스트</Link>

          {!loading && (
            <div className="flex items-center gap-3 ml-2 border-l border-gray-600 pl-3">
              {user ? (
                <>
                  <Link
                    href="/posts/new"
                    className="text-sm bg-blue-600 px-3 py-1.5 rounded text-white hover:bg-blue-700 transition"
                  >
                    새 글 쓰기
                  </Link>
                  <Link 
                    href="/mypage"
                    className="text-sm text-gray-300 hover:text-white transition font-medium hidden sm:inline px-2 py-1"
                  >
                    {user.email}
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSignOut}
                    className="text-xs border-gray-500 text-gray-300 hover:text-white hover:bg-gray-700 bg-transparent h-8"
                  >
                    로그아웃
                  </Button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm bg-blue-600 px-3 py-1.5 rounded text-white hover:bg-blue-700 transition"
                >
                  로그인
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
