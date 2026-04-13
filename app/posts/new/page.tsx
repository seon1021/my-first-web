"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (title.trim() === '') {
      setError('제목을 입력하세요')
      return
    }

    const newPost = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      author: '익명',
      date: new Date().toISOString().slice(0, 10),
    }

    try {
      const raw = localStorage.getItem('posts')
      const existing = raw ? JSON.parse(raw) : null
      const merged = existing && Array.isArray(existing) ? [newPost, ...existing] : [newPost]
      localStorage.setItem('posts', JSON.stringify(merged))
    } catch (err) {
      console.error('localStorage error', err)
    }

    router.push('/posts')
  }

  return (
    <section className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">새 게시글 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="제목을 입력하세요"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="내용을 입력하세요"
          />
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => router.push('/posts')}
            className="text-sm text-gray-600 hover:underline"
          >
            취소
          </button>
        </div>
      </form>
    </section>
  )
}
