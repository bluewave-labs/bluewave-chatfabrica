import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { ForgotPassword } from "./schema";

export type InputType = z.infer<typeof ForgotPassword>;
export type ReturnType = ActionState<InputType, string>;
