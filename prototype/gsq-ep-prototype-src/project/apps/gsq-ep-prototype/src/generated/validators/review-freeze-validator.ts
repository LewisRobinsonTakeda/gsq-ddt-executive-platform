import { z } from 'zod';

/**
 * Zod schema for ReviewFreeze validation
 */
export const ReviewFreezeSchema = z.object({
  id: z.string().uuid(),
  reviewFreezeName: z.string().min(1, { message: "Review Freeze Name is required" }),
  entrySourceKey: z.enum(['SharePoint']),
  freezeEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").min(1, { message: "Freeze End is required" }),
  freezeReason: z.string().min(1, { message: "Freeze Reason is required" }),
  freezeStart: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").min(1, { message: "Freeze Start is required" }),
  freezeStatusKey: z.enum(['Draft', 'Scheduled', 'Active', 'Released', 'Cancelled']),
  lockedByRoleKey: z.enum(['PlatformAdmin', 'PortfolioLead', 'ExecutiveReviewer']),
  reviewCycle: z.string().min(1, { message: "Review Cycle is required" }),
  site: z.object({ id: z.string().uuid(), name1: z.string() }),
});

/**
 * Schema for creating a new ReviewFreeze (omits system-generated ID)
 */
export const CreateReviewFreezeSchema = ReviewFreezeSchema.omit({ id: true });

/**
 * Schema for updating an existing ReviewFreeze
 */
export const UpdateReviewFreezeSchema = ReviewFreezeSchema;

export type ReviewFreezeInput = z.infer<typeof ReviewFreezeSchema>;
export type CreateReviewFreezeInput = z.infer<typeof CreateReviewFreezeSchema>;
export type UpdateReviewFreezeInput = z.infer<typeof UpdateReviewFreezeSchema>;