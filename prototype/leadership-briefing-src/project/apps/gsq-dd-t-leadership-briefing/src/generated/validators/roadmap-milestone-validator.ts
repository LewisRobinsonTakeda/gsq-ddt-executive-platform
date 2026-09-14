import { z } from 'zod';

/**
 * Zod schema for RoadmapMilestone validation
 */
export const RoadmapMilestoneSchema = z.object({
  id: z.string().uuid(),
  roadmapMilestoneName: z.string().min(1, { message: "Roadmap Milestone Name is required" }),
  completedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  milestoneNote: z.string().optional(),
  milestoneTypeKey: z.enum(['Design', 'Build', 'Validation', 'GoLive', 'Closeout']),
  plannedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").min(1, { message: "Planned Date is required" }),
  portfolioInitiative: z.object({ id: z.string().uuid(), portfolioInitiativeName: z.string() }),
  statusKey: z.enum(['Planned', 'InProgress', 'Completed', 'Delayed']),
});

/**
 * Schema for creating a new RoadmapMilestone (omits system-generated ID)
 */
export const CreateRoadmapMilestoneSchema = RoadmapMilestoneSchema.omit({ id: true });

/**
 * Schema for updating an existing RoadmapMilestone
 */
export const UpdateRoadmapMilestoneSchema = RoadmapMilestoneSchema;

export type RoadmapMilestoneInput = z.infer<typeof RoadmapMilestoneSchema>;
export type CreateRoadmapMilestoneInput = z.infer<typeof CreateRoadmapMilestoneSchema>;
export type UpdateRoadmapMilestoneInput = z.infer<typeof UpdateRoadmapMilestoneSchema>;