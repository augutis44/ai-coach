import { parseRichText } from "@/lib/rich-text";

export function RichText({ text }: { text: string }) {
  return parseRichText(text).map((s, i) => {
    if (s.type === "bold") return <strong key={i}>{s.text}</strong>;
    if (s.type === "link")
      return (
        <a key={i} href={s.href} target="_blank" rel="noreferrer" className="font-medium underline">
          {s.text}
        </a>
      );
    return s.text;
  });
}
