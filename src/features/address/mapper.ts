import { z } from '@hono/zod-openapi';
import { AddressResponseSchema } from './schema.ts';
import { Address } from '../../core/address/addressTypes.ts';

/**
 * Maps a User domain entity to a UserResponseDto
 */
export function mapAddressToResponseDto(
  address: Address,
): z.infer<typeof AddressResponseSchema> {
  return {
    id: address.id,
    street1: address.street1,
    street2: address.street2,
    city: address.city,
    state: address.state,
    zip: address.zip,
  };
}
