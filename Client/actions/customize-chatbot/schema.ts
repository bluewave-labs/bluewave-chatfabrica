import { z } from "zod";

export const CustomizeChatbot = z.object({
  id: z.string(),
  initialMessage: z.string(),
  chatSuggestions: z.array(z.string()),
  displayName: z.string(),
  placeholder: z.string(),
  alignButton: z.string(),
  initialMessageShowTime: z.number(),
  messageColor: z.string(),
  chatBubbleButtonColor: z.string(),
  iconMessage: z.string(),
  chatIcon: z.string().optional(),
});
