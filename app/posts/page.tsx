import Link from 'next/link'
import { posts, type Post } from '../../lib/posts'

export default function Page() {
  return (
    <section className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">포스트</h1>
      <ul className="space-y-4">
        {posts.map((post: Post) => (
          <li key={post.id} className="p-4 bg-white shadow sm:rounded-lg">
            <Link href={`/posts/${post.id}`} className="block">
              <h2 className="text-xl font-semibold text-gray-900">{post.title}</h2>
              <p className="text-sm text-gray-500">{post.author} • {post.date}</p>
              <p className="mt-2 text-gray-700">{post.content}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
