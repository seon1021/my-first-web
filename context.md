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