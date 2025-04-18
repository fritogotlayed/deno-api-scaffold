import { z } from '@hono/zod-openapi';
import { Membership } from '../../core/membership/membershipTypes.ts';
import { MembershipResponseSchema } from './schema.ts';

// Define the shape of your DTO
export type MembershipResponseDto = z.infer<typeof MembershipResponseSchema>;

/**
 * Maps a Membership domain entity to a MembershipResponseDto
 */
export function mapMembershipToResponseDto(
  membership: Membership,
): MembershipResponseDto {
  const _links: MembershipResponseDto['_links'] = {
    self: {
      href: `/users/${membership.userId}/memberships/${membership.teamId}`,
      method: 'GET',
      description: 'Get membership details',
    },
    user: {
      href: `/users/${membership.userId}`,
      method: 'GET',
      description: 'Get user details',
    },
    team: {
      href: `/teams/${membership.teamId}`,
      method: 'GET',
      description: 'Get team details',
    },
  };
  return {
    userId: membership.userId,
    teamId: membership.teamId,
    created: membership.created.toISOString(),
    _links,
  };
}
