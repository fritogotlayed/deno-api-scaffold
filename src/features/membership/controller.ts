import { Context } from 'hono';
import {
  createMembership,
  getMembership,
  MembershipExistsError,
} from '../../core/membership/membershipUseCases.ts';
import { getMembershipRepoDrizzle } from '../../infrastructure/membershipRepoDrizzle.ts';
import { z } from 'zod';
import { getDb } from '../../middlewares/use-drizzle-postgres.ts';

export const createMembershipRequestSchema = z.object({
  // TODO: If there were things to add to the membership this would be the place to add them
});

export const handleCreateMembership = async (c: Context) => {
  const teamId = c.req.param('teamId');
  const userId = c.req.param('userId');
  const body = await c.req.json();
  const parsed = await createMembershipRequestSchema.safeParseAsync(body);
  if (!parsed.success) {
    return c.text(JSON.stringify(parsed.error), 400);
  }
  const db = getDb(c);
  try {
    const createdUser = await createMembership(getMembershipRepoDrizzle(db))(
      {
        teamId,
        userId,
      },
    );
    return c.json(createdUser, 201);
  } catch (error) {
    if (error instanceof MembershipExistsError) {
      return c.text('User with matching email already exists', 400);
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
    return c.text('Membership not found', 404);
  }
  return c.json(membership);
};
