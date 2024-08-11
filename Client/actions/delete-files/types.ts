import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { DeleteFile } from "./schema";
import { Chatbot } from "@/lib/definitions";

export type InputType = z.infer<typeof DeleteFile>;
export type ReturnType = ActionState<InputType, Chatbot>;
