import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BigRockService } from "../services/big-rock-service";
import type { BigRock } from "../models/big-rock-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all BigRock records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, bigRockName, description, sortOrder
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useBigRockList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["bigRock-list", options],
    queryFn: () => BigRockService.getAll(options),
  });
}

/**
 * Retrieve a single BigRock record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useBigRock(id: string) {
  return useQuery({
    queryKey: ["bigRock", id],
    queryFn: () => BigRockService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new BigRock record.
 * @remarks Form validation: use CreateBigRockSchema with zodResolver for type-safe create forms
 */
export function useCreateBigRock() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<BigRock, "id">) => BigRockService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["bigRock-list"] });
    },
  });
}

/**
 * Update an existing BigRock record.
 * @remarks Form validation: use UpdateBigRockSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateBigRock() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<BigRock, "id">>;
    }) => BigRockService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["bigRock-list"] });
      client.invalidateQueries({ queryKey: ["bigRock", variables.id] });
    },
  });
}

/**
 * Delete a BigRock record by its unique identifier.
 */
export function useDeleteBigRock() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => BigRockService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["bigRock-list"] });
      client.invalidateQueries({ queryKey: ["bigRock", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const BigRock_DATA_SOURCE_TYPE = 'InMemory' as const;

export { BigRockSchema, CreateBigRockSchema, UpdateBigRockSchema } from "../validators/big-rock-validator";
export type { BigRockInput, CreateBigRockInput, UpdateBigRockInput } from "../validators/big-rock-validator";