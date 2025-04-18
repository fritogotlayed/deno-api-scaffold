import { z } from '@hono/zod-openapi';
import { User } from '../../core/user/userTypes.ts';
import { UserResponseSchema } from './schema.ts';

export type UserResponseDto = z.infer<typeof UserResponseSchema>;

/**
 * Maps a User domain entity to a UserResponseDto
 */
export function mapUserToResponseDto(
  { user }: { user: User },
): UserResponseDto {
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
    _links,
  };
}
