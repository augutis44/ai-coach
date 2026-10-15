import { streamText, convertToModelMessages, toUIMessageStream, createUIMessageStreamResponse } from "ai";
import { cookies } from "next/headers";
import { coachSettings } from "@/lib/agent/settings";
import { trimHistory } from "@/lib/agent/history";
import type { tools } from "@/lib/agent/tools";
import { saveMessages } from "@/lib/db";
import type { CoachMessage } from "@/lib/types";

export async function POST(req: Request) {
  const name = (await cookies()).get("name")?.value;
  if (!name) return new Response("Enter your name first", { status: 401 });
  const { messages }: { messages: CoachMessage[] } = await req.json();
  const result = streamText({
    ...coachSettings(messages),
    messages: await convertToModelMessages(trimHistory(messages)),
  });
  return createUIMessageStreamResponse({
    stream: toUIMessageStream<typeof tools, CoachMessage>({
      stream: result.stream,
      // Stamps each reply with the time it started, shown as "Max · 9:41".
      messageMetadata: ({ part }) => (part.type === "start" ? { at: Date.now() } : undefined),
      // Persist the whole chat (history + this reply) under the visitor's name once the reply is done.
      originalMessages: messages,
      onFinish: ({ messages }) => saveMessages(name, messages),
    }),
  });
}
