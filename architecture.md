# ARCHITECTURE.md — my-first-web 프로젝트 설계

## 1. 프로젝트 목표

### 개요
개인 기술 블로그 플랫폼을 구축하는 Next.js 학습 프로젝트입니다.

### 핵심 기능
- 📖 공개 블로그 글 조회 (누구나 가능)
- ✍️ 글 작성/수정/삭제 (로그인 필수)
- 👤 사용자 인증 (회원가입, 로그인)
- 🏠 마이페이지 (내 정보, 내 글 관리)

### 학습 목표
- Next.js 16 App Router 숙달
- React 19 Server/Client Components 구분
- Tailwind CSS 4 활용
- Supabase 인증 및 데이터베이스 연동

---

## 2. 페이지 맵 (Page Map)

### 2.1 URL 구조

#### Public Pages (누구나 접근 가능)

```
/                       → 홈 (소개, 최근 글 미리보기)
/posts                  → 글 목록 (검색 기능)
/posts/[id]             → 글 상세 (댓글 표시 준비)
/login                  → 로그인 페이지
/signup                 → 회원가입 페이지
/users/[id]             → 사용자 프로필 (OPTIONAL)
```

#### Protected Pages (로그인 필수)

```
/posts/new              → 글 작성 폼
/posts/[id]/edit        → 글 수정 폼
/profile                → 마이페이지 (내 정보 + 내 글)
```

### 2.2 파일 구조

```
app/
├── layout.tsx                    # 루트 레이아웃
├── page.tsx                      # 홈
├── login/
│   └── page.tsx                  # 로그인
├── signup/
│   └── page.tsx                  # 회원가입
├── profile/
│   └── page.tsx                  # 마이페이지
├── posts/
│   ├── page.tsx                  # 글 목록
│   ├── new/
│   │   └── page.tsx              # 글 작성
│   └── [id]/
│       ├── page.tsx              # 글 상세
│       └── edit/
│           └── page.tsx          # 글 수정
├── users/
│   └── [id]/
│       └── page.tsx              # 사용자 프로필 (OPTIONAL)
└── components/
    ├── Nav.tsx                   # 헤더/네비게이션
    └── SearchBar.tsx             # 검색 바
```

---

## 3. 유저 플로우 (User Flow)

### 3.1 글 읽기 (Public)

```
홈 (/)
  ↓
글 목록 (/posts)
  ├─ 검색 또는 스크롤
  ├─ 글 선택
  ↓
글 상세 (/posts/[id])
  ├─ 글 읽기
  ├─ [작성자 프로필 보기] (선택)
  └─ [목록으로]
```

**필요 기능**: 없음 (공개)
**권한 체크**: 필요 없음

---

### 3.2 글 작성/수정 (Protected)

#### 2.2.1 글 작성

```
어디서나
  ↓
[새 글 작성] 버튼 클릭
  ↓
로그인 여부 확인
  ├─ 로그인 안 함 → /login으로 리다이렉트
  └─ 로그인 함 → 계속
  ↓
글 작성 폼 (/posts/new)
  ├─ 제목 입력
  ├─ 내용 입력
  ├─ [작성 완료]
  ↓
글 상세 (/posts/[id])
  └─ 작성 완료 확인
```

**필요 기능**: 
- 로그인 상태 확인 (Protected Route)
- 글 생성 (Supabase)
- 자동 리다이렉트

---

#### 3.2.2 글 수정

```
글 상세 (/posts/[id])
  ├─ [수정] 버튼 (본인 글만)
  ↓
글 수정 폼 (/posts/[id]/edit)
  ├─ 제목 수정
  ├─ 내용 수정
  ├─ [저장]
  ↓
글 상세 (/posts/[id])
  └─ 수정 완료 확인
```

**필요 기능**:
- 작성자 권한 확인
- 글 업데이트 (Supabase)

---

### 3.3 마이페이지 (Protected)

```
어디서나
  ↓
헤더의 [프로필] 메뉴
  ↓
로그인 여부 확인
  ├─ 로그인 안 함 → /login으로 리다이렉트
  └─ 로그인 함 → 계속
  ↓
마이페이지 (/profile)
  ├─ 내 정보 섹션
  │   ├─ 이름
  │   ├─ 이메일
  │   ├─ 가입일
  │   └─ 작성한 글 수
  │
  ├─ 내가 작성한 글 목록
  │   ├─ 글 제목, 작성일, 상태
  │   ├─ [수정] 버튼 → /posts/[id]/edit
  │   └─ [삭제] 버튼 (확인 후)
  │
  └─ [로그아웃]
      ↓
      홈 (/로 리다이렉트)
```

**필요 기능**:
- 로그인 상태 확인 (Protected Route)
- 사용자 정보 조회 (Supabase)
- 내 글 목록 조회 (필터링)
- 글 삭제 (권한 확인)
- 로그아웃

---

## 4. 데이터 모델

### 4.1 테이블 구조

#### users (Supabase Auth)
Supabase의 기본 `auth.users` 테이블 사용
```
- id (UUID)              # 사용자 고유 ID
- email (TEXT)           # 이메일 (로그인)
- encrypted_password     # 암호화된 비밀번호
- created_at (TIMESTAMP) # 가입일
- updated_at (TIMESTAMP) # 수정일
```

#### posts
```
- id (BIGINT)            # 글 고유 ID (자동 생성)
- title (TEXT)           # 글 제목
- content (TEXT)         # 글 내용
- author (TEXT)          # 글쓴이 (표시명)
- user_id (UUID)         # 작성자 (Supabase auth.users.id 외래키)
- created_at (TIMESTAMP) # 작성일 (UTC)
- updated_at (TIMESTAMP) # 수정일 (UTC)
```

### 4.2 관계도

```
auth.users (1)  ──→  (N) posts
     ↓                       
    id                    user_id
              
- 1명의 사용자 → 여러 글 작성 가능 (1:N)
- 글 삭제 시 user_id가 CASCADE DELETE 됨
- 공개/비공개 설정 없음 (모든 글 공개)

---

## 6. 보안 계층 (Security)

- **원칙**: UI에서의 분기(버튼 숨김, 링크 비표시)는 UX/편의성일 뿐 보안이 아니다. 실제 권한 강제는 데이터베이스 레벨의 RLS(Row Level Security)로 수행한다.
- **계층 구분**:
  - 프론트엔드(UI): 사용자 경험(버튼/메뉴 노출), 빠른 피드백
  - 애플리케이션 로직: 입력 유효성, UX 기반 추가 체크(예: 폼 검증)
  - 데이터베이스(RLS): 최종 권한 검증 및 강제 — 신뢰 가능한 보안 계층

### 보호 정책 목록 (posts 테이블)

- SELECT: 누구나 읽기 허용 (`USING (true)`) — 공개 읽기
- INSERT: 인증된 사용자만 가능, 삽입되는 `user_id`는 `auth.uid()`와 일치해야 함 (`WITH CHECK (auth.uid() = user_id)`)
- UPDATE: 작성자 본인만 (`USING (auth.uid() = user_id)` + `WITH CHECK (auth.uid() = user_id)`) — 기존 행과 업데이트 결과 모두 검증
- DELETE: 작성자 본인만 (`USING (auth.uid() = user_id)`)

### 운영 규칙

- RLS SQL은 반드시 `supabase/migrations/*`에 마이그레이션 파일로 남기고 Git에 커밋한다.
- `service_role` 또는 서버 전용 키는 클라이언트 코드(브라우저/앱)에 절대 포함하지 않는다.
- 보안 관련 변경 후에는 다른 계정으로 우회 테스트(익명, 사용자 A, 사용자 B)를 수행해 검증한다.
```

### 4.3 Row Level Security (RLS) 정책 (Ch11 기준)

- 원칙: RLS는 데이터베이스 수준의 보안이다. 클라이언트 UI 분기(버튼 숨김 등)는 UX일 뿐 실제 보안이 아니다.
- RLS 정책은 Supabase CLI 마이그레이션으로 관리한다. 대시보드 SQL Editor에서 직접 실행하지 말고, 마이그레이션 파일로 기록하여 Git에 남긴다.

| 작업 | 정책 | 조건 |
|------|------|------|
| **SELECT** | 모두 읽기 | 모든 사용자 허용 (USING (true)) |
| **INSERT** | 인증 필수 + user_id 고정 | `WITH CHECK (auth.uid() = user_id)` — 삽입되는 `user_id`는 `auth.uid()`와 일치해야 함 |
| **UPDATE** | 작성자만 | `USING (auth.uid() = user_id)` + `WITH CHECK (auth.uid() = user_id)` — 기존 행과 변경 결과 모두 검사 |
| **DELETE** | 작성자만 | `USING (auth.uid() = user_id)` |

- 핵심 포인트:
  - `auth.uid()`를 기준으로 `posts.user_id`와 일치하는지 검증해야 한다.
  - RLS SQL은 반드시 `supabase/migrations/<timestamp>_*.sql`에 남겨 재현 가능하도록 한다.
  - `service_role` 또는 서버 전용 키는 절대 클라이언트 코드에서 사용하지 않는다.

### 4.4 TypeScript 타입 정의

```typescript
// Post 타입
interface Post {
  id: number
  title: string
  content: string
  author: string
  user_id?: string | null
  created_at: string
  updated_at: string
}

// User 타입 (Supabase Auth)
interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
}
```

---

## 5. 컴포넌트 구조

### 5.1 shadcn/ui 컴포넌트 활용

#### Button
**사용 위치**: 모든 페이지의 CTA 및 액션 버튼
```
- 기본 (default): 글 쓰기, 저장, 확인 등 주요 액션
- outline: 취소, 목록으로, 수정 등 보조 액션
- destructive: 삭제 버튼 (빨강)
- size: "sm" (소), "md" (기본), "lg" (큼)
```

**적용 페이지**:
- Nav: "새 글 쓰기" 버튼
- 홈 (/): "모든 글 보기", "글 쓰기" 버튼
- 글 목록 (/posts): "새 글 작성" 버튼, 수정/삭제 버튼
- 글 상세 (/posts/[id]): 사이드바 액션 버튼
- 글 작성 (/posts/new): "작성 완료", "취소" 버튼
- 글 수정 (/posts/[id]/edit): "저장", "취소" 버튼
- 마이페이지 (/profile): "로그아웃" 버튼

#### Card
**사용 위치**: 콘텐츠 컨테이너
```
- CardHeader: 제목 섹션
- CardTitle: 카드 제목
- CardContent: 본문 내용
```

**적용 페이지**:
- 홈 (/): 최근 글 카드, 블로그 특징 카드
- 글 목록 (/posts): PostCard 컴포넌트 (글 미리보기)
- 글 상세 (/posts/[id]): 사이드바 액션 카드
- 글 작성 (/posts/new): 폼 컨테이너
- 글 수정 (/posts/[id]/edit): 폼 컨테이너
- 마이페이지 (/profile): 사용자 정보 카드, 글 목록 카드

#### Input
**사용 위치**: 폼 입력 필드
```
- type="text": 제목, 검색어, 작성자명
- type="email": 로그인, 회원가입
- type="password": 로그인, 회원가입
```

**적용 페이지**:
- Nav: SearchBar 컴포넌트
- 글 작성 (/posts/new): 제목, 작성자 입력
- 글 수정 (/posts/[id]/edit): 제목, 작성자 수정
- 로그인 (/login): 이메일, 비밀번호 입력
- 회원가입 (/signup): 이메일, 비밀번호, 확인 입력

#### Dialog
**사용 위치**: 모달 확인 창
```
- DialogContent: 모달 컨테이너
- DialogTitle: 제목
- DialogDescription: 설명
- DialogAction: 확인 버튼
- DialogCancel: 취소 버튼
```

**적용 페이지**:
- 글 목록 (/posts): 글 삭제 확인
- 글 상세 (/posts/[id]): 글 삭제 확인
- 마이페이지 (/profile): 글 삭제 확인, 로그아웃 확인

### 5.2 커스텀 컴포넌트 구조

#### Nav (app/components/Nav.tsx)
- 헤더/네비게이션 바
- 로고 + 네비게이션 링크
- SearchBar 포함 (선택사항)
- 로그인 상태 표시 (로그인 후)

#### SearchBar (app/components/SearchBar.tsx)
- 검색 입력 필드 (Input 컴포넌트)
- 실시간 필터링
- 제목, 내용, 작성자 검색

#### PostCard (app/components/PostCard.tsx)
- 글 미리보기 카드 (Card 컴포넌트)
- 제목, 작성자, 작성일 표시
- 내용 3줄 요약 (line-clamp-3)
- 링크 → 글 상세 페이지

#### PostDetailHeader (app/components/PostDetailHeader.tsx)
- 글 상세 페이지 헤더
- 제목, 작성자, 작성일 표시
- 액션 버튼 (코드, 메모, 공유 - 향후 추가)

#### PostContent (app/components/PostContent.tsx)
- 글 본문 콘텐츠 영역
- 마크다운 렌더링 (향후)
- 긴 텍스트 최적화 (line-height, letter-spacing)

#### PostSidebar (app/components/PostSidebar.tsx)
- 글 상세 페이지 사이드바
- 목록으로, 수정, 삭제 버튼 (Button 컴포넌트)
- 삭제 확인 Dialog
- 조회수 등 메타 정보 (향후)

#### Footer (app/components/Footer.tsx)
- 사이트 푸터
- 정보, 페이지 링크, SNS 링크
- 모든 페이지 하단에 고정

### 5.3 상태 관리

#### Client Components (상태 필요)
- SearchBar: 검색어 상태
- PostCard: 호버 상태
- PostSidebar: 삭제 Dialog 상태
- 글 작성/수정: 폼 데이터, 로딩 상태

---

## 7. Error & UX Improvements (Ch12)

### 7.1 추가된 파일
- `app/loading.tsx` — 루트 로딩 스켈레톤
- `app/error.tsx` — 루트 에러 바운더리 (친절한 메시지 + 재시도/새로고침)
- `app/posts/loading.tsx`, `app/posts/[id]/loading.tsx` — 세그먼트별 로딩 스켈레톤
- `lib/error-message.ts` — Supabase/네트워크 에러를 사용자 메시지로 변환하는 유틸
- `lib/messages.ts` — 공통 메시지 상수

### 7.2 화면별 상태 정책
- 루트(`/`): 로딩 → `app/loading.tsx`, 에러 → `app/error.tsx`
- 글 목록(`/posts`): 로딩 → `app/posts/loading.tsx`, 빈 목록 → 안내 문구, 에러 → 사용자용 메시지(콘솔에 원문 로그)
- 글 상세(`/posts/[id]`): 로딩 → `app/posts/[id]/loading.tsx`, 글 없음 → '게시글을 찾을 수 없습니다' 안내, 에러 → 사용자용 메시지
- 글 작성(`/posts/new`): 입력 검증, 제출 중 로딩/버튼 비활성화, 필드별 에러 표시, 서버 에러는 `lib/error-message.ts`로 매핑하여 표시
- 로그인/회원가입: Supabase 에러를 `lib/error-message.ts`로 매핑해 사용자에게 친절한 메시지 표시

### 7.3 폼 검증 규칙 (요약)
- 제목: 필수, 최소 2자
- 내용: 필수, 최소 10자
- 작성자(작성자명): 필수
- 제출 중에는 제출 버튼을 비활성화하여 중복 제출을 방지
- 필드별 에러는 입력 아래에 표시하고 ARIA 속성(`aria-invalid`, `aria-describedby`)을 사용

### 7.4 에러 메시지 매핑 규칙 (`lib/error-message.ts`)
- `42501` 또는 `row-level security` 또는 `permission denied` → "이 작업을 수행할 권한이 없습니다."
- `Failed to fetch` 또는 네트워크 관련 → "인터넷 연결을 확인해주세요."
- `not found` 계열(404, no rows) → "요청한 게시글을 찾을 수 없습니다."
- 그 외 기본 → "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요."

이 섹션은 사용자 경험을 일관되게 만들기 위해 에러 처리 및 로딩 UX 가이드를 프로젝트 문서에 반영한 것입니다.
- 로그인/회원가입: 폼 데이터, 에러 메시지

#### Server Components (상태 불필요)
- Nav: 정적 네비게이션
- PostContent: 글 내용 표시
- 페이지 레이아웃

### 5.4 컴포넌트 계층 구조

```
<RootLayout>
  │
  ├─ <Nav />                    (Server)
  │
  ├─ <main>
  │   ├─ [Page Content]         (Server)
  │   │   │
  │   │   ├─ <PostCard />       (Server)
  │   │   ├─ <SearchBar />      (Client - 상태 관리)
  │   │   ├─ <PostDetailHeader /> (Server)
  │   │   ├─ <PostContent />    (Server)
  │   │   └─ <PostSidebar />    (Client - Dialog, 삭제)
  │   │
  │   └─ [Form Pages]           (Client)
  │       ├─ <Input />          (shadcn)
  │       ├─ <Button />         (shadcn)
  │       └─ <Card />           (shadcn)
  │
  └─ <Footer />                 (Server)
```

---

## 6. 기술 스택

### Frontend
- **Framework**: Next.js 16.2.1 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui

### Backend / Database
- **BaaS**: Supabase
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth (Email/Password)

### Development
- **Language**: TypeScript
- **Package Manager**: npm
- **Build Tool**: Turbopack (Next.js 내장)

---

## 7. 인증 및 권한

### 로그인 플로우

```
[로그인 페이지] (/login)
  ↓
이메일 + 비밀번호 입력
  ↓
Supabase Auth에 인증 요청
  ↓
성공 → JWT 토큰 저장 → /posts로 리다이렉트
실패 → 에러 메시지 표시
```

### Protected Routes

```
라우트 접근 시
  ↓
AuthProvider에서 로그인 상태 확인
  ↓
로그인 안 함 → /login으로 리다이렉트
로그인 함 → 페이지 렌더링
```

### 권한 관리

- **글 작성**: 로그인한 사용자 O
- **글 수정/삭제**: 본인 글만 O (작성자 확인)
- **마이페이지**: 본인 정보만 O

---

## 8. API / 데이터 흐름

```
Server Components (데이터 조회)
├─ getPosts()           → Supabase에서 모든 글 조회
├─ getPost(id)          → 특정 글 조회
└─ getMyPosts()         → 내 글 목록 조회

Client Components (사용자 상호작용)
├─ createPost()         → 새 글 작성
├─ updatePost()         → 글 수정
├─ deletePost()         → 글 삭제
└─ login/logout()       → 인증 처리
```

---

## 9. 개발 로드맵

### Phase 1: 기본 구조 (완료)
- [x] Next.js 프로젝트 초기화
- [x] 페이지 레이아웃 구성
- [x] 홈, 글 목록, 글 상세 페이지
- [x] 글 작성, 글 수정 UI
- [x] Supabase 라이브러리 설치

### Phase 2: 인증 & DB 연동 (진행 중)
- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 실행
- [ ] 포스트 CRUD 기능 테스트
- [ ] 로그인/회원가입 페이지
- [ ] Protected Routes 미들웨어

### Phase 3: 마이페이지 & 고급 기능
- [ ] 마이페이지 구현
- [ ] 사용자 프로필 페이지 (선택)
- [ ] 댓글 기능 (선택)
- [ ] 좋아요 기능 (선택)

---

## 10. 주의사항

### Next.js App Router
- ❌ `pages/` 디렉토리 사용 금지 (App Router만 사용)
- ❌ `next/router` 사용 금지 → `next/navigation` 사용
- ✅ Server Components가 기본
- ✅ `"use client"` 필요할 때만 작성

### 성능 & 보안
- Row Level Security (RLS) 필수 (Supabase)
- 환경변수는 `.env.local`에만 저장
- 민감한 정보는 절대 클라이언트에 노출 금지

---

## 참고 문서

- [PAGE_MAP.md](./PAGE_MAP.md) - 상세 페이지맵 및 플로우
- [copilot-instructions.md](./copilot-instructions.md) - 코딩 컨벤션
- [context.md](./context.md) - 프로젝트 진행 상황
