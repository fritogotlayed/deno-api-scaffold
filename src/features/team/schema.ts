import { z } from 'zod';
import {
  AddressCreateRequestFragment,
  AddressResponseFragment,
} from '../../shared/schema/address.ts';

export const ParamsSchema = z.object({
  teamId: z.string(),
});

export const CreateTeamRequestSchema = z.object({
  name: z.string().min(1),
  addressId: z.string().optional(),
  address: AddressCreateRequestFragment.optional(),
});

export const TeamResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: AddressResponseFragment.optional(),
});
