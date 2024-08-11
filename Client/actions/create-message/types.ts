import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { CreateMessage } from "./schema";
import { Crawl } from "@/lib/definitions";

export type InputType = z.infer<typeof CreateMessage>;
export type ReturnType = ActionState<InputType, Crawl>;
