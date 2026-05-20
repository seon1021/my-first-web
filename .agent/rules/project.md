# Agent Project Rules (based on Ch7/Ch11)

- Project tech: Next.js 16 (App Router), React 19, Tailwind CSS 4, shadcn/ui.
- Database and security:
  - Supabase RLS 정책은 SQL Editor가 아닌 Supabase CLI 마이그레이션으로 관리 (`supabase/migrations/` 경로).
  - posts 테이블의 RLS는 `auth.uid() = user_id` 기준으로 작성.
  - 클라이언트에서 `service_role` 또는 서버 전용 키를 절대 사용하지 않는다.
  - 민감 키(예: `SUPABASE_SERVICE_ROLE`, `sb_secret_`, `sbp_`)는 `app/`, `lib/`, `components/` 등 클라이언트 코드에 노출되지 않도록 검사.
- Workflow:
  - 스키마/정책 변경 시 `npx supabase migration new <name>`으로 마이그레이션 생성하고, 마이그레이션 파일을 Git에 커밋.
  - 로컬 적용은 `npx supabase db push` 또는 테스트용 `npx supabase db reset` 사용.
- Coding conventions:
  - Server Components 기본, 클라이언트 전용 기능에만 `"use client"` 추가.
  - shadcn/ui 컴포넌트 우선 사용.
- Checks for RLS work (preflight):
  - `lib/schema.sql` 또는 생성된 마이그레이션에 `ALTER TABLE posts ENABLE ROW LEVEL SECURITY;` 포함 여부.
  - INSERT에는 `WITH CHECK (auth.uid() = user_id)`가 있는지.
  - UPDATE에는 `USING`과 `WITH CHECK`에 `auth.uid() = user_id`가 있는지.
  - DELETE에는 `USING (auth.uid() = user_id)`가 있는지.

