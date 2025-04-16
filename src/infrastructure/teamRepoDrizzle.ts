import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { TeamRepository } from '../core/team/teamRepo.ts';
import { address, teams } from '../db/schema.ts';
import { Team } from '../core/team/teamTypes.ts';

export function getTeamRepoDrizzle(db: NodePgDatabase): TeamRepository {
  return {
    async findById(id: string): Promise<Team | null> {
      const result = await db.select().from(teams).leftJoin(
        address,
        eq(teams.addressId, address.id),
      ).where(eq(teams.id, id));
      if (result.length === 0) {
        return null;
      }
      const team: Team = result[0].teams;
      if (result[0].address) {
        team.address = result[0].address;
      }
      return team;
    },
    async findByName(name: string): Promise<Team | null> {
      const result = await db.select().from(teams).where(eq(teams.name, name));
      return result[0] ?? null;
    },
    async create(team: Omit<Team, 'id'>): Promise<Team> {
      const result = await db.insert(teams).values(team).returning({
        id: teams.id,
      });
      return {
        ...team,
        id: result[0].id,
      };
    },
  } satisfies TeamRepository;
}
