import { z } from 'zod';
import { AddressResponseFragment } from '../../../shared/schema/address.ts';
import { LinksFragment } from '../../../shared/schema/link-fragments.ts';

export const ParamsSchema = z.object({
  addressId: z.string(),
});

export const CreateAddressRequestSchema = AddressResponseFragment;
export const AddressResponseSchema = z.object({
  id: z.string(),
}).merge(AddressResponseFragment)
  .merge(LinksFragment);
