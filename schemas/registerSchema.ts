import { z } from "zod";

export const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["user", "coach"]),
});

export type FormData = z.infer<typeof schema>;
