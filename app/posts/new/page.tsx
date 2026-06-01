'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createPost } from '../../../lib/posts'
import { MESSAGES, serverErrorToUserMessage } from '../../../lib/messages'
import { useAuth } from '../../components/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Page() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; content?: string; author?: string }>({})
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (loading) return


    // 클라이언트 유효성 검사
    const errors: { title?: string; content?: string; author?: string } = {}
    if (!formData.title.trim()) errors.title = MESSAGES.TITLE_MISSING
    else if (formData.title.trim().length < 2) errors.title = MESSAGES.TITLE_TOO_SHORT

    if (!formData.content.trim()) errors.content = MESSAGES.CONTENT_MISSING
    else if (formData.content.trim().length < 10) errors.content = MESSAGES.CONTENT_TOO_SHORT

    if (!formData.author.trim()) errors.author = '작성자를 입력해주세요.'

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      setError('입력값을 확인해주세요.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setFieldErrors({})

      // 이미지 업로드(선택된 파일이 있고 서버 저장 가능할 때)
      let imageUrl: string | undefined
      if (selectedFile && user) {
        try {
          const uploaded = await (await import('@/lib/storage')).uploadPostImage(selectedFile, String(Date.now()))
          if (uploaded) imageUrl = uploaded
        } catch (err) {
          console.error('이미지 업로드 실패:', err)
        }
      }

      const newPost = await createPost(
        {
          title: formData.title,
          content: formData.content,
          author: formData.author,
          image_url: imageUrl,
        },
        user?.id
      )

      if (newPost) {
        router.push(`/posts/${newPost.id}`)
      } else {
        console.error('createPost returned null')
        setError(MESSAGES.UNKNOWN)
      }
    } catch (err) {
      console.error('포스트 생성 오류:', err)
      setError(serverErrorToUserMessage(err))
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
                aria-invalid={!!fieldErrors.title}
                className={fieldErrors.title ? 'border-red-500' : ''}
              />
              {fieldErrors.title && (
                <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">{fieldErrors.title}</p>
              )}
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
                aria-invalid={!!fieldErrors.author}
                className={fieldErrors.author ? 'border-red-500' : ''}
              />
              {fieldErrors.author && (
                <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">{fieldErrors.author}</p>
              )}
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
                aria-invalid={!!fieldErrors.content}
                aria-describedby={fieldErrors.content ? 'content-error' : undefined}
              />
              {fieldErrors.content && (
                <p id="content-error" className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">{fieldErrors.content}</p>
              )}
            </div>

            {/* 버튼 영역 */}
            {/* 이미지 업로드 (선택) */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">첨부 이미지 (선택)</label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
                className="block w-full text-sm text-gray-600"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-muted-foreground">선택: {selectedFile.name}</p>
              )}
            </div>
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