import { TeamRepository } from './teamRepo.ts';
import { Team } from './teamTypes.ts';
import { AddressRepository } from '../address/addressRepo.ts';
import {
  createAddress,
  InvalidAddressError,
} from '../address/addressUseCases.ts';
import { Address } from '../address/addressTypes.ts';

export class TeamExistsError extends Error {
  constructor(name: string) {
    super(`Team with name ${name} already exists`);
    this.name = 'TeamExistsError';
    Object.setPrototypeOf(this, TeamExistsError.prototype);
  }
}

export const createTeam = (
  {
    teamRepo,
    addressRepo,
  }: {
    teamRepo: TeamRepository;
    addressRepo: AddressRepository;
  },
) =>
async (
  team: Omit<Team, 'id'>,
  { address }: { address?: Omit<Address, 'id' | 'hash'> } = {},
) => {
  // Add business logic, validation, etc.
  const teamWithName = await teamRepo.findByName(team.name);

  if (teamWithName) {
    throw new TeamExistsError(team.name);
  }

  let teamAddress: Address | null | undefined;
  if (team.addressId) {
    teamAddress = await addressRepo.findById(team.addressId);
    if (!teamAddress) {
      throw new InvalidAddressError(
        'Unable to find address with id: ' + team.addressId,
      );
    }
  }

  if (address) {
    teamAddress = await createAddress(addressRepo)(address);
    team.addressId = teamAddress.id;
  }

  return await teamRepo.create(team);
};

export const getTeam = (repo: TeamRepository) => async (id: string) => {
  return await repo.findById(id);
};
