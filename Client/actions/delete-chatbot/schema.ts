import { z } from "zod";

export const DeleteChatbot = z.object({
  chatbotId: z.string(),
});
