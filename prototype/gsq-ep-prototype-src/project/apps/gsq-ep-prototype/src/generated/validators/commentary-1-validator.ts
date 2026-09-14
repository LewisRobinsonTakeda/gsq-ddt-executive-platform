import { z } from 'zod';

/**
 * Zod schema for Commentary_1 validation
 */
export const Commentary_1Schema = z.object({
  id: z.number().int(),
  title: z.string().min(1, { message: "Title is required" }),
  authorName: z.string().optional(),
  body: z.string().optional(),
  period: z.string().optional(),
  rockId: z.string().optional(),
  sentiment: z.string().optional(),
  siteCode: z.string().optional(),
});

/**
 * Schema for creating a new Commentary_1 (omits system-generated ID)
 */
export const CreateCommentary_1Schema = Commentary_1Schema.omit({ id: true });

/**
 * Schema for updating an existing Commentary_1
 */
export const UpdateCommentary_1Schema = Commentary_1Schema;

export type Commentary_1Input = z.infer<typeof Commentary_1Schema>;
export type CreateCommentary_1Input = z.infer<typeof CreateCommentary_1Schema>;
export type UpdateCommentary_1Input = z.infer<typeof UpdateCommentary_1Schema>;