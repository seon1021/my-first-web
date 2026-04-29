"use client"

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import type { Post } from '../../lib/posts'

type Props = {
  items: Post[]
  onFilter: (filtered: Post[]) => void
}

export default function SearchBar({ items, onFilter }: Props) {
  const [q, setQ] = useState('')

  useEffect(() => {
    const keyword = q.trim().toLowerCase()
    if (!keyword) {
      onFilter(items)
      return
    }

    const filtered = items.filter((p) => {
      return (
        p.title.toLowerCase().includes(keyword) ||
        p.content.toLowerCase().includes(keyword) ||
        p.author.toLowerCase().includes(keyword)
      )
    })

    onFilter(filtered)
  }, [q, items, onFilter])

  return (
    <div>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="검색어로 제목·내용·작성자를 검색하세요"
        className="w-full"
      />
    </div>
  )
}
