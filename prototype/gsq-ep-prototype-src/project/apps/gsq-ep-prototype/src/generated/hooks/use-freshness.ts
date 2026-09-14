import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FreshnessService } from "../services/freshness-service";
import type { Freshness } from "../models/freshness-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Freshness records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, freshnessRecordName, dataDomain, freshnessStatusKey, integrationNeeded, lastRefreshedDate, sourceOwnerRoleKey, sourceSystemKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useFreshnessList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["freshness-list", options],
    queryFn: () => FreshnessService.getAll(options),
  });
}

/**
 * Retrieve a single Freshness record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useFreshness(id: string) {
  return useQuery({
    queryKey: ["freshness", id],
    queryFn: () => FreshnessService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Freshness record.
 * @remarks Form validation: use CreateFreshnessSchema with zodResolver for type-safe create forms
 */
export function useCreateFreshness() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Freshness, "id">) => FreshnessService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["freshness-list"] });
    },
  });
}

/**
 * Update an existing Freshness record.
 * @remarks Form validation: use UpdateFreshnessSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateFreshness() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Freshness, "id">>;
    }) => FreshnessService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["freshness-list"] });
      client.invalidateQueries({ queryKey: ["freshness", variables.id] });
    },
  });
}

/**
 * Delete a Freshness record by its unique identifier.
 */
export function useDeleteFreshness() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => FreshnessService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["freshness-list"] });
      client.invalidateQueries({ queryKey: ["freshness", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Freshness_DATA_SOURCE_TYPE = 'InMemory' as const;

export { FreshnessSchema, CreateFreshnessSchema, UpdateFreshnessSchema } from "../validators/freshness-validator";
export type { FreshnessInput, CreateFreshnessInput, UpdateFreshnessInput } from "../validators/freshness-validator";