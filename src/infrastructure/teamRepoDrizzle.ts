import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { TeamRepository } from '../core/team/teamRepo.ts';
import { teams } from '../db/schema.ts';
import { Team } from '../core/team/teamTypes.ts';

export function getTeamRepoDrizzle(db: NodePgDatabase): TeamRepository {
  return {
    async findById(id: string): Promise<Team | null> {
      const result = await db.select().from(teams).where(eq(teams.id, id));
      return result[0] ?? null;
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
