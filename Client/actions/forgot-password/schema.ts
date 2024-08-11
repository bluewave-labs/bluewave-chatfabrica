import { z } from "zod";

export const ForgotPassword = z.object({
  email: z.string().email(),
});
