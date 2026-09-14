import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Commentary_1Service } from "../services/commentary-1-service";
import type { Commentary_1 } from "../models/commentary-1-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Commentary_1 records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, authorName, body, period, rockId, sentiment, siteCode
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useCommentary_1List(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["commentary_1-list", options],
    queryFn: () => Commentary_1Service.getAll(options),
  });
}

/**
 * Retrieve a single Commentary_1 record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useCommentary_1(id: string) {
  return useQuery({
    queryKey: ["commentary_1", id],
    queryFn: () => Commentary_1Service.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Commentary_1 record.
 * @remarks Form validation: use CreateCommentary_1Schema with zodResolver for type-safe create forms
 */
export function useCreateCommentary_1() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Commentary_1, "id">) => Commentary_1Service.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["commentary_1-list"] });
    },
  });
}

/**
 * Update an existing Commentary_1 record.
 * @remarks Form validation: use UpdateCommentary_1Schema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateCommentary_1() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Commentary_1, "id">>;
    }) => Commentary_1Service.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["commentary_1-list"] });
      client.invalidateQueries({ queryKey: ["commentary_1", variables.id] });
    },
  });
}

/**
 * Delete a Commentary_1 record by its unique identifier.
 */
export function useDeleteCommentary_1() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => Commentary_1Service.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["commentary_1-list"] });
      client.invalidateQueries({ queryKey: ["commentary_1", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Commentary_1_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { Commentary_1Schema, CreateCommentary_1Schema, UpdateCommentary_1Schema } from "../validators/commentary-1-validator";
export type { Commentary_1Input, CreateCommentary_1Input, UpdateCommentary_1Input } from "../validators/commentary-1-validator";