import { UserRepository } from './userRepo.ts';
import { User } from './userTypes.ts';

export class UserExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'UserExistsError';
    Object.setPrototypeOf(this, UserExistsError.prototype);
  }
}

export const createUser =
  (repo: UserRepository) => async (user: Omit<User, 'id'>) => {
    // Add business logic, validation, etc.
    const userWithEmail = await repo.findByEmail(user.email);

    if (userWithEmail) {
      throw new UserExistsError(user.email);
    }

    return await repo.create(user);
  };

export const getUser = (repo: UserRepository) => async (id: string) => {
  return await repo.findById(id);
};
