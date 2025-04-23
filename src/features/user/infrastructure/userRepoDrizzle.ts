import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { UserRepository } from '../core/userRepo.ts';
import { users } from '../../../db/schema.ts';
import { User } from '../core/userTypes.ts';

export function getUserRepoDrizzle(db: NodePgDatabase): UserRepository {
  return {
    async findById(id: string): Promise<User | null> {
      const result = await db.select().from(users).where(eq(users.id, id));
      return result[0] ?? null;
    },
    async findByEmail(email: string): Promise<User | null> {
      const result = await db.select().from(users).where(
        eq(users.email, email),
      );
      return result[0] ?? null;
    },
    async create(user: Omit<User, 'id'>): Promise<User> {
      const result = await db.insert(users).values(user).returning({
        id: users.id,
      });
      return {
        ...user,
        id: result[0].id,
      };
    },
    findAll(): Promise<User[]> {
      return db.select().from(users);
    },
  } satisfies UserRepository;
}
