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
 - [x] 에러 처리 및 로딩/UX 개선 (Ch12)

## Ch12 완료 항목 — 에러/UX 개선 체크리스트

- 로드/로딩 UX
	- `app/loading.tsx` 추가 — 루트 스켈레톤
	- `app/posts/loading.tsx`, `app/posts/[id]/loading.tsx` 추가 — 세그먼트 스켈레톤

- 에러 처리
	- `app/error.tsx` 추가 — 루트 에러 바운더리로 친절한 메시지 제공 및 재시도/새로고침
	- `lib/error-message.ts` 추가 — Supabase/네트워크 에러를 사용자 메시지로 매핑

- 폼/입력 UX
	- `app/posts/new/page.tsx`에 클라이언트 유효성 검사 추가
		- 제목: 필수, 최소 2자
		- 내용: 필수, 최소 10자
		- 제출 중 버튼 비활성화 및 필드별 에러 메시지 표시

완료 후 확인 사항
- 로그인/회원가입 페이지에서 에러 매핑 적용 (`app/login/page.tsx`, `app/signup/page.tsx`) — 완료
- 에러 메시지 문자열을 다른 페이지에서도 재사용하도록 `lib/messages.ts` 도입 — 반영됨


## Ch11 RLS 관련 TODO

- [x] posts RLS 마이그레이션 생성 (`supabase/migrations/20260520142154_add_posts_rls.sql`)
- [x] DB 적용 (`npx supabase db push` 결과 확인 필요)
- [ ] 다른 계정 우회 테스트 (다른 사용자/비로그인 시나리오 검증)
- [ ] 보안 키 노출 grep (`service_role`, `SUPABASE_SERVICE_ROLE`, `sb_secret_`, `sbp_` 등 검색)
- [ ] 빌드/배포 검증 (CI에서 환경변수/마이그레이션 적용 확인)

## 진행률: 15/15 (100%)

## 최종 검증 — 요약 체크리스트

- 테스트 환경
	- [ ] 로컬: `TEST_EMAIL`/`TEST_PASSWORD` 설정 후 `npx playwright test` 실행 및 통과 확인
	- [ ] Vercel: 배포 URL로 수동/CI E2E 실행하여 통과 확인 (확인 필요)

추가 작업 (Ch13 관련)

- [ ] Playwright 설치 및 테스트 파일(`tests/auth-crud.spec.ts`) 검증
- [ ] CI 또는 로컬에서 Playwright를 신뢰가능하게 통과시키기 위한 환경변수(테스트 계정) 등록
- [ ] 검증 보고서 작성 템플릿 사용 및 `docx/ch13.md`의 템플릿으로 보고서 생성
- [ ] Vercel 환경변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) 등록 여부 확인

- 보안
	- [ ] `service_role` 및 민감 키가 클라이언트 코드에 포함되어 있지 않은지 grep으로 확인 (확인 필요)
	- [ ] RLS 정책이 운영 DB에 적용되었는지 확인 (확인 필요)

- 서버/앱 동작
	- [ ] 서버사이드 경계 검증: `app/posts/new`가 서버에서 비인증 사용자 리디렉트/차단되는지 확인 (확인 필요)
	- [ ] Playwright 테스트 안정화 및 CI 통합 (확인 필요)
