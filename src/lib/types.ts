import type { InferUITools, UIDataTypes, UIMessage } from "ai";
import type { OfferId } from "./agent/offers";
import type { tools } from "./agent/tools";

/** `event` marks a user message as an automated receipt (rendered as a pill, not a bubble); `at` is a timestamp. */
export type CoachMeta = { event?: "purchase_completed"; product?: OfferId; at?: number };
export type CoachMessage = UIMessage<CoachMeta, UIDataTypes, InferUITools<typeof tools>>;
export type CoachPart = CoachMessage["parts"][number];
export type ToolName = keyof typeof tools;
export type Send = (text: string, metadata?: CoachMeta) => void;
