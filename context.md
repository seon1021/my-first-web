# Context — my-first-web 프로젝트 상태

## 현재 상태

- 마지막 작업일: 2026-04-29
- 완료된 작업: 홈 페이지, 헤더/푸터 레이아웃, 포스트 목록, 포스트 상세, 포스트 CRUD UI
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
   - SQL Editor에서 `lib/schema.sql` 내용 실행

2. **포스트 CRUD 테스트**
   - 환경변수 설정 후 `npm run dev`로 실행
   - 포스트 생성/수정/삭제 기능 테스트

3. **로그인/회원가입 구현**
   - Supabase Auth 설정
   - AuthProvider 구현
   - 로그인/회원가입 페이지

4. **마이페이지 구현**