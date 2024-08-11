import { z } from "zod";

export const CrawlWebsite = z.object({
  websiteUrl: z.string().url("Geçerli bir URL olmalıdır."),
});
