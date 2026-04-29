import Link from 'next/link'

/**
 * 사이트 푸터
 * 페이지 하단에 표시되는 저작권 정보 및 링크
 */
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-pink-50 border-t-2 border-pink-200 mt-12">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 저작권 정보 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-2">정보</h3>
            <p className="text-sm text-gray-600">
              © {currentYear} 내 블로그<br />
              웹 개발을 배우며 기록하는 공간
            </p>
          </div>

          {/* 주요 링크 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-2">페이지</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/" className="text-pink-600 hover:text-pink-800 transition">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-pink-600 hover:text-pink-800 transition">
                  글 목록
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-pink-600 hover:text-pink-800 transition">
                  마이페이지
                </Link>
              </li>
            </ul>
          </div>

          {/* 연결 */}
          <div>
            <h3 className="font-bold text-gray-900 mb-2">연결</h3>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#" className="text-pink-600 hover:text-pink-800 transition">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-pink-600 hover:text-pink-800 transition">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-pink-600 hover:text-pink-800 transition">
                  이메일
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 구분선 */}
        <div className="border-t border-pink-200 mt-8 pt-4">
          <p className="text-center text-xs text-gray-500">
            Powered by Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
