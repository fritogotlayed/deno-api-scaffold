import { z } from '@hono/zod-openapi';
import { AddressResponseSchema } from './schema.ts';
import { Address } from '../../core/address/addressTypes.ts';
import { mapAddressToResponseFragmentDto } from '../../shared/address/mapper.ts';

// Define the shape of your DTO
export type AddressResponseDTO = z.infer<typeof AddressResponseSchema>;

/**
 * Maps a Membership domain entity to a MembershipResponseDto
 */
export function mapAddressToResponseDto(
  address: Address,
): AddressResponseDTO {
  const _links: AddressResponseDTO['_links'] = {
    self: {
      href: `/addresses/${address.id}`,
      method: 'GET',
      description: 'Get address details',
    },
    address: {
      href: `/addresses`,
      method: 'POST',
      description: 'Create new address',
    },
  };
  return {
    id: address.id,
    ...mapAddressToResponseFragmentDto(address),
    _links,
  };
}
