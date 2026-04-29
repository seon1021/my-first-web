/**
 * 상세 페이지 본문
 * 글의 실제 내용을 표시
 */
interface PostContentProps {
  content: string
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose dark:prose-invert max-w-none mb-8">
      <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
        {content}
      </div>
    </div>
  )
}
