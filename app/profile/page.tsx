import { redirect } from 'next/navigation'

export default function Page() {
  // /profile로 접근 시 마이페이지로 리다이렉트
  redirect('/mypage')
}
