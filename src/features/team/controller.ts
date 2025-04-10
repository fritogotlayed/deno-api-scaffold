import { Context } from 'hono';
import {
  createTeam,
  getTeam,
  TeamExistsError,
} from '../../core/team/teamUseCases.ts';
import { teamRepoDrizzle } from '../../infrastructure/teamRepoDrizzle.ts';
import { z } from 'zod';

export const createTeamRequestSchema = z.object({
  name: z.string().min(1),
});

export const handleCreateTeam = async (c: Context) => {
  const body = await c.req.json();
  const parsed = await createTeamRequestSchema.safeParseAsync(body);
  if (!parsed.success) {
    return c.text(JSON.stringify(parsed.error), 400);
  }
  try {
    const createdTeam = await createTeam(teamRepoDrizzle)(parsed.data);
    return c.json(createdTeam, 201);
  } catch (error) {
    if (error instanceof TeamExistsError) {
      return c.text('Team with matching name already exists', 400);
    }
    throw error;
  }
};

export const handleGetTeam = async (c: Context) => {
  const id = c.req.param('id');
  const user = await getTeam(teamRepoDrizzle)(id);
  if (!user) {
    return c.text('Team not found', 404);
  }
  return c.json(user);
};
