-- Storage 정책 초기화 및 완전 허용 설정
drop policy if exists "Avatar images are publicly accessible." on storage.objects;
drop policy if exists "Anyone can upload an avatar." on storage.objects;
drop policy if exists "Anyone can update their own avatar." on storage.objects;
drop policy if exists "Anyone can delete their own avatar." on storage.objects;

drop policy if exists "Post images are publicly accessible." on storage.objects;
drop policy if exists "Anyone can upload post images." on storage.objects;
drop policy if exists "Anyone can update post images." on storage.objects;
drop policy if exists "Anyone can delete post images." on storage.objects;

drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Insert Access" on storage.objects;
drop policy if exists "Update Access" on storage.objects;
drop policy if exists "Delete Access" on storage.objects;

-- 조회: 누구나
create policy "Public Access"
on storage.objects for select
using ( bucket_id in ('avatars', 'posts') );

-- 생성: 누구나
create policy "Insert Access"
on storage.objects for insert
with check ( bucket_id in ('avatars', 'posts') );

-- 수정: 누구나 (upsert: true 시 필수)
create policy "Update Access"
on storage.objects for update
using ( bucket_id in ('avatars', 'posts') );

-- 삭제: 누구나
create policy "Delete Access"
on storage.objects for delete
using ( bucket_id in ('avatars', 'posts') );
