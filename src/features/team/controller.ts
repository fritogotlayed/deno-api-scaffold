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
import { getAddressRepoDrizzle } from '../../infrastructure/addressRepoDrizzle.ts';
import { mapTeamToResponseDto } from './mapper.ts';
import { getAddressById } from '../../core/address/addressUseCases.ts';
import { Address } from '../../core/address/addressTypes.ts';

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
    const createdTeam = await createTeam({
      teamRepo: getTeamRepoDrizzle(db),
      addressRepo: getAddressRepoDrizzle(db),
    })(parsed.data, { address: parsed.data.address });
    let address: Address | null | undefined;
    if (createdTeam.addressId) {
      address = await getAddressById(getAddressRepoDrizzle(db))(
        createdTeam.addressId,
      );
    }
    const teamDto = await mapTeamToResponseDto({ team: createdTeam, address });
    return c.json(
      validateResponseAgainstSchema(TeamResponseSchema, teamDto),
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

  let address: Address | null | undefined;
  if (team.addressId) {
    address = await getAddressById(getAddressRepoDrizzle(db))(
      team.addressId,
    );
  }

  const teamDto = await mapTeamToResponseDto({ team, address });
  return c.json(
    validateResponseAgainstSchema(TeamResponseSchema, teamDto),
    200,
  );
};
