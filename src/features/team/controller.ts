import { Context } from 'hono';
import {
  createTeam,
  getTeam,
  TeamExistsError,
} from '../../core/team/teamUseCases.ts';
import { getTeamRepoDrizzle } from '../../infrastructure/teamRepoDrizzle.ts';
import { z } from 'zod';
import { getDb } from '../../middlewares/use-drizzle-postgres.ts';

export const createTeamRequestSchema = z.object({
  name: z.string().min(1),
});

export const handleCreateTeam = async (c: Context) => {
  const body = await c.req.json();
  const parsed = await createTeamRequestSchema.safeParseAsync(body);
  if (!parsed.success) {
    return c.text(JSON.stringify(parsed.error), 400);
  }
  const db = getDb(c);
  try {
    const createdTeam = await createTeam(getTeamRepoDrizzle(db))(parsed.data);
    return c.json(createdTeam, 201);
  } catch (error) {
    if (error instanceof TeamExistsError) {
      return c.text('Team with matching name already exists', 400);
    }
    throw error;
  }
};

export const handleGetTeam = async (c: Context) => {
  const id = c.req.param('teamId');
  const db = getDb(c);
  const user = await getTeam(getTeamRepoDrizzle(db))(id);
  if (!user) {
    return c.text('Team not found', 404);
  }
  return c.json(user);
};
