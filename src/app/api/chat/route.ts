import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { SYSTEM_PROMPT, trimHistory } from "@/lib/chat";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: anthropic("claude-haiku-5-5"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(trimHistory(messages)),
  });
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
