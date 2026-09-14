import { z } from 'zod';

/**
 * Zod schema for Commentary validation
 */
export const CommentarySchema = z.object({
  id: z.string().uuid(),
  commentaryTitle: z.string().min(1, { message: "Commentary Title is required" }),
  approvalComments: z.string().optional(),
  categoryKey: z.enum(['ExecutiveSummary', 'Progress', 'Constraint', 'Decision']),
  commentary: z.string().min(1, { message: "Commentary is required" }),
  createdDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").min(1, { message: "Created Date is required" }),
  entrySourceKey: z.enum(['SharePoint']),
  publicationStatusKey: z.enum(['Draft', 'InReview', 'Approved', 'Published', 'Archived']),
  reviewedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  site: z.object({ id: z.string().uuid(), name1: z.string() }),
});

/**
 * Schema for creating a new Commentary (omits system-generated ID)
 */
export const CreateCommentarySchema = CommentarySchema.omit({ id: true });

/**
 * Schema for updating an existing Commentary
 */
export const UpdateCommentarySchema = CommentarySchema;

export type CommentaryInput = z.infer<typeof CommentarySchema>;
export type CreateCommentaryInput = z.infer<typeof CreateCommentarySchema>;
export type UpdateCommentaryInput = z.infer<typeof UpdateCommentarySchema>;