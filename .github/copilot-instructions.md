## Tech Stack

- Next.js 16.2.1 (App Router only)
- React 19.2.4
- Tailwind CSS 4
- shadcn/ui (components/ui/ 경로에 설치됨)

## Coding Conventions

- Default to Server Components unless a Client Component is required.
- Use Tailwind CSS for styling.
- Keep components simple and easy to verify.
- Prefer files inside `app/` for routes.

## Design Tokens

### 색상 (CSS 변수 기반)
- **Primary**: `oklch(0.35 0.1 240)` - 차분한 파란색 (버튼, 링크, 포커스)
- **Background**: `oklch(0.99 0 0)` - 거의 흰색
- **Foreground**: `oklch(0.15 0 0)` - 거의 검정색 (텍스트)
- **Card**: `oklch(1 0 0)` - 순백색
- **Border**: `oklch(0.93 0 0)` - 밝은 회색
- **Muted**: `oklch(0.93 0 0)` - 밝은 회색 (보조 텍스트)
- **Destructive**: `oklch(0.577 0.245 27.325)` - 빨강 (삭제 버튼)

### 컴포넌트 스타일
- **Card**: shadcn/ui Card 컴포넌트 사용
  - 클래스: `rounded-lg shadow-sm`
  - 외부 여백: `p-6`
- **Button 변형**:
  - 기본: `variant="default"` (차분한 파란색)
  - 테두리: `variant="outline"` (미묘한 테두리)
  - 위험: `variant="destructive"` (빨강)
- **Input**: shadcn/ui Input 컴포넌트
  - 스타일: `border border-border rounded-md`
  - 포커스: `ring-2 ring-primary`

### 레이아웃 & 간격
- **Max width**: `max-w-4xl mx-auto` (메인 컨텐츠)
- **페이지 간격**: `py-12 px-4` (수직 여백, 수평 여백)
- **컨텐츠 간격**: `space-y-6` (요소 간 간격)
- **카드 내부 간격**: `p-6`
- **섹션 간격**: `mb-8` (섹션 아래 간격)

### 반응형 디자인
- **모바일**: 1열 (기본)
- **태블릿+** (`md` 이상): 2열 그리드 `grid-cols-1 md:grid-cols-2`
- **간격**: `gap-6` (그리드 아이템 간격)

### 타이포그래피
- **제목**: `font-bold tracking-tight`
- **본문**: `text-base leading-7`
- **메타 정보**: `text-sm text-muted-foreground`

### 그림자 & 효과
- **카드**: `shadow-sm` (미묘한 그림자)
- **포커스**: `ring-2 ring-primary` (부드러운 포커스 링)
- **호버**: 색상 변화 또는 그림자 강화

## Component Rules

### shadcn/ui 컴포넌트 사용
- **우선순위**: shadcn/ui 컴포넌트 > 커스텀 컴포넌트 > HTML 요소
- **위치**: `components/ui/` 디렉토리
- **설치된 컴포넌트**:
  - `Button` - 모든 버튼
  - `Card` - 콘텐츠 컨테이너
  - `Input` - 텍스트 입력
  - `Dialog` - 모달 & 확인 창

### 커스텀 컴포넌트
- **위치**: `components/` 루트 (UI 컴포넌트와 분리)
- **예시**:
  - `components/PostCard.tsx` - 글 카드
  - `components/PostDetailHeader.tsx` - 상세 페이지 헤더
  - `components/PostSidebar.tsx` - 사이드바
  - `components/Footer.tsx` - 푸터
  - `components/Nav.tsx` - 네비게이션

### 스타일링 규칙
- **CSS 변수 우선**: Tailwind 기본 컬러 직접 사용 금지
  - ❌ `text-pink-500` (금지)
  - ✅ `text-primary` (권장)
  - ✅ `bg-card text-foreground` (권장)
- **클래스 조합**: `clsx()` 또는 `cn()` 사용
- **변수 사용**:
  - 텍스트 색상: `text-primary`, `text-muted-foreground`
  - 배경: `bg-background`, `bg-card`
  - 테두리: `border-border`

### Button 컴포넌트 사용
```tsx
// 기본 버튼 (파란색)
<Button>작성</Button>

// 테두리 버튼
<Button variant="outline">취소</Button>

// 위험 버튼 (빨강)
<Button variant="destructive">삭제</Button>

// 작은 크기
<Button size="sm">작음</Button>
```

### Card 컴포넌트 사용
```tsx
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
  </CardHeader>
  <CardContent>
    내용
  </CardContent>
</Card>
```

### Dialog 컴포넌트 사용
```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogTitle>제목</DialogTitle>
    <DialogDescription>설명</DialogDescription>
    <DialogCancel>취소</DialogCancel>
    <DialogAction>확인</DialogAction>
  </DialogContent>
</Dialog>
```

### Input 컴포넌트 사용
```tsx
<Input
  type="text"
  placeholder="입력..."
  className="w-full"
/>
```

## Known AI Mistakes

- Do not use `next/router`; use `next/navigation` when navigation is needed.
- Do not create `pages/` router files; this project uses the App Router.
- Do not add `"use client"` unless interactivity or browser APIs are actually needed.

