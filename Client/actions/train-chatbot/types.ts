import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { TrainChatbot } from "./schema";
import { Chatbot } from "@/lib/definitions";

export type InputType = z.infer<typeof TrainChatbot>;
export type ReturnType = ActionState<InputType, Chatbot>;
