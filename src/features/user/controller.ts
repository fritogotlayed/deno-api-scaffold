import { Context } from 'hono';
import {
  createUser,
  getUser,
  UserExistsError,
} from '../../core/user/userUseCases.ts';
import { getUserRepoDrizzle } from '../../infrastructure/userRepoDrizzle.ts';
import { z } from 'zod';
import { getDb } from '../../middlewares/use-drizzle-postgres.ts';

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
  const db = getDb(c);
  try {
    const createdUser = await createUser(getUserRepoDrizzle(db))(parsed.data);
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
  const db = getDb(c);
  const user = await getUser(getUserRepoDrizzle(db))(id);
  if (!user) {
    return c.text('User not found', 404);
  }
  return c.json(user);
};
