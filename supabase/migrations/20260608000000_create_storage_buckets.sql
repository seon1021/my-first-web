-- Create "avatars" bucket
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

-- Create "posts" bucket
insert into storage.buckets (id, name, public) values ('posts', 'posts', true);

-- Set up access controls for avatars
create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );

create policy "Anyone can update their own avatar."
  on storage.objects for update
  with check ( bucket_id = 'avatars' );

create policy "Anyone can delete their own avatar."
  on storage.objects for delete
  using ( bucket_id = 'avatars' );

-- Set up access controls for posts
create policy "Post images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'posts' );

create policy "Anyone can upload post images."
  on storage.objects for insert
  with check ( bucket_id = 'posts' );

create policy "Anyone can update post images."
  on storage.objects for update
  with check ( bucket_id = 'posts' );

create policy "Anyone can delete post images."
  on storage.objects for delete
  using ( bucket_id = 'posts' );
