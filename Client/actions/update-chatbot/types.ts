import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { UpdateChatbot } from "./schema";
import { Chatbot } from "@/lib/definitions";

export type InputType = z.infer<typeof UpdateChatbot>;
export type ReturnType = ActionState<InputType, Chatbot>;
