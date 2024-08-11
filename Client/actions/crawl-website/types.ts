import { z } from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { CrawlWebsite } from "./schema";
import { Crawl } from "@/lib/definitions";

export type InputType = z.infer<typeof CrawlWebsite>;
export type ReturnType = ActionState<InputType, Crawl>;
