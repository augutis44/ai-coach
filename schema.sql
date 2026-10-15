-- One row per person; the whole chat is one JSON blob. Run once in the Supabase SQL editor.
create table if not exists conversations (
  name text primary key,
  messages jsonb not null,
  updated_at timestamptz not null default now()
);
