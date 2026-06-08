-- Enable RLS on profiles table
alter table public.profiles enable row level security;

-- Allow anyone to read profiles
create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

-- Allow users to create their own profile
create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

-- Allow users to update their own profile
create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id )
  with check ( auth.uid() = id );
