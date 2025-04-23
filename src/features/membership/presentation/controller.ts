import { Context } from 'hono';
import {
  createMembership,
  getMembership,
  MembershipExistsError,
} from '../core/membershipUseCases.ts';
import { getMembershipRepoDrizzle } from '../infrastructure/membershipRepoDrizzle.ts';
import { getDb } from '../../../middlewares/use-drizzle-postgres.ts';
import {
  CreateTeamMembershipRequestSchema,
  CreateUserMembershipRequestSchema,
  MembershipResponseSchema,
} from './schema.ts';
import { validateResponseAgainstSchema } from '../../../shared/schema-validation/validate-response-against-schema.ts';
import { ErrorResponseSchema } from '../../../shared/schema/error-response.ts';
import { mapMembershipToResponseDto } from './mapper.ts';

const createTeamMembership = async (
  { userId, teamId, c }: { userId: string; teamId: string; c: Context },
) => {
  const db = getDb(c);
  try {
    const membership = await createMembership(getMembershipRepoDrizzle(db))({
      teamId,
      userId,
    });

    const membershipDto = await mapMembershipToResponseDto(membership);
    return c.json(
      validateResponseAgainstSchema(
        MembershipResponseSchema,
        membershipDto,
      ),
      201,
    );
  } catch (error) {
    if (error instanceof MembershipExistsError) {
      return c.json(
        validateResponseAgainstSchema(ErrorResponseSchema, {
          message: 'Membership with matching details already exists',
        }),
        400,
      );
    }
    throw error;
  }
};

export const handleAddUserToTeam = async (c: Context) => {
  const teamId = c.req.param('teamId');
  const body = await c.req.json();
  const parsed = await CreateUserMembershipRequestSchema.safeParseAsync(body);
  if (!parsed.success) {
    return c.json(
      validateResponseAgainstSchema(ErrorResponseSchema, parsed.error),
      400,
    );
  }

  return createTeamMembership({
    userId: parsed.data.userId,
    teamId,
    c,
  });
};

export const handleAddTeamToUser = async (c: Context) => {
  const userId = c.req.param('userId');
  const body = await c.req.json();
  const parsed = await CreateTeamMembershipRequestSchema.safeParseAsync(body);
  if (!parsed.success) {
    return c.json(
      validateResponseAgainstSchema(ErrorResponseSchema, parsed.error),
      400,
    );
  }
  return createTeamMembership({
    userId,
    teamId: parsed.data.teamId,
    c,
  });
};

export const handleGetMembership = async (c: Context) => {
  const teamId = c.req.param('teamId');
  const userId = c.req.param('userId');
  const db = getDb(c);
  const membership = await getMembership(getMembershipRepoDrizzle(db))(
    userId,
    teamId,
  );
  if (!membership) {
    return c.json(
      validateResponseAgainstSchema(ErrorResponseSchema, {
        message: 'Membership not found',
      }),
      404,
    );
  }

  const membershipDto = await mapMembershipToResponseDto(membership);
  return c.json(
    validateResponseAgainstSchema(
      MembershipResponseSchema,
      membershipDto,
    ),
    200,
  );
};
