"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { posts as initialPosts, type Post } from '../../lib/posts'
import SearchBar from '../components/SearchBar'

export default function Page() {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [filtered, setFiltered] = useState<Post[]>(initialPosts)

  useEffect(() => {
    ;(async () => {
      try {
        const raw = localStorage.getItem('posts')
        const local = raw ? JSON.parse(raw) as Post[] : []

        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
        const data = await res.json()
        const fetched: Post[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          content: p.body,
          author: `User ${p.userId}`,
          date: new Date().toISOString().slice(0, 10),
        }))

        const map = new Map<number, Post>()
        fetched.forEach((p) => map.set(p.id, p))
        initialPosts.forEach((p) => { if (!map.has(p.id)) map.set(p.id, p) })
        local.forEach((p) => map.set(p.id, p))

        const merged = Array.from(map.values())
        setPosts(merged)
        setFiltered(merged)
        localStorage.setItem('posts', JSON.stringify(merged))
      } catch (err) {
        console.error('load posts error', err)
        // fallback to existing initial posts/local
        try {
          const raw = localStorage.getItem('posts')
          if (raw) {
            const parsed = JSON.parse(raw) as Post[]
            setPosts(parsed)
            setFiltered(parsed)
          }
        } catch (e) {
          console.error('localStorage parse fallback failed', e)
        }
      }
    })()
  }, [])

  function deletePost(id: number) {
    if (!confirm('정말 삭제하시겠습니까?')) return
    const next = posts.filter((p) => p.id !== id)
    setPosts(next)
    setFiltered(next)
    try {
      localStorage.setItem('posts', JSON.stringify(next))
    } catch (err) {
      console.error('localStorage write error', err)
    }
  }

  return (
    <section className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">포스트</h1>

      <SearchBar items={posts} onFilter={setFiltered} />

      <ul className="space-y-4">
        {filtered.map((post: Post) => (
          <li key={post.id} className="p-4 bg-white shadow sm:rounded-lg flex justify-between items-start">
            <div className="flex-1">
              <Link href={`/posts/${post.id}`} className="block">
                <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
                <p className="text-sm text-gray-500">{post.author} • {post.date}</p>
                <p className="mt-2 text-gray-700">{post.content}</p>
              </Link>
            </div>

            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => deletePost(post.id)}
                className="text-sm text-red-600 hover:underline"
                aria-label={`Delete ${post.title}`}
              >
                삭제
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
