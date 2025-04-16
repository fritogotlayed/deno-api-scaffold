import { Address } from '../address/addressTypes.ts';

export type Team = {
  id: string;
  name: string;
  addressId?: string | null;
  address?: Omit<Address, 'id' | 'hash'>;
};
