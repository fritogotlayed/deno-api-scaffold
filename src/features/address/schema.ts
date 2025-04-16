import { z } from 'zod';
import { AddressResponseFragment } from '../../shared/schema/address.ts';

export const ParamsSchema = z.object({
  addressId: z.string(),
});

export const CreateAddressRequestSchema = AddressResponseFragment;
export const AddressResponseSchema = z.object({
  id: z.string(),
}).merge(AddressResponseFragment);
