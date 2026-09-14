import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LeadershipAsksService } from "../services/leadership-asks-service";
import type { LeadershipAsks } from "../models/leadership-asks-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all LeadershipAsks records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, authorName, impact, neededBy, period, siteCode
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useLeadershipAsksList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["leadershipAsks-list", options],
    queryFn: () => LeadershipAsksService.getAll(options),
  });
}

/**
 * Retrieve a single LeadershipAsks record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useLeadershipAsks(id: string) {
  return useQuery({
    queryKey: ["leadershipAsks", id],
    queryFn: () => LeadershipAsksService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new LeadershipAsks record.
 * @remarks Form validation: use CreateLeadershipAsksSchema with zodResolver for type-safe create forms
 */
export function useCreateLeadershipAsks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<LeadershipAsks, "id">) => LeadershipAsksService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["leadershipAsks-list"] });
    },
  });
}

/**
 * Update an existing LeadershipAsks record.
 * @remarks Form validation: use UpdateLeadershipAsksSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateLeadershipAsks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<LeadershipAsks, "id">>;
    }) => LeadershipAsksService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["leadershipAsks-list"] });
      client.invalidateQueries({ queryKey: ["leadershipAsks", variables.id] });
    },
  });
}

/**
 * Delete a LeadershipAsks record by its unique identifier.
 */
export function useDeleteLeadershipAsks() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => LeadershipAsksService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["leadershipAsks-list"] });
      client.invalidateQueries({ queryKey: ["leadershipAsks", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const LeadershipAsks_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { LeadershipAsksSchema, CreateLeadershipAsksSchema, UpdateLeadershipAsksSchema } from "../validators/leadership-asks-validator";
export type { LeadershipAsksInput, CreateLeadershipAsksInput, UpdateLeadershipAsksInput } from "../validators/leadership-asks-validator";