-- comments 테이블 생성
CREATE TABLE IF NOT EXISTS comments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Row Level Security 활성화
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 1. 모두가 댓글 조회 가능
CREATE POLICY "Everyone can read comments"
  ON comments FOR SELECT
  USING (true);

-- 2. 인증된 사용자만 자신의 댓글 작성 가능 (user_id 일치 확인)
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. 작성자 본인만 댓글 삭제 가능
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- (선택사항) 초기 테스트 데이터가 필요하다면 아래의 주석을 풀고 사용하세요
-- INSERT INTO comments (post_id, user_id, author_email, content)
-- VALUES 
--   (1, 'TEST_USER_ID', 'test@example.com', '좋은 글이네요!');
