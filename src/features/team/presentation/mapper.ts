import { z } from '@hono/zod-openapi';
import { TeamResponseSchema } from './schema.ts';
import { Team } from '../core/teamTypes.ts';
import { Address } from '../../address/core/addressTypes.ts';
import {
  AddressResponseFragmentDTO,
  mapAddressToResponseFragmentDto,
} from '../../../shared/address/mapper.ts';
import { FeatureFlagsClient } from '../../../feature-flags-client.ts';

export type TeamResponseDto = z.infer<typeof TeamResponseSchema>;

export async function mapTeamToResponseDto(
  { team, address }: { team: Team; address?: Address | null },
): Promise<TeamResponseDto> {
  const useHateoasLinks = await FeatureFlagsClient.getFeatureFlagEnabled(
    'hateoas-links',
  );

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
    _links: useHateoasLinks ? _links : undefined,
  };
}
