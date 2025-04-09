// Zod Validation
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
});

export type UserInput = z.infer<typeof userSchema>;
