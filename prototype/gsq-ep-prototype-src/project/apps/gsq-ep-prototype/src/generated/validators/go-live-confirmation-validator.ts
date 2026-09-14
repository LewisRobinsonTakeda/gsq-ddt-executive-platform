import { z } from 'zod';

/**
 * Zod schema for GoLiveConfirmation validation
 */
export const GoLiveConfirmationSchema = z.object({
  id: z.string().uuid(),
  goLiveConfirmationName: z.string().min(1, { message: "Go-Live Confirmation Name is required" }),
  confirmationComments: z.string().optional(),
  confirmationStatusKey: z.enum(['Pending', 'Confirmed', 'Deferred', 'Cancelled']),
  confirmedByRoleKey: z.enum(['SiteLeader', 'ProjectLead', 'ExecutiveSponsor']).optional(),
  confirmedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").optional(),
  createdDate: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/, "DateTime must be in ISO format").min(1, { message: "Created Date is required" }),
  entrySourceKey: z.enum(['SharePoint']),
  plannedGoLiveDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format").min(1, { message: "Planned Go-Live Date is required" }),
  project: z.object({ id: z.string().uuid(), projectName: z.string() }),
});

/**
 * Schema for creating a new GoLiveConfirmation (omits system-generated ID)
 */
export const CreateGoLiveConfirmationSchema = GoLiveConfirmationSchema.omit({ id: true });

/**
 * Schema for updating an existing GoLiveConfirmation
 */
export const UpdateGoLiveConfirmationSchema = GoLiveConfirmationSchema;

export type GoLiveConfirmationInput = z.infer<typeof GoLiveConfirmationSchema>;
export type CreateGoLiveConfirmationInput = z.infer<typeof CreateGoLiveConfirmationSchema>;
export type UpdateGoLiveConfirmationInput = z.infer<typeof UpdateGoLiveConfirmationSchema>;