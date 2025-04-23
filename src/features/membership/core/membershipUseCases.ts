import { Membership } from './membershipTypes.ts';
import { MembershipRepository } from './membershipRepo.ts';

export class MembershipExistsError extends Error {
  constructor(teamId: string, userId: string) {
    super(
      `Membership with teamId ${teamId} and userId ${userId} already exists`,
    );
    this.name = 'MembershipExistsError';
    Object.setPrototypeOf(this, MembershipExistsError.prototype);
  }
}

export const createMembership = (repo: MembershipRepository) =>
async (
  membership: Omit<Membership, 'created'>,
) => {
  // Add business logic, validation, etc.
  const existingMembership = await repo.findByIds({
    userId: membership.userId,
    teamId: membership.teamId,
  });

  if (existingMembership) {
    throw new MembershipExistsError(membership.teamId, membership.userId);
  }

  return await repo.create(membership);
};

export const getMembership = (repo: MembershipRepository) =>
async (
  userId: string,
  teamId: string,
) => {
  return await repo.findByIds({ userId, teamId });
};

export const getMembershipsOfTeam = (repo: MembershipRepository) =>
async (
  teamId: string,
) => {
  return await repo.findUsersForTeam(teamId);
};

export const getMembershipsOfUser = (repo: MembershipRepository) =>
async (
  userId: string,
) => {
  return await repo.findTeamsForUser(userId);
};
