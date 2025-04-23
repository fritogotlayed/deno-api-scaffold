import { Membership } from './membershipTypes.ts';

export interface MembershipRepository {
  findByIds(
    { userId, teamId }: { userId: string; teamId: string },
  ): Promise<Membership | null>;
  findUsersForTeam(teamId: string): Promise<Membership[]>;
  findTeamsForUser(userId: string): Promise<Membership[]>;
  create(membership: Omit<Membership, 'created'>): Promise<Membership>;
}
