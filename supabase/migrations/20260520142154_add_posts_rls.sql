-- posts RLS 마이그레이션 (마이그레이션 파일에 붙여넣기; 대시보드 직접 실행 금지)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- (안전) 과거에 사용되었을 수 있는 널리 퍼missive 정책명 제거
DROP POLICY IF EXISTS "Everyone can create posts" ON posts;
DROP POLICY IF EXISTS "Everyone can update posts" ON posts;
DROP POLICY IF EXISTS "Everyone can delete posts" ON posts;

-- 새 정책용 기존 동일 이름 제거(중복 방지)
DROP POLICY IF EXISTS "Everyone can read posts" ON posts;
DROP POLICY IF EXISTS "Authenticated users can create posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;

-- SELECT: 모두 읽기 허용
CREATE POLICY "Everyone can read posts"
	ON posts FOR SELECT
	USING (true);

-- INSERT: 인증된 사용자만, 삽입되는 user_id는 auth.uid()와 일치해야 함
CREATE POLICY "Authenticated users can create posts"
	ON posts FOR INSERT
	WITH CHECK (auth.uid() = user_id);

-- UPDATE: 작성자 본인만 (기존 행 검사와 업데이트 결과 둘 다 auth.uid() = user_id)
CREATE POLICY "Users can update own posts"
	ON posts FOR UPDATE
	USING (auth.uid() = user_id)
	WITH CHECK (auth.uid() = user_id);

-- DELETE: 작성자 본인만 삭제 가능
CREATE POLICY "Users can delete own posts"
	ON posts FOR DELETE
	USING (auth.uid() = user_id);
