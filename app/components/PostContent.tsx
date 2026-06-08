/**
 * 상세 페이지 본문
 * 글의 실제 내용을 표시
 */
interface PostContentProps {
  content: string
  imageUrl?: string | null
}

export default function PostContent({ content, imageUrl }: PostContentProps) {
  return (
    <div className="prose dark:prose-invert max-w-none mb-8">
      {imageUrl && (
        <div className="mb-6">
          <img src={imageUrl} alt="post image" className="w-full max-h-96 object-cover rounded-lg" />
        </div>
      )}
      <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
        {content}
      </div>
    </div>
  )
}
