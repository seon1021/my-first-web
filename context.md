# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-04-29
- 완료된 작업: 홈 페이지, 헤더/푸터 레이아웃, 포스트 목록, 포스트 상세, 포스트 CRUD UI
- 진행 중: Supabase 연동 (라이브러리/환경설정 완료, 데이터베이스 설정 대기)
- 진행 중: Supabase 연동 (라이브러리/환경설정 완료, 데이터베이스 설정 대기)
- 미착수: 로그인/회원가입, 마이페이지

## 기술 결정 사항

- 인증: Supabase Auth (Email)
- 상태관리: React Context (AuthProvider)
- 이미지: Supabase Storage 사용 예정
- 데이터베이스: Supabase PostgreSQL (Row Level Security 적용)

## 최근 변경사항

- Supabase 클라이언트 라이브러리 설치 완료
- posts.ts에 CRUD 함수 추가 (getPosts, getPost, createPost, updatePost, deletePost)
- 포스트 목록 페이지 - Supabase 데이터 로드로 변경
- 포스트 상세 페이지 - Supabase에서 데이터 조회
- 포스트 작성 페이지 - Supabase createPost 연동
- 포스트 수정 페이지 신규 생성

## Posts RLS (Ch11 작업 요약)

- `posts` 테이블에 Row Level Security(RLS)를 활성화하고 마이그레이션으로 관리합니다.
- 적용 정책:
   - SELECT: 모두 읽기 허용 (USING (true))
   - INSERT: 인증된 사용자만, 삽입되는 `user_id`는 `auth.uid()`와 동일해야 함 (WITH CHECK)
   - UPDATE: 작성자 본인만 (`USING (auth.uid() = user_id)` + `WITH CHECK (auth.uid() = user_id)`) — 기존 행과 결과 행 모두 검사
   - DELETE: 작성자 본인만 (`USING (auth.uid() = user_id)`)
- 마이그레이션 파일: `supabase/migrations/20260520142154_add_posts_rls.sql`

### 테스트 결과 (간단 시나리오)

- 비로그인(익명): `SELECT` 가능, `INSERT`/`UPDATE`/`DELETE` 불가 — 삽입/수정/삭제 시 RLS 오류 발생
- 사용자 A (작성자): 자신의 게시글에 대해 `INSERT`(user_id가 auth.uid()와 일치하면 성공), `UPDATE`, `DELETE` 가능
- 사용자 B (다른 사용자): 다른 사용자의 게시글에 대해 `UPDATE`/`DELETE` 불가, `SELECT` 가능

참고: UI에서 버튼/링크 숨김은 UX용이며 실제 권한 검증은 RLS에서 강제됩니다.

## 해결된 이슈

- shadcn/ui Button variant가 디자인 토큰과 불일치 → globals.css의 --primary 수정으로 해결
- 모바일 헤더 메뉴가 겹침 → Sheet 컴포넌트로 교체

## 알게 된 점

- Tailwind CSS 4 기준에서는 `@import "tailwindcss"` + `@theme` 블록으로 설정 (`tailwind.config.js` 불필요)
- Server Component에서 useRouter 사용 불가 → redirect() 사용

## 다음 단계

1. **Supabase 프로젝트 생성** (https://supabase.com)
   - 프로젝트 생성 후 `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 환경변수 설정
   - `.env.local` 파일에 값 입력
   - 데이터베이스 스키마 및 RLS 정책은 Supabase CLI 마이그레이션으로 관리 (SQL Editor 직접 실행 금지)
     - 예: `npx supabase migration new add_posts_schema`로 마이그레이션 생성
     - 마이그레이션 파일에 `lib/schema.sql` 내용을 반영하고 `npx supabase db push` 또는 `npx supabase db reset`로 적용

2. **포스트 CRUD 테스트**
   - 환경변수 설정 후 `npm run dev`로 실행
   - 포스트 생성/수정/삭제 기능 테스트

3. **로그인/회원가입 구현**
   - Supabase Auth 설정
   - AuthProvider 구현
   - 로그인/회원가입 페이지

4. **마이페이지 구현**

## Ch12: 에러 처리 및 UX 개선 (요약)

- 추가된 파일들:
   - `app/error.tsx` — 루트 에러 바운더리 (개발자 로그는 `console.error`, 사용자에게 친절한 안내와 재시도/새로고침 제공)
   - `app/loading.tsx` — 루트 로딩 스켈레톤
   - `app/posts/loading.tsx` — 글 목록 로딩 스켈레톤
   - `app/posts/[id]/loading.tsx` — 글 상세 로딩 스켈레톤
   - `lib/error-message.ts` — Supabase/네트워크 에러를 사용자용 메시지로 매핑하는 유틸
   - `lib/messages.ts` — 폼 검증 및 공통 메시지 상수 (프로젝트 전반에서 사용)

- 화면별 로딩 / 빈 상태 / 에러 처리 (현재 적용)
   - 루트 페이지 (`/`): `app/loading.tsx` 스켈레톤, 에러 발생 시 `app/error.tsx` 노출
   - 글 목록 (`/posts`): `app/posts/loading.tsx` 로딩 스켈레톤, 게시글 없을 때는 빈 안내 문구 표시, 데이터 오류는 콘솔에 로그 후 사용자용 메시지 표시
   - 글 상세 (`/posts/[id]`): `app/posts/[id]/loading.tsx` 스켈레톤, 글 없음 → '게시글을 찾을 수 없습니다' 안내, 오류는 친절한 메시지
   - 글 작성 (`/posts/new`): 클라이언트 측 유효성 검사(제목/내용), 제출 중 버튼 비활성화, 필드별 에러 표시, 서버 에러는 콘솔에 원문 로그 후 사용자에게 친절한 메시지 표시
   - 로그인/회원가입 (`/login`, `/signup`): Supabase 에러를 `lib/error-message.ts`로 변환해 표시, 원문은 콘솔에 남김

- 폼 검증 규칙 (요약)
   - 제목: 필수, 최소 2자
   - 내용: 필수, 최소 10자
   - 제출 중 폼 버튼 비활성화로 중복 제출 방지
   - 필드별 에러 메시지는 입력 필드 아래에 표시(ARIA 속성 포함)

- 에러 메시지 변환 규칙 (`lib/error-message.ts`)
   - Postgres RLS 또는 권한 관련(예: `42501`, `row-level security`, `permission denied`) → "이 작업을 수행할 권한이 없습니다."
   - 네트워크/Fetch 관련(예: `Failed to fetch`, `timeout`) → "인터넷 연결을 확인해주세요."
   - Not found 계열(예: `not found`, `404`, `no rows`) → "요청한 게시글을 찾을 수 없습니다."
   - 그 외 기본 → "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."

이 변경은 새 UX/에러 처리 규칙을 코드에 적용해 사용자 경험을 개선하는 것을 목표로 합니다.

## 최종 검증 보고서 (요약)

- **테스트 환경**:
   - 로컬: Playwright E2E 테스트가 `tests/auth-crud.spec.ts`로 추가되어 있으며 기본 `BASE_URL`은 `http://localhost:3000`입니다. 로컬에서 실행하려면 `TEST_EMAIL`과 `TEST_PASSWORD` 환경 변수를 설정해야 합니다.
   - Vercel(배포): Vercel에 배포된 URL은 현재 문서화되어 있지 않습니다. 배포 검증은 수동 확인이 필요합니다.

실행 예시(빠른 참고): PowerShell

```powershell
$env:TEST_EMAIL = "hseon@hs.ac.kr"
$env:TEST_PASSWORD = "seon!0505@"
npx playwright test
```

또는 Bash/macOS/Linux:

```bash
export TEST_EMAIL=your-test-email@example.com
export TEST_PASSWORD=your-test-password
npx playwright test
```

검증 보고서 템플릿과 자세한 검증 절차는 [docx/ch13.md](docx/ch13.md)의 "검증 보고서 템플릿 예시"를 참고하세요.

- **Playwright 테스트 결과**:
   - 테스트 스크립트는 존재하며 환경변수(`TEST_EMAIL`/`TEST_PASSWORD`)가 없을 경우 테스트를 건너뛰도록 안전 장치가 있습니다.
   - 사용자가 로컬에서 `npx playwright test`를 실행한 결과, 환경변수 누락으로 인한 스킵 또는 브라우저별 타이밍 이슈로 실패가 보고되었습니다. 즉시 통과 상태가 아니며, CI/로컬에서 신뢰 가능한 통과를 위해서는 테스트 계정과 앱 접근성이 필요합니다.

- **배포 URL 수동 검증 결과**:
   - 현재 시점에서 배포된 Vercel URL로의 수동 검증은 수행되지 않았습니다. (확인 필요)

- **아직 확인이 필요한 항목**:
   - `supabase` 마이그레이션이 실제 프로덕션 DB에 적용되었는지 확인 (특히 RLS 정책 적용 여부). (확인 필요)
   - `app/posts/new`의 서버사이드 인증 보호(서버 컴포넌트나 미들웨어로의 리디렉션)이 구현되었는지 확인. 현재는 클라이언트 측 `AuthProvider`에 의존. (확인 필요)
   - 서비스/관리자 키(`service_role` 등)가 클라이언트에 노출되어 있지 않은지 grep 검사 필요. (확인 필요)
   - `PostContent`에 Markdown/HTML 렌더링이 추가될 경우 XSS 방지(HTML sanitize) 적용 여부 확인. 현재는 단순 텍스트 렌더링. (확인 필요)
   - Playwright E2E를 CI에서 안정적으로 통과시키려면 테스트 계정 시크릿 등록 및 네트워크/타이밍 안정화 필요. (확인 필요)

위 항목들을 하나씩 점검하면 배포 전 보안·정합성·테스트 신뢰도를 확보할 수 있습니다.