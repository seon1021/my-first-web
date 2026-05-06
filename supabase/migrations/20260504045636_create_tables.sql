create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text,
  avatar_url text,
  role text not null default 'user' check (role in ('user', 'counselor')),
  created_at timestamptz default now()
);

-- posts: 블로그 글
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  content text not null,
  created_at timestamptz default now()
);