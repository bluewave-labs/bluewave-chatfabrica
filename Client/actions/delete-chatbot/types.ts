import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { DeleteChatbot } from "./schema";
import { Chatbot } from "@/lib/definitions";

export type InputType = z.infer<typeof DeleteChatbot>;
export type ReturnType = ActionState<InputType, Chatbot>;
