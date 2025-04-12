import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { MembershipRepository } from '../core/membership/membershipRepo.ts';
import { membership } from '../db/schema.ts';
import { Membership } from '../core/membership/membershipTypes.ts';

export function getMembershipRepoDrizzle(
  db: NodePgDatabase,
): MembershipRepository {
  return {
    async findByIds({ userId, teamId }: {
      userId: string;
      teamId: string;
    }): Promise<Membership | null> {
      const result = await db.select()
        .from(membership)
        .where(
          and(
            eq(membership.userId, userId),
            eq(membership.teamId, teamId),
          ),
        );
      return result[0] ?? null;
    },

    async findUsersForTeam(teamId: string): Promise<Membership[]> {
      return await db.select()
        .from(membership)
        .where(eq(membership.teamId, teamId));
    },

    async findTeamsForUser(userId: string): Promise<Membership[]> {
      return await db.select()
        .from(membership)
        .where(eq(membership.userId, userId));
    },

    async create(
      newMembership: Omit<Membership, 'created'>,
    ): Promise<Membership> {
      await db.insert(membership)
        .values({ ...newMembership, created: new Date() });
      return this.findByIds({
        userId: newMembership.userId,
        teamId: newMembership.teamId,
      }) as Promise<
        Membership
      >;
    },
  } satisfies MembershipRepository;
}
