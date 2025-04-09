import {eq} from "drizzle-orm";
import { UserRepository } from '../core/user/userRepo.ts';
import { db } from '../config/db.ts';
import { users } from '../db/schema.ts';
import { User } from '../core/user/userTypes.ts';

export const userRepoDrizzle: UserRepository = {
  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0] ?? null;
  },
  async findByEmail(email: string): Promise<User | null> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0] ?? null;
  },
  async create(user: Omit<User, 'id'>): Promise<User> {
    const result = await db.insert(users).values(user).returning({ id: users.id });
    return {
      id: result[0].id,
      ...user
    };
  },
};
