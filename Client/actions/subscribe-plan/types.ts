import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { SubscribePlan } from "./schema";
import { Plan } from "@/lib/definitions";

export type InputType = z.infer<typeof SubscribePlan>;
export type ReturnType = ActionState<InputType, Plan>;
