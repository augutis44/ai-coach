import { describe, expect, it, vi } from "vitest";
import { MockLanguageModelV4, convertArrayToReadableStream } from "ai/test";
import { SYSTEM_PROMPT } from "@/lib/agent/prompt";
import { POST } from "./route";

// Fake model: streams "Hello world" instead of calling the Anthropic API.
const model = vi.hoisted(() => ({ current: undefined as unknown }));
vi.mock("@ai-sdk/anthropic", () => ({ anthropic: () => model.current }));

describe("POST /api/chat", () => {
  it("streams the model reply and passes the system prompt and user message", async () => {
    const mock = new MockLanguageModelV4({
      doStream: {
        stream: convertArrayToReadableStream([
          { type: "text-start", id: "t1" },
          { type: "text-delta", id: "t1", delta: "Hello " },
          { type: "text-delta", id: "t1", delta: "world" },
          { type: "text-end", id: "t1" },
          {
            type: "finish",
            finishReason: { unified: "stop", raw: "end_turn" },
            usage: {
              inputTokens: { total: 5, noCache: 5, cacheRead: 0, cacheWrite: 0 },
              outputTokens: { total: 2, text: 2, reasoning: 0 },
            },
          },
        ]),
      },
    });
    model.current = mock;

    const res = await POST(
      new Request("http://localhost/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages: [{ id: "m1", role: "user", parts: [{ type: "text", text: "Hi" }] }],
        }),
      }),
    );

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain('"delta":"Hello "');
    expect(body).toContain('"delta":"world"');

    const prompt = mock.doStreamCalls[0].prompt;
    expect(prompt[0]).toMatchObject({ role: "system", content: SYSTEM_PROMPT });
    expect(prompt[1]).toMatchObject({ role: "user", content: [{ type: "text", text: "Hi" }] });
  });
});
