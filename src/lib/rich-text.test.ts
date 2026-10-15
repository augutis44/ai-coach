import { describe, it, expect } from "vitest";
import { parseRichText } from "./rich-text";

describe("parseRichText", () => {
  it("parses markdown links, bold and bare URLs", () => {
    expect(parseRichText("Try **HIIT**: [grab it](https://a.example/x). Or https://b.example/y.")).toEqual([
      { type: "text", text: "Try " },
      { type: "bold", text: "HIIT" },
      { type: "text", text: ": " },
      { type: "link", text: "grab it", href: "https://a.example/x" },
      { type: "text", text: ". Or " },
      { type: "link", text: "https://b.example/y", href: "https://b.example/y" },
      { type: "text", text: "." },
    ]);
  });

  it("never turns non-http links into anchors", () => {
    expect(parseRichText("[x](javascript:alert(1))")).toEqual([{ type: "text", text: "[x](javascript:alert(1))" }]);
  });
});
