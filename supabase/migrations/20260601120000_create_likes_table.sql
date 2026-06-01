-- likes 테이블: 게시글 좋아요 저장
create table if not exists likes (
  id bigserial primary key,
  post_id bigint references posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  constraint unique_like_per_user_per_post unique (post_id, user_id)
);

-- 간단한 RLS 정책 예시 (프로젝트에 맞게 조정 필요)
-- enable row level security;
-- create policy "allow_read_likes" on likes for select using (true);
-- create policy "allow_insert_own_like" on likes for insert with check (auth.uid() = user_id);
-- create policy "allow_delete_own_like" on likes for delete using (auth.uid() = user_id);
