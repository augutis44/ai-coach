"use client";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export function Chat() {
  const { messages, sendMessage, status } = useChat();
  const [input, setInput] = useState("");
  return (
    <main className="mx-auto max-w-xl p-4 space-y-4">
      {messages.map((m) => (
        <div key={m.id} className={m.role === "user" ? "text-right" : ""}>
          {m.parts.map((p, i) =>
            p.type === "text" ? <p key={i}>{p.text}</p> : null,
          )}
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput("");
        }}
      >
        <input
          className="w-full border p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== "ready"}
          placeholder="Ask something…"
        />
      </form>
    </main>
  );
}
