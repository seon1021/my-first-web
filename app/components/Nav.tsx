import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold">내 블로그</Link>
        <div className="space-x-4 flex items-center">
          <Link href="/" className="text-sm hover:underline">홈</Link>
          <Link href="/posts" className="text-sm hover:underline">포스트</Link>
          <Link
            href="/posts/new"
            className="text-sm bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700"
          >
            새 글 쓰기
          </Link>
        </div>
      </div>
    </nav>
  )
}
