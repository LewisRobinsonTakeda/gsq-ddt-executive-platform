import { z } from 'zod';

/**
 * Zod schema for LeadershipAsk validation
 */
export const LeadershipAskSchema = z.object({
  id: z.string().uuid(),
  leadershipAskName: z.string().min(1, { message: "Leadership Ask Name is required" }),
  askDetails: z.string().min(1, { message: "Ask Details is required" }),
  askStatusKey: z.enum(['Draft', 'Submitted', 'UnderReview', 'Approved', 'Declined', 'Completed']),
  assignedRoleKey: z.enum(['ExecutiveSponsor', 'SiteLeader', 'PortfolioLead', 'DataLeader']),
  completedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  createdDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").min(1, { message: "Created Date is required" }),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").min(1, { message: "Due Date is required" }),
  entrySourceKey: z.enum(['SharePoint']),
  priorityKey: z.enum(['Low', 'Medium', 'High', 'Critical']),
  project: z.object({ id: z.string().uuid(), projectName: z.string() }).optional(),
  site: z.object({ id: z.string().uuid(), name1: z.string() }),
});

/**
 * Schema for creating a new LeadershipAsk (omits system-generated ID)
 */
export const CreateLeadershipAskSchema = LeadershipAskSchema.omit({ id: true });

/**
 * Schema for updating an existing LeadershipAsk
 */
export const UpdateLeadershipAskSchema = LeadershipAskSchema;

export type LeadershipAskInput = z.infer<typeof LeadershipAskSchema>;
export type CreateLeadershipAskInput = z.infer<typeof CreateLeadershipAskSchema>;
export type UpdateLeadershipAskInput = z.infer<typeof UpdateLeadershipAskSchema>;