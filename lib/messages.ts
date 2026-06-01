export const MESSAGES = {
  TITLE_MISSING: '제목을 입력해주세요.',
  TITLE_TOO_SHORT: '제목은 최소 2자 이상이어야 합니다.',
  CONTENT_MISSING: '내용을 입력해주세요.',
  CONTENT_TOO_SHORT: '내용을 10자 이상 입력해주세요.',
  PERMISSION: '이 작업을 수행할 권한이 없습니다.',
  NETWORK: '인터넷 연결을 확인하고 다시 시도해주세요.',
  UNKNOWN: '잠시 후 다시 시도해주세요.',
}

/**
 * 서버/네트워크 에러 메시지를 사용자 친화적인 메시지로 변환합니다.
 */
export function serverErrorToUserMessage(err: any): string {
  const msg = (err && (err.message || err.error || String(err))).toString().toLowerCase()

  if (!msg) return MESSAGES.UNKNOWN

  if (msg.includes('permission') || msg.includes('forbidden') || msg.includes('not authorized') || msg.includes('insufficient')) {
    return MESSAGES.PERMISSION
  }

  if (msg.includes('network') || msg.includes('failed to fetch') || msg.includes('fetch') || msg.includes('timeout')) {
    return MESSAGES.NETWORK
  }

  // supabase / postgres 권한 관련 문자열 검사
  if (msg.includes('jwt') || msg.includes('permission denied') || msg.includes('authorization')) {
    return MESSAGES.PERMISSION
  }

  return MESSAGES.UNKNOWN
}
