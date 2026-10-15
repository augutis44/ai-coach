import type { UIMessage } from "ai";

/** Keep only the last N messages so the prompt doesn't grow forever. */
export function trimHistory(messages: UIMessage[], max = 20): UIMessage[] {
  return messages.slice(-max);
}
