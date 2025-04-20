import { z } from '@hono/zod-openapi';
import { Membership } from '../../core/membership/membershipTypes.ts';
import { MembershipResponseSchema } from './schema.ts';
import { FeatureFlagsClient } from '../../feature-flags-client.ts';

// Define the shape of your DTO
export type MembershipResponseDto = z.infer<typeof MembershipResponseSchema>;

/**
 * Maps a Membership domain entity to a MembershipResponseDto
 */
export async function mapMembershipToResponseDto(
  membership: Membership,
): Promise<MembershipResponseDto> {
  const useHateoasLinks = await FeatureFlagsClient.getFeatureFlagEnabled(
    'hateoas-links',
  );

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
    _links: useHateoasLinks ? _links : undefined,
  };
}
