import type { InferUITools, UIDataTypes, UIMessage } from "ai";
import type { tools } from "./agent/tools";

export type CoachMessage = UIMessage<unknown, UIDataTypes, InferUITools<typeof tools>>;
export type CoachPart = CoachMessage["parts"][number];
export type ToolName = keyof typeof tools;
export type Send = (text: string) => void;
