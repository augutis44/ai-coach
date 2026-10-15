"use client";
import { useChat } from "@ai-sdk/react";
import type { CoachMessage, Send } from "@/lib/types";
import { AgentTrace } from "@/components/trace/agent-trace";
import { ChatHeader } from "./chat-header";
import { Composer } from "./composer";
import { MessageList } from "./message-list";

export function Chat() {
  const { messages, sendMessage, status, error, regenerate } =
    useChat<CoachMessage>();
  const busy = status !== "ready" && status !== "error";
  const send: Send = (text) => sendMessage({ text });

  return (
    <div className="h-dvh flex flex-col text-[15px] leading-5.5">
      <ChatHeader />
      <div className="flex-1 min-h-0 flex">
        <main className="flex-1 min-w-0 flex flex-col">
          <MessageList
            messages={messages}
            send={send}
            busy={busy}
            thinking={status === "submitted"}
            error={error}
            onRetry={() => regenerate()}
          />
          <Composer onSend={send} disabled={busy} />
        </main>
        <AgentTrace messages={messages} />
      </div>
    </div>
  );
}
