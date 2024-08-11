import { z } from "zod";

export const SaveApiKey = z.object({
  apiKey: z.string(),
});
