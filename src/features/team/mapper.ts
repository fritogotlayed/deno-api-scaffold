import { z } from '@hono/zod-openapi';
import { TeamResponseSchema } from './schema.ts';
import { Team } from '../../core/team/teamTypes.ts';
import { Address } from '../../core/address/addressTypes.ts';
import {
  AddressResponseFragmentDTO,
  mapAddressToResponseFragmentDto,
} from '../../shared/address/mapper.ts';

export type TeamResponseDto = z.infer<typeof TeamResponseSchema>;

export function mapTeamToResponseDto(
  { team, address }: { team: Team; address?: Address | null },
): TeamResponseDto {
  const _links: TeamResponseDto['_links'] = {
    self: {
      href: `/teams/${team.id}`,
      method: 'GET',
    },
    memberships: [{
      href: `/teams/${team.id}/members`,
      method: 'GET',
      description: 'Get membership details for this team',
    }, {
      href: `/teams/${team.id}/members`,
      method: 'POST',
      description: 'Create a new membership for this team',
    }],
  };
  let addressDTO: AddressResponseFragmentDTO | undefined;
  if (address) {
    addressDTO = mapAddressToResponseFragmentDto(address);
  }
  return {
    id: team.id,
    name: team.name,
    address: addressDTO,
    _links,
  };
}
