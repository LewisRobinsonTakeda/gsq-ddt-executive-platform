import { z } from 'zod';

/**
 * Zod schema for LeadershipAsks validation
 */
export const LeadershipAsksSchema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  authorName: z.string().optional(),
  impact: z.string().optional(),
  neededBy: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  period: z.string().optional(),
  siteCode: z.string().optional(),
});

/**
 * Schema for creating a new LeadershipAsks (omits system-generated ID)
 */
export const CreateLeadershipAsksSchema = LeadershipAsksSchema.omit({ id: true });

/**
 * Schema for updating an existing LeadershipAsks
 */
export const UpdateLeadershipAsksSchema = LeadershipAsksSchema;

export type LeadershipAsksInput = z.infer<typeof LeadershipAsksSchema>;
export type CreateLeadershipAsksInput = z.infer<typeof CreateLeadershipAsksSchema>;
export type UpdateLeadershipAsksInput = z.infer<typeof UpdateLeadershipAsksSchema>;