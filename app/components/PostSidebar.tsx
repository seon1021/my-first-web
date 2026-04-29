'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { deletePost as deletePostApi } from '@/lib/posts'
import { useRouter } from 'next/navigation'

interface PostSidebarProps {
  postId: number
}

/**
 * 상세 페이지 사이드바
 * 수정/삭제 버튼 및 액션 메뉴
 * Dialog를 이용한 삭제 확인
 */
export default function PostSidebar({ postId }: PostSidebarProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const success = await deletePostApi(postId)
      if (success) {
        router.push('/posts')
      }
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">액션</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* 목록으로 돌아가기 */}
          <Link href="/posts" className="block">
            <Button variant="outline" className="w-full">
              목록으로
            </Button>
          </Link>

          {/* 수정하기 */}
          <Link href={`/posts/${postId}/edit`} className="block">
            <Button variant="outline" className="w-full">
              수정하기
            </Button>
          </Link>

          {/* 삭제하기 */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setShowDeleteDialog(true)}
          >
            삭제하기
          </Button>

          {/* 구분선 */}
          <div className="border-t pt-4"></div>

          {/* 추가 정보 */}
          <div className="text-sm text-gray-600 space-y-2">
            <p>📊 <span className="font-medium">조회수</span></p>
            <p className="text-xs text-gray-500">향후 추가</p>
          </div>
        </CardContent>
      </Card>

      {/* 삭제 확인 Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
          <DialogDescription>
            이 작업은 되돌릴 수 없습니다. 포스트가 영구적으로 삭제됩니다.
          </DialogDescription>
          <div className="flex gap-3 justify-end mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '삭제 중...' : '삭제'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
  </>
  );
}