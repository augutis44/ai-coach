import type { UIMessage } from "ai";

export const SYSTEM_PROMPT = "You are a concise, friendly assistant.";

/** Keep only the last N messages so the prompt doesn't grow forever. */
export function trimHistory(messages: UIMessage[], max = 20): UIMessage[] {
  return messages.slice(-max);
}
