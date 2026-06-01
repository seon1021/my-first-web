export function mapErrorMessage(err: unknown): string {
  const raw = (err && (typeof err === 'object') && 'message' in (err as any))
    ? String((err as any).message)
    : String(err ?? '')

  const low = raw.toLowerCase()

  // 권한 관련: Postgres error code 42501 또는 RLS 관련 메시지
  if (low.includes('42501') || low.includes('row-level security') || low.includes('permission') || low.includes('permission denied')) {
    return '이 작업을 수행할 권한이 없습니다.'
  }

  // 네트워크 관련
  if (low.includes('failed to fetch') || low.includes('network') || low.includes('fetch') || low.includes('timeout')) {
    return '인터넷 연결을 확인해주세요.'
  }

  // not found 계열
  if (low.includes('not found') || low.includes('not_found') || low.includes('no rows') || low.includes('404')) {
    return '요청한 게시글을 찾을 수 없습니다.'
  }

  // 기본
  return '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
}
