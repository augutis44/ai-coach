import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { coachSettings } from "@/lib/agent/settings";
import { trimHistory } from "@/lib/agent/history";
import type { tools } from "@/lib/agent/tools";
import type { CoachMessage } from "@/lib/types";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    ...coachSettings(),
    messages: await convertToModelMessages(trimHistory(messages)),
  });
  return createUIMessageStreamResponse({
    stream: toUIMessageStream<typeof tools, CoachMessage>({
      stream: result.stream,
      // Stamps each reply with the time it started, shown as "Max · 9:41".
      messageMetadata: ({ part }) => (part.type === "start" ? { at: Date.now() } : undefined),
    }),
  });
}
