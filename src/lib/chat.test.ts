import { describe, it, expect } from "vitest";
import { trimHistory } from "./chat";

describe("trimHistory", () => {
  it("keeps the last N messages", () => {
    const msgs = Array.from({ length: 30 }, (_, i) => ({ id: String(i), role: "user", parts: [] })) as never[];
    expect(trimHistory(msgs, 20)).toHaveLength(20);
    expect(trimHistory(msgs, 20)[0].id).toBe("10");
  });
});