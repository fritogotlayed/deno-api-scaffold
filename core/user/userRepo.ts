import { User } from './userTypes.ts';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  create(user: User): Promise<User>;
}
