import { z } from "zod";

export const DeleteCrawlWebsite = z.object({
  chatbotId: z.string(),
  fileId: z.string(),
});
