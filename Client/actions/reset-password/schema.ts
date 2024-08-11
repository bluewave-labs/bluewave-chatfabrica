import { z } from "zod";

export const ResetPassword = z.object({
  token: z.string(),
  password: z.string().min(8),
});
