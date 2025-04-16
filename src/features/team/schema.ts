import { z } from 'zod';

export const ParamsSchema = z.object({
  teamId: z.string(),
});

export const CreateTeamRequestSchema = z.object({
  name: z.string().min(1),
});

export const TeamResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
});
