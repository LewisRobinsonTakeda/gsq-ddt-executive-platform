import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OnePagerService } from "../services/one-pager-service";
import type { OnePager } from "../models/one-pager-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all OnePager records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, description, bigRockKey, fiscalYearKey, jira, northStarKey, sequence, siteKey, sPOT, statusKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useOnePagerList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["onePager-list", options],
    queryFn: () => OnePagerService.getAll(options),
  });
}

/**
 * Retrieve a single OnePager record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useOnePager(id: string) {
  return useQuery({
    queryKey: ["onePager", id],
    queryFn: () => OnePagerService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new OnePager record.
 * @remarks Form validation: use CreateOnePagerSchema with zodResolver for type-safe create forms
 */
export function useCreateOnePager() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<OnePager, "id">) => OnePagerService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["onePager-list"] });
    },
  });
}

/**
 * Update an existing OnePager record.
 * @remarks Form validation: use UpdateOnePagerSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateOnePager() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<OnePager, "id">>;
    }) => OnePagerService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["onePager-list"] });
      client.invalidateQueries({ queryKey: ["onePager", variables.id] });
    },
  });
}

/**
 * Delete a OnePager record by its unique identifier.
 */
export function useDeleteOnePager() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => OnePagerService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["onePager-list"] });
      client.invalidateQueries({ queryKey: ["onePager", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const OnePager_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { OnePagerSchema, CreateOnePagerSchema, UpdateOnePagerSchema } from "../validators/one-pager-validator";
export type { OnePagerInput, CreateOnePagerInput, UpdateOnePagerInput } from "../validators/one-pager-validator";