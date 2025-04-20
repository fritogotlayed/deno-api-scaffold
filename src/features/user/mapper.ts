import { z } from '@hono/zod-openapi';
import { User } from '../../core/user/userTypes.ts';
import { UserResponseSchema } from './schema.ts';
import { FeatureFlagsClient } from '../../feature-flags-client.ts';

export type UserResponseDto = z.infer<typeof UserResponseSchema>;

/**
 * Maps a User domain entity to a UserResponseDto
 */
export async function mapUserToResponseDto(
  { user }: { user: User },
): Promise<UserResponseDto> {
  const useHateoasLinks = await FeatureFlagsClient.getFeatureFlagEnabled(
    'hateoas-links',
  );

  const _links: UserResponseDto['_links'] = {
    self: {
      href: `/users/${user.id}`,
      method: 'GET',
    },
    memberships: [{
      href: `/users/${user.id}/memberships`,
      method: 'GET',
      description: 'Get membership details for this user',
    }, {
      href: `/users/${user.id}/memberships`,
      method: 'POST',
      description: 'Create a new membership for this user',
    }],
  };

  // Password is intentionally omitted for security
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    _links: useHateoasLinks ? _links : undefined,
  };
}
