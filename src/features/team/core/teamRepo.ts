import { Team } from './teamTypes.ts';

export interface TeamRepository {
  findById(id: string): Promise<Team | null>;
  findByName(name: string): Promise<Team | null>;
  create(user: Omit<Team, 'id'>): Promise<Team>;
}
