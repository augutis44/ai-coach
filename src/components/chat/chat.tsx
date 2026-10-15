"use client";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import type { CoachMessage, Send } from "@/lib/types";
import { AgentTrace } from "@/components/trace/agent-trace";
import { ChatHeader } from "./chat-header";
import { Composer } from "./composer";
import { MessageList } from "./message-list";
import { SideNav } from "./side-nav";

export function Chat() {
  const { messages, sendMessage, status, error, regenerate } = useChat<CoachMessage>();
  const [trace, setTrace] = useState(true);
  const busy = status !== "ready" && status !== "error";
  const send: Send = (text, metadata) => sendMessage({ text, metadata });
  const purchased = messages.some((m) => m.metadata?.event === "purchase_completed");

  return (
    <div className="h-dvh flex text-[15px] leading-5.5">
      <SideNav purchased={purchased} send={send} busy={busy} />
      <main className="flex-1 min-w-0 flex flex-col">
        <ChatHeader trace={trace} onToggleTrace={() => setTrace(!trace)} />
        <MessageList
          messages={messages}
          send={send}
          busy={busy}
          thinking={status === "submitted"}
          error={error}
          onRetry={() => regenerate()}
        />
        <Composer onSend={send} disabled={busy} purchased={purchased} />
      </main>
      {trace && <AgentTrace messages={messages} purchased={purchased} />}
    </div>
  );
}
