import { z } from 'zod';

export const ParamsSchema = z.object({
  teamId: z.string(),
  userId: z.string(),
});

export const CreateMembershipRequestSchema = z.object({
  // TODO: If there were things to add to the membership this would be the place to add them
});

export const MembershipResponseSchema = z.object({
  userId: z.string(),
  teamId: z.string(),
  created: z.string(),
});
