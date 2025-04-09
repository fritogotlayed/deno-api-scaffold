import { UserRepository } from './userRepo.ts';
import { User } from './userTypes.ts';

export const createUser = (arepo: UserRepository) => async (user: User) => {
  // Add business logic, validation, etc.
  return await arepo.create(user);
};

export const getUser = (arepo: UserRepository) => async (id: string) => {
  return await arepo.findById(id);
};
