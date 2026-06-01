'use client'

import { useEffect } from 'react'

export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // 개발자용 로그는 콘솔에 남김
    console.error('Unhandled error (Root):', error)
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full bg-card border border-border rounded-lg p-8 text-center">
        <h1 className="text-2xl font-bold mb-2">문제가 발생했습니다</h1>
        <p className="text-muted-foreground mb-4">죄송합니다. 요청을 처리하는 동안 문제가 발생했습니다.</p>

        <div className="flex gap-3 justify-center">
          <button
            className="px-4 py-2 rounded bg-primary text-white"
            onClick={() => reset()}
          >
            다시 시도
          </button>
          <button
            className="px-4 py-2 rounded border border-border text-foreground"
            onClick={() => window.location.reload()}
          >
            새로고침
          </button>
        </div>
      </div>
    </main>
  )
}
