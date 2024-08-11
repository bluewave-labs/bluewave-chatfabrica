import { z } from "zod";

export const TrainChatbot = z.object({
  assistantId: z.string(),
  files: z.array(z.any()),
  links: z.array(z.any()),
  text: z.optional(z.string()),
  chatbotId: z.string(),
});
