import { z } from "zod";

export const CreateMessage = z.object({
  assistantId: z.string(),
  chatbotId: z.string(),
  message: z.string(),
  threadId: z.optional(z.string()),
});
