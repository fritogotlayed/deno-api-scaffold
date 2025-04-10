import { Context } from 'hono';
import {
  createUser,
  getUser,
  UserExistsError,
} from '../../core/user/userUseCases.ts';
import { userRepoDrizzle } from '../../infrastructure/userRepoDrizzle.ts';
import { z } from 'zod';

export const createUserRequestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export const handleCreateUser = async (c: Context) => {
  const body = await c.req.json();
  const parsed = await createUserRequestSchema.safeParseAsync(body);
  if (!parsed.success) {
    return c.text(JSON.stringify(parsed.error), 400);
  }
  try {
    const createdUser = await createUser(userRepoDrizzle)(parsed.data);
    return c.json(createdUser, 201);
  } catch (error) {
    if (error instanceof UserExistsError) {
      return c.text('User with matching email already exists', 400);
    }
    throw error;
  }
};

export const handleGetUser = async (c: Context) => {
  const id = c.req.param('id');
  const user = await getUser(userRepoDrizzle)(id);
  if (!user) {
    return c.text('User not found', 404);
  }
  return c.json(user);
};
