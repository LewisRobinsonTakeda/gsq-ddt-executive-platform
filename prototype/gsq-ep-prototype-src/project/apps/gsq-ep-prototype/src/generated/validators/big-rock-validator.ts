import { z } from 'zod';

/**
 * Zod schema for BigRock validation
 */
export const BigRockSchema = z.object({
  id: z.string().uuid(),
  bigRockName: z.string().min(1, { message: "Big Rock Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  sortOrder: z.number().int(),
});

/**
 * Schema for creating a new BigRock (omits system-generated ID)
 */
export const CreateBigRockSchema = BigRockSchema.omit({ id: true });

/**
 * Schema for updating an existing BigRock
 */
export const UpdateBigRockSchema = BigRockSchema;

export type BigRockInput = z.infer<typeof BigRockSchema>;
export type CreateBigRockInput = z.infer<typeof CreateBigRockSchema>;
export type UpdateBigRockInput = z.infer<typeof UpdateBigRockSchema>;