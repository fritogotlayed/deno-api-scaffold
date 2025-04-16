import { Context } from 'hono';
import {
  createTeam,
  getTeam,
  TeamExistsError,
} from '../../core/team/teamUseCases.ts';
import { getTeamRepoDrizzle } from '../../infrastructure/teamRepoDrizzle.ts';
import { getDb } from '../../middlewares/use-drizzle-postgres.ts';
import { CreateTeamRequestSchema, TeamResponseSchema } from './schema.ts';
import { validateResponseAgainstSchema } from '../../shared/schema-validation/validate-response-against-schema.ts';
import { ErrorResponseSchema } from '../../shared/schema/error-response.ts';

export const handleCreateTeam = async (c: Context) => {
  const body = await c.req.json();
  const parsed = await CreateTeamRequestSchema.safeParseAsync(body);
  if (!parsed.success) {
    return c.json(
      validateResponseAgainstSchema(ErrorResponseSchema, parsed.error),
      400,
    );
  }
  const db = getDb(c);
  try {
    const createdTeam = await createTeam(getTeamRepoDrizzle(db))(parsed.data);
    return c.json(
      validateResponseAgainstSchema(
        TeamResponseSchema,
        createdTeam,
      ),
      201,
    );
  } catch (error) {
    if (error instanceof TeamExistsError) {
      return c.json(
        validateResponseAgainstSchema(ErrorResponseSchema, {
          message: 'Team with matching name already exists',
        }),
        400,
      );
    }
    throw error;
  }
};

export const handleGetTeam = async (c: Context) => {
  const id = c.req.param('teamId');
  const db = getDb(c);
  const team = await getTeam(getTeamRepoDrizzle(db))(id);
  if (!team) {
    return c.json(
      validateResponseAgainstSchema(ErrorResponseSchema, {
        message: 'Team not found',
      }),
      404,
    );
  }
  return c.json(
    validateResponseAgainstSchema(TeamResponseSchema, team),
    200,
  );
};
