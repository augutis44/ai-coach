import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { coachSettings } from "@/lib/agent/settings";
import { trimHistory } from "@/lib/agent/history";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    ...coachSettings(),
    messages: await convertToModelMessages(trimHistory(messages)),
  });
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
