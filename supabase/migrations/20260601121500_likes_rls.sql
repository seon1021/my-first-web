-- likes 테이블에 RLS 및 정책 추가
alter table likes enable row level security;

-- 모든 사용자가 좋아요 수를 조회할 수 있도록 허용
create policy "allow_read_likes" on likes for select using (true);

-- 인증된 사용자는 자신의 좋아요를 추가할 수 있도록 허용
create policy "allow_insert_own_like" on likes for insert with check (
  auth.uid() = user_id
);

-- 인증된 사용자는 자신의 좋아요를 삭제할 수 있도록 허용
create policy "allow_delete_own_like" on likes for delete using (
  auth.uid() = user_id
);

-- 참고: supabase CLI 또는 SQL 에디터로 이 마이그레이션을 적용하세요.
