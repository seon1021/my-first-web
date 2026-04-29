-- posts 테이블 생성 (이미 있으면 스킵)
CREATE TABLE IF NOT EXISTS posts (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Row Level Security 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책
DROP POLICY IF EXISTS "Everyone can read posts" ON posts;
CREATE POLICY "Everyone can read posts"
  ON posts FOR SELECT
  USING (true);

-- 모두 작성 가능 (테스트용)
DROP POLICY IF EXISTS "Everyone can create posts" ON posts;
CREATE POLICY "Everyone can create posts"
  ON posts FOR INSERT
  WITH CHECK (true);

-- 모두 수정 가능 (테스트용)
DROP POLICY IF EXISTS "Everyone can update posts" ON posts;
CREATE POLICY "Everyone can update posts"
  ON posts FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 모두 삭제 가능 (테스트용)
DROP POLICY IF EXISTS "Everyone can delete posts" ON posts;
CREATE POLICY "Everyone can delete posts"
  ON posts FOR DELETE
  USING (true);

-- 테스트 데이터 (선택사항)
INSERT INTO posts (title, content, author) VALUES
  ('React 19 새 기능 정리', 'React 19에서 달라진 점...', '김코딩'),
  ('Tailwind CSS 4 변경사항', 'Tailwind CSS 4의 핵심...', '이디자인'),
  ('Next.js 16 App Router 가이드', 'App Router를 사용하면...', '박개발');
