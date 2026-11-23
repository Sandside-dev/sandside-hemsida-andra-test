import { describe, expect, it } from "vitest";
import { chatDemo, getDemoAnswer } from "./chat-demo";

describe("chat demo", () => {
  it("answers a known pricing question", () => {
    expect(getDemoAnswer("Vad kostar en körlektion?")).toContain("720 kr");
  });

  it("hands unknown questions to a human", () => {
    expect(getDemoAnswer("Får jag ta med min hund?")).toBe(chatDemo.fallback);
  });
});
