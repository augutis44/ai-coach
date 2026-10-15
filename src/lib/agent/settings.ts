import { isStepCount, type PrepareStepFunction } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { SYSTEM_PROMPT } from "./prompt.ts";
import { tools } from "./tools.ts";

/**
 * Guardrail is enforced in code, not just the prompt: once a message is flagged, only further flags may run
 * (a message can hit two categories; with no tools at all the model returns an empty reply).
 */
export const blockToolsAfterGuardrail: PrepareStepFunction<typeof tools> = ({ steps }) =>
  steps.some((s) => s.toolCalls.some((c) => c.toolName === "flag_guardrail"))
    ? { activeTools: ["flag_guardrail"] }
    : undefined;

/** Shared by the chat route and the eval so both run the exact same agent. */
export function coachSettings() {
  return {
    model: anthropic("claude-haiku-5-5"),
    system: SYSTEM_PROMPT,
    tools,
    stopWhen: isStepCount(5),
    prepareStep: blockToolsAfterGuardrail,
    // One tool per step, so a guardrail flag can't be paired with another tool in the same step.
    providerOptions: { anthropic: { disableParallelToolUse: true } },
  };
}
