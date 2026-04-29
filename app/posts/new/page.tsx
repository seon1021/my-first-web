'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createPost } from '../../../lib/posts'
import { useAuth } from '../../components/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Page() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
  })

  // 로그인 사용자의 이메일을 작성자 기본값으로 설정
  useEffect(() => {
    if (user?.email && !formData.author) {
      setFormData((prev) => ({ ...prev, author: user.email!.split('@')[0] }))
    }
  }, [user])

  // 모든 입력값 변경을 하나의 함수로 처리합니다.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      setError('모든 필드를 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const newPost = await createPost(
        {
          title: formData.title,
          content: formData.content,
          author: formData.author,
        },
        user?.id
      )

      if (newPost) {
        router.push(`/posts/${newPost.id}`)
      } else {
        setError('포스트 생성에 실패했습니다.')
      }
    } catch (err) {
      console.error('포스트 생성 오류:', err)
      setError('포스트 생성 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">새 포스트 작성</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>포스트 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 제목 입력 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="포스트 제목을 입력하세요"
                disabled={loading}
                required
              />
            </div>

            {/* 작성자 입력 */}
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                작성자 *
              </label>
              <Input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="작성자 이름을 입력하세요"
                disabled={loading}
                required
              />
            </div>

            {/* 내용 입력 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용 *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="포스트 내용을 입력하세요"
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                required
              />
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? '작성 중...' : '포스트 작성'}
              </Button>
              <Link href="/posts">
                <Button type="button" variant="outline">
                  취소
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}