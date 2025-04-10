import { TeamRepository } from './teamRepo.ts';
import { Team } from './teamTypes.ts';

export class TeamExistsError extends Error {
  constructor(name: string) {
    super(`Team with name ${name} already exists`);
    this.name = 'TeamExistsError';
    Object.setPrototypeOf(this, TeamExistsError.prototype);
  }
}

export const createTeam =
  (repo: TeamRepository) => async (team: Omit<Team, 'id'>) => {
    // Add business logic, validation, etc.
    const teamWithName = await repo.findByName(team.name);

    if (teamWithName) {
      throw new TeamExistsError(team.name);
    }

    return await repo.create(team);
  };

export const getTeam = (repo: TeamRepository) => async (id: string) => {
  return await repo.findById(id);
};
