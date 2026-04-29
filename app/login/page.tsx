'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, signUp } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!email.trim() || !password.trim()) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }

    try {
      setLoading(true)

      if (isSignUp) {
        await signUp(email, password)
        setMessage('회원가입이 완료되었습니다! 로그인해주세요.')
        setIsSignUp(false)
        setPassword('')
      } else {
        await signIn(email, password)
        router.push('/posts')
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('오류가 발생했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {isSignUp ? '회원가입' : '로그인'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                이메일
              </label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6자 이상"
                disabled={loading}
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? (isSignUp ? '가입 중...' : '로그인 중...')
                : (isSignUp ? '회원가입' : '로그인')
              }
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            {isSignUp ? (
              <>
                이미 계정이 있으신가요?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setError(''); setMessage('') }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  로그인
                </button>
              </>
            ) : (
              <>
                계정이 없으신가요?{' '}
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setError(''); setMessage('') }}
                  className="text-blue-600 hover:underline font-medium"
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
