import { z } from 'zod';
import {
  AddressCreateRequestFragment,
  AddressResponseFragment,
} from '../../shared/schema/address.ts';
import { LinksFragment } from '../../shared/schema/link-fragments.ts';

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
}).merge(LinksFragment);
