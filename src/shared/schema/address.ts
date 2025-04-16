import { z } from 'zod';

export const AddressCreateRequestFragment = z.object({
  street1: z.string().min(1),
  street2: z.string().optional().nullable(),
  city: z.string().min(1),
  state: z.string().min(1),
  zip: z.string().min(1),
});

// NOTE: These are identical for now; if they diverge we'll need to add a new schema at that time.
export const AddressResponseFragment = AddressCreateRequestFragment;
