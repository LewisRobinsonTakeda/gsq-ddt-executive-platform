import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LeadershipAskService } from "../services/leadership-ask-service";
import type { LeadershipAsk } from "../models/leadership-ask-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all LeadershipAsk records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, leadershipAskName, askDetails, askStatusKey, assignedRoleKey, completedDate, createdDate, dueDate, entrySourceKey, priorityKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useLeadershipAskList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["leadershipAsk-list", options],
    queryFn: () => LeadershipAskService.getAll(options),
  });
}

/**
 * Retrieve a single LeadershipAsk record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useLeadershipAsk(id: string) {
  return useQuery({
    queryKey: ["leadershipAsk", id],
    queryFn: () => LeadershipAskService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new LeadershipAsk record.
 * @remarks Form validation: use CreateLeadershipAskSchema with zodResolver for type-safe create forms
 */
export function useCreateLeadershipAsk() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<LeadershipAsk, "id">) => LeadershipAskService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["leadershipAsk-list"] });
    },
  });
}

/**
 * Update an existing LeadershipAsk record.
 * @remarks Form validation: use UpdateLeadershipAskSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateLeadershipAsk() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<LeadershipAsk, "id">>;
    }) => LeadershipAskService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["leadershipAsk-list"] });
      client.invalidateQueries({ queryKey: ["leadershipAsk", variables.id] });
    },
  });
}

/**
 * Delete a LeadershipAsk record by its unique identifier.
 */
export function useDeleteLeadershipAsk() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => LeadershipAskService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["leadershipAsk-list"] });
      client.invalidateQueries({ queryKey: ["leadershipAsk", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const LeadershipAsk_DATA_SOURCE_TYPE = 'InMemory' as const;

export { LeadershipAskSchema, CreateLeadershipAskSchema, UpdateLeadershipAskSchema } from "../validators/leadership-ask-validator";
export type { LeadershipAskInput, CreateLeadershipAskInput, UpdateLeadershipAskInput } from "../validators/leadership-ask-validator";