"use client";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { getUpsellPolicy } from "@/lib/agent/upsell-policy";
import type { CoachMessage, Send } from "@/lib/types";
import { AgentTrace } from "@/components/trace/agent-trace";
import { ChatHeader } from "./chat-header";
import { Composer } from "./composer";
import { MessageList } from "./message-list";
import { SideNav } from "./side-nav";

export function Chat({ name, initialMessages }: { name: string; initialMessages: CoachMessage[] }) {
  const { messages, sendMessage, status, error, regenerate } = useChat<CoachMessage>({ messages: initialMessages });
  const [trace, setTrace] = useState(true);
  const busy = status !== "ready" && status !== "error";
  const send: Send = (text, metadata) => sendMessage({ text, metadata });
  const policy = getUpsellPolicy(messages);
  // The plan tab, Upgrade box and schedule chips are about the 12-week plan specifically.
  const purchased = policy.owned.includes("shred_pdf");

  return (
    <div className="h-dvh flex text-[15px] leading-5.5">
      <SideNav name={name} purchased={purchased} send={send} busy={busy} />
      <main className="flex-1 min-w-0 flex flex-col">
        <ChatHeader name={name} purchased={purchased} send={send} busy={busy} trace={trace} onToggleTrace={() => setTrace(!trace)} />
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
      {trace && <AgentTrace messages={messages} policy={policy} />}
    </div>
  );
}
