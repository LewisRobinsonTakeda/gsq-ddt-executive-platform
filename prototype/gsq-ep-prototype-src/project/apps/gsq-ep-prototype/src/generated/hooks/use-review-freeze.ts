import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewFreezeService } from "../services/review-freeze-service";
import type { ReviewFreeze } from "../models/review-freeze-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ReviewFreeze records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, reviewFreezeName, entrySourceKey, freezeEnd, freezeReason, freezeStart, freezeStatusKey, lockedByRoleKey, reviewCycle
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useReviewFreezeList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["reviewFreeze-list", options],
    queryFn: () => ReviewFreezeService.getAll(options),
  });
}

/**
 * Retrieve a single ReviewFreeze record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useReviewFreeze(id: string) {
  return useQuery({
    queryKey: ["reviewFreeze", id],
    queryFn: () => ReviewFreezeService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ReviewFreeze record.
 * @remarks Form validation: use CreateReviewFreezeSchema with zodResolver for type-safe create forms
 */
export function useCreateReviewFreeze() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ReviewFreeze, "id">) => ReviewFreezeService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["reviewFreeze-list"] });
    },
  });
}

/**
 * Update an existing ReviewFreeze record.
 * @remarks Form validation: use UpdateReviewFreezeSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateReviewFreeze() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ReviewFreeze, "id">>;
    }) => ReviewFreezeService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["reviewFreeze-list"] });
      client.invalidateQueries({ queryKey: ["reviewFreeze", variables.id] });
    },
  });
}

/**
 * Delete a ReviewFreeze record by its unique identifier.
 */
export function useDeleteReviewFreeze() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ReviewFreezeService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["reviewFreeze-list"] });
      client.invalidateQueries({ queryKey: ["reviewFreeze", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ReviewFreeze_DATA_SOURCE_TYPE = 'InMemory' as const;

export { ReviewFreezeSchema, CreateReviewFreezeSchema, UpdateReviewFreezeSchema } from "../validators/review-freeze-validator";
export type { ReviewFreezeInput, CreateReviewFreezeInput, UpdateReviewFreezeInput } from "../validators/review-freeze-validator";