import { UserRepository } from '../core/user/userRepo.ts';
import { db } from '../config/db.ts';
import { users } from '../db/schema.ts';
import { User } from '../core/user/userTypes.ts';

export const userRepoDrizzle: UserRepository = {
  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(users.id.equals(id))
      .get();
    return result[0] ?? null;
  },
  async create(user: User): Promise<User> {
    await db.insert(users).values(user);
    return user;
  },
};
