import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { CreateChatbot } from "./schema";
import { Chatbot } from "@/lib/definitions";

export type InputType = z.infer<typeof CreateChatbot>;
export type ReturnType = ActionState<InputType, Chatbot>;
