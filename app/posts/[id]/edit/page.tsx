'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getPost, updatePost } from '../../../../lib/posts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Page({ params }: { params: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [postId, setPostId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
  })

  useEffect(() => {
    ;(async () => {
      try {
        const { id } = await params
        const numId = Number(id)
        setPostId(numId)

        const post = await getPost(numId)
        if (post) {
          setFormData({
            title: post.title,
            content: post.content,
            author: post.author,
          })
        } else {
          setError('포스트를 찾을 수 없습니다.')
        }
      } catch (err) {
        console.error('포스트 로드 오류:', err)
        setError('포스트 로드 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    })()
  }, [params])

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

    if (!postId) {
      setError('포스트 ID를 찾을 수 없습니다.')
      return
    }

    try {
      setSaving(true)
      setError('')

      const updated = await updatePost(postId, {
        title: formData.title,
        content: formData.content,
        author: formData.author,
      })

      if (updated) {
        router.push(`/posts/${postId}`)
      } else {
        setError('포스트 수정에 실패했습니다.')
      }
    } catch (err) {
      console.error('포스트 수정 오류:', err)
      setError('포스트 수정 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <p className="text-center text-gray-500">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">포스트 수정</h1>

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
                disabled={saving}
              />
            </div>

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
                disabled={saving}
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용 *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={10}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={saving}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? '저장 중...' : '포스트 수정'}
              </Button>
              <Link href={`/posts/${postId}`}>
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
