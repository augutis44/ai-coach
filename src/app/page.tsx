import { Suspense } from "react";
import { cookies } from "next/headers";
import { Chat } from "@/components/chat/chat";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { loadMessages } from "@/lib/db";
import { setName } from "./actions";

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}

/** Reads the name cookie, so it must sit behind Suspense (Cache Components rule). */
async function Home() {
  const name = (await cookies()).get("name")?.value;
  if (!name) return <NameForm />;
  return <Chat key={name} name={name} initialMessages={await loadMessages(name)} />;
}

function NameForm() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-4">
      <form action={setName} className="w-full max-w-sm p-6 rounded-[14px] bg-surface border border-line flex flex-col gap-5">
        <div className="flex items-center gap-2.5">
          <span className="size-7 rounded-lg bg-lime text-zinc-700 inline-flex items-center justify-center">
            <Icon strokeWidth={2.4}><path d="M13 2 4 14h8l-1 8 9-12h-8z" /></Icon>
          </span>
          <span className="font-bold text-[17px] tracking-tight text-ink">fitpulse</span>
        </div>
        <label className="flex flex-col gap-2 text-sm font-medium text-ink">
          What should Max call you?
          <input
            name="name"
            required
            maxLength={40}
            autoFocus
            autoComplete="given-name"
            placeholder="Your name"
            className="min-h-10 px-3 rounded-[10px] bg-bg border border-line text-ink placeholder:text-muted outline-none transition focus:border-faint"
          />
        </label>
        <Button type="submit">Start chatting</Button>
      </form>
    </main>
  );
}
