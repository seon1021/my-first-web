export default function Home() {
  const posts = [
    {
      id: 1,
      title: "Next.js 시작하기",
      author: "홍세온",
      date: "2024.03.25",
      excerpt: "Next.js 13 App Router를 활용하여 모던 웹 애플리케이션을 만드는 방법을 알아봅시다.",
    },
    {
      id: 2,
      title: "Tailwind CSS 디자인 팁",
      author: "홍세온",
      date: "2024.03.24",
      excerpt: "Tailwind CSS를 효과적으로 사용하여 반응형 디자인을 구현하는 방법.",
    },
    {
      id: 3,
      title: "React 상태 관리 패턴",
      author: "홍세온",
      date: "2024.03.23",
      excerpt: "React에서 효율적인 상태 관리를 위한 다양한 패턴과 Best Practice.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="sticky top-0 bg-white shadow-md border-b border-slate-200 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-2">홍세온</h1>
          <p className="text-sm sm:text-base text-slate-600 mb-6">한신대 공공인재빅데이터학과 | 프로그래밍, 독서, 영화감상</p>
          <nav>
            <ul className="flex justify-between items-center gap-4 sm:gap-8">
              <li><a href="#home" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">Home</a></li>
              <li><a href="#blog" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">Blog</a></li>
              <li><a href="#about" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">About</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-slate-200 hover:border-blue-300 cursor-pointer group">
              <div className="p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{post.title}</h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex flex-col gap-2 text-xs sm:text-sm text-slate-500 border-t border-slate-100 pt-4">
                  <p>작성자: <span className="font-medium text-slate-700">{post.author}</span></p>
                  <p>날짜: <span className="font-medium text-slate-700">{post.date}</span></p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer className="bg-slate-900 py-8 mt-16 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">&copy; 2024 홍세온. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
