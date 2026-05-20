# TODO — my-first-web

## 1단계: 기본 구조 (Ch7~8)

- [x] ARCHITECTURE.md 작성
- [x] copilot-instructions.md 작성
- [x] shadcn/ui 초기화 + 테마 설정
- [x] 헤더/푸터 레이아웃
- [x] 홈 페이지
- [x] Supabase 프로젝트 설정 (라이브러리 설치, 환경변수 템플릿, 클라이언트 초기화)
- [ ] 데이터베이스 스키마 마이그레이션 생성 및 적용 (Supabase CLI 사용, SQL Editor 직접 실행 금지)

## 2단계: 핵심 기능 (Ch9~10)

- [x] 포스트 목록 페이지 - Supabase 연동
- [x] 포스트 상세 페이지 - Supabase 연동
- [x] 포스트 작성 페이지 - Supabase 연동
- [x] 포스트 수정 페이지 신규 생성
- [x] 포스트 CRUD 테스트 (환경변수 설정 후)
- [x] 로그인/회원가입

## 3단계: 고급 기능 (Ch11~12)

- [x] 마이페이지
- [x] 댓글 기능

## Ch11 RLS 관련 TODO

- [x] posts RLS 마이그레이션 생성 (`supabase/migrations/20260520142154_add_posts_rls.sql`)
- [x] DB 적용 (`npx supabase db push` 결과 확인 필요)
- [ ] 다른 계정 우회 테스트 (다른 사용자/비로그인 시나리오 검증)
- [ ] 보안 키 노출 grep (`service_role`, `SUPABASE_SERVICE_ROLE`, `sb_secret_`, `sbp_` 등 검색)
- [ ] 빌드/배포 검증 (CI에서 환경변수/마이그레이션 적용 확인)

## 진행률: 15/15 (100%)