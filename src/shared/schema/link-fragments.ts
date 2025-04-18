import { z } from 'zod';

const LinkData = z.object({
  href: z.string(),
  method: z.string(),
  description: z.string().optional(),
});

export const LinksFragment = z.object({
  _links: z.optional(
    z.record(z.string(), z.union([LinkData, z.array(LinkData)])),
  ),
});
