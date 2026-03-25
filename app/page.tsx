export default function Home() {
  const posts = [
    {
      id: 1,
      title: "Next.js 시작하기",
      category: "개발",
      date: "2024.03.25",
      excerpt: "Next.js 13 App Router를 활용하여 모던 웹 애플리케이션을 만드는 방법을 알아봅시다.",
    },
    {
      id: 2,
      title: "Tailwind CSS 디자인 팁",
      category: "디자인",
      date: "2024.03.24",
      excerpt: "Tailwind CSS를 효과적으로 사용하여 반응형 디자인을 구현하는 방법.",
    },
    {
      id: 3,
      title: "React 상태 관리 패턴",
      category: "개발",
      date: "2024.03.23",
      excerpt: "React에서 효율적인 상태 관리를 위한 다양한 패턴과 Best Practice.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">홍세온</h1>
          <p className="text-gray-600">한신대 공공인재빅데이터학과 | 프로그래밍, 독서, 영화감상</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-2xl font-bold text-gray-900 flex-1">{post.title}</h2>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full ml-4 whitespace-nowrap">
                  {post.category}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{post.date}</p>
              <p className="text-gray-700 leading-relaxed">{post.excerpt}</p>
              <a href="#" className="inline-block mt-4 text-blue-600 font-semibold hover:text-blue-800">
                Read More →
              </a>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
