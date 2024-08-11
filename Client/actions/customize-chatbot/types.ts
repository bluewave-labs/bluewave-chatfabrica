import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { CustomizeChatbot } from "./schema";
import { Chatbot } from "@/lib/definitions";

export type InputType = z.infer<typeof CustomizeChatbot>;
export type ReturnType = ActionState<InputType, Chatbot>;
