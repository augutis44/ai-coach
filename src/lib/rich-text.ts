export type Segment =
  | { type: "text"; text: string }
  | { type: "bold"; text: string }
  | { type: "link"; text: string; href: string };

// [text](url), **bold**, or a bare https URL (trailing punctuation excluded). Only http(s) links are produced.
const TOKEN = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s)]*[^\s).,!?])/g;

/** Splits model output into plain text, bold and link segments. */
export function parseRichText(text: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push({ type: "text", text: text.slice(last, m.index) });
    if (m[3]) out.push({ type: "bold", text: m[3] });
    else out.push({ type: "link", text: m[1] ?? m[4], href: m[2] ?? m[4] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ type: "text", text: text.slice(last) });
  return out;
}
