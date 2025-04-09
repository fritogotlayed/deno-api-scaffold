import { userSchema } from '../../shared/models/user.ts';
import { createUser, getUser } from '../../core/user/userUseCases.ts';
import { userRepoDrizzle } from '../../infrastructure/userRepoDrizzle.ts';
import { Context } from 'https://deno.land/x/hono/mod.ts';

export const handleCreateUser = async (c: Context) => {
  const body = await c.req.json();
  const parsed = userSchema.parse(body);
  const createdUser = await createUser(userRepoDrizzle)(parsed);
  return c.json(createdUser, 201);
};

export const handleGetUser = async (c: Context) => {
  const id = c.req.param('id');
  const user = await getUser(userRepoDrizzle)(id);
  if (!user) {
    return c.text('User not found', 404);
  }
  return c.json(user);
};
