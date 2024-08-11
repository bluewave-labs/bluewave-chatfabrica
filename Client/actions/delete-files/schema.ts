import { z } from "zod";

export const DeleteFile = z.object({
  chatbotId: z.string(),
  fileIds: z.array(z.string()),
});
