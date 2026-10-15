"use client";
import { useChat } from "@ai-sdk/react";
import type { InferUITools, UIDataTypes, UIMessage } from "ai";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { tools } from "@/lib/chat";

type Msg = UIMessage<unknown, UIDataTypes, InferUITools<typeof tools>>;
type Part = Msg["parts"][number];
type Send = (text: string) => void;

const INTENT: Record<string, string> = {
  search_workouts: "workout_advice",
  generate_upsell_link: "upsell_trigger",
  send_review_request: "gratitude",
};
const GUARD_LABEL = {
  starvation_diet: "extreme starvation diet",
  medical: "medical diagnosis",
  off_topic: "off-topic or explicit content",
};

const kicker = "text-xs leading-4 font-semibold uppercase tracking-[0.06em]";
const label = "text-xs leading-4 text-[#5B6462] uppercase tracking-[0.08em]";
const btn =
  "inline-flex items-center min-h-11 px-[18px] rounded-[10px] font-semibold no-underline cursor-pointer disabled:opacity-50";

// [text](url), **bold**, or a bare https URL (trailing punctuation excluded). Only http(s) links are rendered.
const TOKEN =
  /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|(https?:\/\/[^\s)]*[^\s).,!?])/g;

function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(TOKEN)) {
    out.push(text.slice(last, m.index));
    out.push(
      m[3] ? (
        <strong key={m.index}>{m[3]}</strong>
      ) : (
        <a key={m.index} href={m[2] ?? m[4]} target="_blank" rel="noreferrer">
          {m[1] ?? m[4]}
        </a>
      ),
    );
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return <>{out}</>;
}

function Avatar() {
  return (
    <div className="flex-[0_0_32px] size-8 rounded-full bg-[#0B5E6B] text-white flex items-center justify-center font-display font-semibold text-[13px]">
      M
    </div>
  );
}

function ToolCard({
  part,
  text,
  send,
  busy,
}: {
  part: Part;
  text: string;
  send: Send;
  busy: boolean;
}) {
  if (!("state" in part) || part.state !== "output-available") return null;
  switch (part.type) {
    case "tool-search_workouts": {
      // ponytail: the card shows the first library workout the reply names; switch to a pick_workout tool if the model starts paraphrasing names.
      const w = part.output.find((w) => text.includes(w.name));
      if (!w) return null;
      return (
        <div className="p-4 bg-white border-2 border-[#0B5E6B] rounded-xl flex flex-col gap-2.5">
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <div className="font-display font-semibold text-[17px] leading-5.5">
              {w.name}
            </div>
            <div className={`${kicker} text-[#0B5E6B]`}>
              tool · search_workouts
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              `${w.minutes} min`,
              w.equipment === "none" ? "No equipment" : w.equipment,
              w.intensity,
              w.focus,
            ].map((c) => (
              <div
                key={c}
                className="text-[13px] leading-4 px-2.5 py-1 bg-[#E7F0F1] text-[#0B5E6B] rounded-full first-letter:uppercase"
              >
                {c}
              </div>
            ))}
          </div>
          <div className="text-[#3E4745]">{w.description}</div>
          <div className="flex gap-2.5 flex-wrap">
            <button
              type="button"
              disabled={busy}
              onClick={() => send(`Starting ${w.name} now!`)}
              className={`${btn} bg-[#0B5E6B] text-white`}
            >
              Start workout
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => send("Show me another workout")}
              className={`${btn} bg-white text-[#0B5E6B] border border-[#0B5E6B]`}
            >
              Show another
            </button>
          </div>
        </div>
      );
    }
    case "tool-send_review_request":
      return (
        <div className="p-4 bg-[#FFFBEA] border border-[#E8D98A] rounded-xl flex flex-col gap-2">
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <div className="font-display font-semibold text-[15px] leading-5">
              Enjoying the coaching?
            </div>
            <div className={`${kicker} text-[#7A5A00]`}>
              tool · send_review_request
            </div>
          </div>
          <div className="text-[#3E4745]">
            A quick review helps other people find a coach that actually sticks.
            It takes about a minute.
          </div>
          <a
            href={part.output.url}
            target="_blank"
            rel="noreferrer"
            className={`${btn} self-start bg-[#16201F] text-white!`}
          >
            Leave a review on Trustpilot
          </a>
        </div>
      );
    case "tool-generate_upsell_link": {
      const u = part.output;
      return (
        <div className="p-4 bg-white border-2 border-[#D9480F] rounded-xl flex gap-4 items-center flex-wrap">
          <div className="flex-[0_0_64px] w-16 h-21 rounded-md bg-[#D9480F] text-white flex items-center justify-center font-display font-bold text-[13px] leading-4 text-center">
            {u.price ? (
              <>
                12
                <br />
                WK
              </>
            ) : (
              <>
                TD
                <br />
                BOOK
              </>
            )}
          </div>
          <div className="flex-[1_1_200px] min-w-0 flex flex-col gap-1">
            <div className={`${kicker} text-[#A63A0C]`}>
              tool · generate_upsell_link
            </div>
            <div className="font-display font-semibold text-base leading-5.5">
              {u.product}
            </div>
            <div className="text-[13px] leading-4.5 text-[#5B6462]">
              {u.blurb}
            </div>
          </div>
          <a
            href={u.url}
            target="_blank"
            rel="noreferrer"
            className={`${btn} bg-[#D9480F] text-white!`}
          >
            {u.price ? `Get the plan · ${u.price}` : "Get the book"}
          </a>
        </div>
      );
    }
    default:
      return null;
  }
}

function Message({ m, send, busy }: { m: Msg; send: Send; busy: boolean }) {
  const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("\n");
  if (m.role === "user")
    return (
      <div className="flex justify-end">
        <div className="max-w-130 px-4 py-3 bg-[#16201F] text-white rounded-[16px_16px_4px_16px] whitespace-pre-wrap">
          {text}
        </div>
      </div>
    );
  const guard = m.parts.find(
    (p) => p.type === "tool-flag_guardrail" && p.state === "output-available",
  );
  const firstText = m.parts.findIndex(
    (p) => p.type === "text" && p.text.trim(),
  );
  return (
    <div className="flex gap-2.5 items-start">
      <Avatar />
      <div className="flex flex-col gap-2.5 max-w-140 min-w-0">
        {m.parts.map((p, i) => {
          if (p.type !== "text")
            return (
              <ToolCard key={i} part={p} text={text} send={send} busy={busy} />
            );
          if (!p.text.trim()) return null;
          const radius =
            i === firstText ? "rounded-[4px_16px_16px_16px]" : "rounded-2xl";
          return (
            <div
              key={i}
              className={`px-4 py-3 bg-white border border-[#DCD8CE] whitespace-pre-wrap ${radius}`}
            >
              <RichText text={p.text} />
            </div>
          );
        })}
        {guard?.type === "tool-flag_guardrail" &&
          guard.state === "output-available" && (
            <div className="flex items-center gap-2 px-3 py-2 bg-[#FDECEA] border border-[#E3B2A9] rounded-lg text-[13px] leading-4 text-[#8A1F11]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="flex-[0_0_16px]"
              >
                <path d="M8 2 L14 13 H2 Z" />
                <path d="M8 6.5 V9.5" />
                <path d="M8 11.5 V11.6" />
              </svg>
              <span>
                Guardrail: {GUARD_LABEL[guard.output.category]} · refused and
                redirected
              </span>
            </div>
          )}
      </div>
    </div>
  );
}

function Row({ k, v, tone = "" }: { k: string; v: string; tone?: string }) {
  return (
    <div className={`flex justify-between gap-3 text-sm leading-5 ${tone}`}>
      <span className="text-[#5B6462]">{k}</span>
      <span className="font-semibold text-right">{v}</span>
    </div>
  );
}

function Trace({ messages }: { messages: Msg[] }) {
  const turns = messages
    .filter((m) => m.role === "assistant")
    .map((m, i) => {
      const parts = m.parts.filter((p) => p.type.startsWith("tool-"));
      const guard = parts.find((p) => p.type === "tool-flag_guardrail");
      const tool = parts
        .find((p) => p.type !== "tool-flag_guardrail")
        ?.type.slice(5);
      const slots = parts.find((p) => p.type === "tool-search_workouts");
      return {
        n: i + 1,
        guard:
          guard?.type === "tool-flag_guardrail"
            ? guard.input?.category
            : undefined,
        tool,
        intent: guard
          ? "guardrail_block"
          : tool
            ? INTENT[tool]
            : "informational",
        slots: slots?.type === "tool-search_workouts" ? slots.input : undefined,
      };
    });
  const last = turns.at(-1);
  const turnOf = (tool: string) => turns.find((t) => t.tool === tool)?.n;
  const review = turnOf("send_review_request");
  const upsell = turnOf("generate_upsell_link");
  const slots = turns.findLast((t) => t.slots)?.slots;
  const box = "px-3 py-2.5 rounded-lg";

  return (
    <aside className="hidden lg:flex flex-[1_1_320px] max-w-90 p-6 border-l border-[#DCD8CE] bg-white flex-col gap-5">
      <div className="flex flex-col gap-1">
        <div className="font-display font-semibold text-base leading-5">
          Agent trace
        </div>
        <div className="text-[13px] leading-4 text-[#5B6462]">
          Debug panel for the prototype. Hidden in production.
        </div>
      </div>
      {last && (
        <div className="flex flex-col gap-2.5">
          <div className={label}>Turn {last.n} · last message</div>
          <Row
            k="Guardrail"
            v={last.guard ? `BLOCK · ${last.guard}` : "pass"}
            tone={`${box} ${last.guard ? "bg-[#FDECEA] [&>span:last-child]:text-[#8A1F11]" : "bg-[#F6F4EE]"}`}
          />
          <Row
            k="Intent"
            v={last.guard ? "skipped" : last.intent}
            tone={`${box} bg-[#F6F4EE]`}
          />
          <Row
            k="Tool"
            v={last.guard ? "none" : (last.tool ?? "none")}
            tone={`${box} bg-[#F6F4EE]`}
          />
        </div>
      )}
      <div className="flex flex-col gap-2.5">
        <div className={label}>Session state</div>
        <Row k="Review asked" v={review ? `yes · turn ${review}` : "no"} />
        <Row k="Upsell shown" v={upsell ? `yes · turn ${upsell}` : "no"} />
        <Row
          k="Slots"
          v={
            slots
              ? [slots.maxMinutes && `${slots.maxMinutes} min`, slots.equipment]
                  .filter(Boolean)
                  .join(" · ") || "—"
              : "—"
          }
        />
      </div>
      <div className="flex flex-col gap-2.5">
        <div className={label}>Turn log</div>
        {turns.length === 0 && (
          <div className="text-[13px] text-[#5B6462]">No turns yet.</div>
        )}
        {turns.map((t) => (
          <div key={t.n} className="flex gap-2.5 text-[13px] leading-4.5">
            <span className="flex-[0_0_16px] text-[#5B6462]">{t.n}</span>
            <span className={t.guard ? "text-[#8A1F11]" : ""}>
              {t.guard
                ? "guardrail_block → refuse + redirect"
                : `${t.intent} → ${t.tool ?? "reply"}`}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function Chat() {
  const { messages, sendMessage, status, error } = useChat<Msg>();
  const [input, setInput] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const busy = status !== "ready";
  const send: Send = (text) => sendMessage({ text });

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col text-[15px] leading-5.5">
      <header className="h-16 px-6 flex items-center justify-between gap-4 bg-white border-b border-[#DCD8CE]">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-[10px] bg-[#D9480F] text-white flex items-center justify-center font-display font-bold text-base">
            F
          </div>
          <div className="flex flex-col">
            <div className="font-display font-semibold text-base leading-5">
              FitPulse Coach
            </div>
            <div className="text-[13px] leading-4 text-[#5B6462]">
              Coach Max · replies in a few seconds
            </div>
          </div>
        </div>
        <div className="hidden sm:block text-[13px] leading-4 text-[#5B6462] px-2.5 py-1.5 border border-[#DCD8CE] rounded-full">
          Prototype v0.1 · mock tools
        </div>
      </header>
      <div className="flex flex-1 max-w-7xl w-full mx-auto">
        <main className="flex-[999_1_560px] min-w-0 px-4 sm:px-6 pt-6 flex flex-col gap-5">
          <div className={`self-center ${label}`}>Today</div>
          {messages.length === 0 && (
            <div className="flex gap-2.5 items-start">
              <Avatar />
              <div className="px-4 py-3 bg-white border border-[#DCD8CE] rounded-[4px_16px_16px_16px]">
                Hey, I&apos;m Max! Ask me which workout to do today, or anything
                about training.
              </div>
            </div>
          )}
          {messages.map((m) => (
            <Message key={m.id} m={m} send={send} busy={busy} />
          ))}
          {status === "submitted" && (
            <div className="ml-10.5 text-[13px] text-[#5B6462]">
              Max is typing…
            </div>
          )}
          {error && (
            <div className="ml-10.5 text-[13px] text-[#8A1F11]">
              Something went wrong. Try again.
            </div>
          )}
          <div ref={end} />
          <form
            className="sticky bottom-0 mt-auto pt-4 pb-6 bg-[#F6F4EE] flex gap-2.5 items-center"
            onSubmit={(e) => {
              e.preventDefault();
              if (!input.trim()) return;
              send(input);
              setInput("");
            }}
          >
            <label htmlFor="chat-input" className="sr-only">
              Message your coach
            </label>
            <input
              id="chat-input"
              className="flex-auto min-w-0 min-h-12 px-4 border border-[#C9C4B7] rounded-xl bg-white text-[#16201F]"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={busy}
              placeholder="Ask Max anything about training…"
            />
            <button
              type="submit"
              disabled={busy}
              className="min-h-12 px-5 bg-[#16201F] text-white rounded-xl font-semibold cursor-pointer disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </main>
        <Trace messages={messages} />
      </div>
    </div>
  );
}
