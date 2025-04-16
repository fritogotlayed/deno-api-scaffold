import { Membership } from '../../core/membership/membershipTypes.ts';

// Define the shape of your DTO
export interface MembershipResponseDto {
  userId: string;
  teamId: string;
  created: string;
}

/**
 * Maps a Membership domain entity to a MembershipResponseDto
 */
export function mapMembershipToResponseDto(
  membership: Membership,
): MembershipResponseDto {
  return {
    userId: membership.userId,
    teamId: membership.teamId,
    created: membership.created.toISOString(),
  };
}
