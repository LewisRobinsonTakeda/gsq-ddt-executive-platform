import { z } from 'zod';

/**
 * Zod schema for DigitalPlatform validation
 */
export const DigitalPlatformSchema = z.object({
  id: z.string().uuid(),
  digitalPlatformName: z.string().min(1, { message: "Digital Platform Name is required" }),
  description: z.string().optional(),
  platformCategoryKey: z.enum(['Manufacturing', 'Laboratory', 'AssetManagement', 'Analytics', 'Enterprise']),
  platformCode: z.string().min(1, { message: "Platform Code is required" }),
});

/**
 * Schema for creating a new DigitalPlatform (omits system-generated ID)
 */
export const CreateDigitalPlatformSchema = DigitalPlatformSchema.omit({ id: true });

/**
 * Schema for updating an existing DigitalPlatform
 */
export const UpdateDigitalPlatformSchema = DigitalPlatformSchema;

export type DigitalPlatformInput = z.infer<typeof DigitalPlatformSchema>;
export type CreateDigitalPlatformInput = z.infer<typeof CreateDigitalPlatformSchema>;
export type UpdateDigitalPlatformInput = z.infer<typeof UpdateDigitalPlatformSchema>;