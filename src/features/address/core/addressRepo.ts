import { Address } from './addressTypes.ts';

export interface AddressRepository {
  findById(id: string): Promise<Address | null>;
  findByHash(hash: string): Promise<Address | null>;
  create(address: Omit<Address, 'id'>): Promise<Address>;
}
