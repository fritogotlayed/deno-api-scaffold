import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { AddressRepository } from '../core/addressRepo.ts';
import { address } from '../../../db/schema.ts';
import { Address } from '../core/addressTypes.ts';

export function getAddressRepoDrizzle(db: NodePgDatabase): AddressRepository {
  return {
    async findById(id: string): Promise<Address | null> {
      const result = await db.select().from(address).where(eq(address.id, id));
      return result[0] ?? null;
    },
    async findByHash(hash: string): Promise<Address | null> {
      const result = await db.select().from(address).where(
        eq(address.hash, hash),
      );
      return result[0] ?? null;
    },
    async create(newAddress: Omit<Address, 'id'>): Promise<Address> {
      const result = await db.insert(address).values(newAddress).returning({
        id: address.id,
        hash: address.hash,
      });
      return {
        ...newAddress,
        id: result[0].id,
      };
    },
  } satisfies AddressRepository;
}
