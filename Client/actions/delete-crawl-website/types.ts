import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { DeleteCrawlWebsite } from "./schema";

export type InputType = z.infer<typeof DeleteCrawlWebsite>;
export type ReturnType = ActionState<InputType, { status: string }>;
