import { z } from 'zod';
import { LinksFragment } from '../../shared/schema/link-fragments.ts';

export const UserIdParamsSchema = z.object({
  userId: z.string(),
});

export const TeamIdParamsSchema = z.object({
  teamId: z.string(),
});

export const UserAndTeamIdsParamsSchema = z.object({
  teamId: z.string(),
  userId: z.string(),
});

export const CreateTeamMembershipRequestSchema = z.object({
  teamId: z.string(),
});

export const CreateUserMembershipRequestSchema = z.object({
  userId: z.string(),
});

export const MembershipResponseSchema = z.object({
  userId: z.string(),
  teamId: z.string(),
  created: z.string(),
}).merge(LinksFragment);
