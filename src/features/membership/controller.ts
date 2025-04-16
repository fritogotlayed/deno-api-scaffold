import { Context } from 'hono';
import {
  createMembership,
  getMembership,
  MembershipExistsError,
} from '../../core/membership/membershipUseCases.ts';
import { getMembershipRepoDrizzle } from '../../infrastructure/membershipRepoDrizzle.ts';
import { getDb } from '../../middlewares/use-drizzle-postgres.ts';
import {
  CreateMembershipRequestSchema,
  MembershipResponseSchema,
} from './schema.ts';
import { validateResponseAgainstSchema } from '../../shared/schema-validation/validate-response-against-schema.ts';
import { ErrorResponseSchema } from '../../shared/schema/error-response.ts';
import { mapMembershipToResponseDto } from './mapper.ts';

export const handleCreateMembership = async (c: Context) => {
  const teamId = c.req.param('teamId');
  const userId = c.req.param('userId');
  const body = await c.req.json();
  const parsed = await CreateMembershipRequestSchema.safeParseAsync(body);
  if (!parsed.success) {
    return c.json(
      validateResponseAgainstSchema(ErrorResponseSchema, parsed.error),
      400,
    );
  }
  const db = getDb(c);
  try {
    const membership = await createMembership(getMembershipRepoDrizzle(db))(
      {
        teamId,
        userId,
      },
    );
    return c.json(
      validateResponseAgainstSchema(
        MembershipResponseSchema,
        mapMembershipToResponseDto(membership),
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
  return c.json(
    validateResponseAgainstSchema(
      MembershipResponseSchema,
      mapMembershipToResponseDto(membership),
    ),
    200,
  );
};
