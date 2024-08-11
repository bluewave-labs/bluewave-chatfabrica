import { z } from "zod";

export const UpdateChatbot = z.object({
  assistantId: z.string(),
  model: z.string(),
  name: z.optional(z.string()),
  description: z.optional(z.string()),
  visibility: z.optional(z.enum(["Public", "Private"])),
  temperature: z.optional(z.number()),
});
