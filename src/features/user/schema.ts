import { z } from 'zod';

export const ParamsSchema = z.object({
  userId: z.string(),
});

export const CreateUserRequestSchema = z.object({
  name: z.string().min(1),
  password: z.string().min(1),
  email: z.string().email(),
});

export const UserResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
});
