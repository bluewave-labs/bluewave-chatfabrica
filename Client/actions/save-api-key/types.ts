import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { SaveApiKey } from "./schema";

export type InputType = z.infer<typeof SaveApiKey>;
export type ReturnType = ActionState<InputType, { status: string }>;
