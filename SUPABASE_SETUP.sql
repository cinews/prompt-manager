-- Create prompts table
create table if not exists public.prompts (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  title text not null,
  category text null,
  content text not null,
  usage text null,
  tags text[] null,
  is_liked boolean null default false,
  constraint prompts_pkey primary key (id)
);

-- Enable Row Level Security (RLS)
alter table public.prompts enable row level security;

-- Policy for SELECT
create policy "Enable read access for all users"
on public.prompts
for select
to public
using (true);

-- Policy for INSERT
create policy "Enable insert access for all users"
on public.prompts
for insert
to public
with check (true);

-- Policy for UPDATE
create policy "Enable update access for all users"
on public.prompts
for update
to public
using (true);

-- Policy for DELETE
create policy "Enable delete access for all users"
on public.prompts
for delete
to public
using (true);
