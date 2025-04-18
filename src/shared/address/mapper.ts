import { z } from '@hono/zod-openapi';
import { Address } from '../../core/address/addressTypes.ts';
import { AddressResponseFragment } from '../schema/address.ts';

export type AddressResponseFragmentDTO = z.infer<
  typeof AddressResponseFragment
>;

/**
 * Maps a User domain entity to a UserResponseDto
 */
export function mapAddressToResponseFragmentDto(
  address: Address,
): AddressResponseFragmentDTO {
  return {
    // id: address.id,
    street1: address.street1,
    street2: address.street2,
    city: address.city,
    state: address.state,
    zip: address.zip,
  };
}
