import postgres from "postgres";
import type { CoachMessage } from "./types";

// Connect on first query, not at import: `next build` loads this module to collect page data,
// and CI builds (GitHub Actions → vercel pull) have no real DATABASE_URL, only a placeholder.
// Supabase's pooled URL (pgbouncer, transaction mode) can't hold prepared statements.
let client: ReturnType<typeof postgres> | undefined;
const sql = () => (client ??= postgres(process.env.DATABASE_URL!, { prepare: false }));

/** The saved chat for a name, or [] for a newcomer. Table lives in schema.sql. */
export async function loadMessages(name: string): Promise<CoachMessage[]> {
  const rows = await sql()<{ messages: CoachMessage[] }[]>`select messages from conversations where name = ${name}`;
  return rows[0]?.messages ?? [];
}

// ponytail: whole conversation as one jsonb blob; split into a messages table if chats get long.
export async function saveMessages(name: string, messages: CoachMessage[]) {
  // `::text` first: for a bare jsonb parameter, postgres.js JSON-encodes the string a second time.
  await sql()`insert into conversations (name, messages) values (${name}, ${JSON.stringify(messages)}::text::jsonb)
    on conflict (name) do update set messages = excluded.messages, updated_at = now()`;
}
