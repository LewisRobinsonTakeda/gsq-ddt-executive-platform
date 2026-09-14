import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GoLiveConfirmationService } from "../services/go-live-confirmation-service";
import type { GoLiveConfirmation } from "../models/go-live-confirmation-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all GoLiveConfirmation records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, goLiveConfirmationName, confirmationComments, confirmationStatusKey, confirmedByRoleKey, confirmedDate, createdDate, entrySourceKey, plannedGoLiveDate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useGoLiveConfirmationList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["goLiveConfirmation-list", options],
    queryFn: () => GoLiveConfirmationService.getAll(options),
  });
}

/**
 * Retrieve a single GoLiveConfirmation record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useGoLiveConfirmation(id: string) {
  return useQuery({
    queryKey: ["goLiveConfirmation", id],
    queryFn: () => GoLiveConfirmationService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new GoLiveConfirmation record.
 * @remarks Form validation: use CreateGoLiveConfirmationSchema with zodResolver for type-safe create forms
 */
export function useCreateGoLiveConfirmation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<GoLiveConfirmation, "id">) => GoLiveConfirmationService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["goLiveConfirmation-list"] });
    },
  });
}

/**
 * Update an existing GoLiveConfirmation record.
 * @remarks Form validation: use UpdateGoLiveConfirmationSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateGoLiveConfirmation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<GoLiveConfirmation, "id">>;
    }) => GoLiveConfirmationService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["goLiveConfirmation-list"] });
      client.invalidateQueries({ queryKey: ["goLiveConfirmation", variables.id] });
    },
  });
}

/**
 * Delete a GoLiveConfirmation record by its unique identifier.
 */
export function useDeleteGoLiveConfirmation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => GoLiveConfirmationService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["goLiveConfirmation-list"] });
      client.invalidateQueries({ queryKey: ["goLiveConfirmation", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const GoLiveConfirmation_DATA_SOURCE_TYPE = 'InMemory' as const;

export { GoLiveConfirmationSchema, CreateGoLiveConfirmationSchema, UpdateGoLiveConfirmationSchema } from "../validators/go-live-confirmation-validator";
export type { GoLiveConfirmationInput, CreateGoLiveConfirmationInput, UpdateGoLiveConfirmationInput } from "../validators/go-live-confirmation-validator";