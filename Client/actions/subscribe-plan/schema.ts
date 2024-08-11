import { z } from "zod";

export const SubscribePlan = z.object({
  planId: z.string(),
  userId: z.optional(z.string()),
});
