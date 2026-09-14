import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentaryService } from "../services/commentary-service";
import type { Commentary } from "../models/commentary-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Commentary records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, commentaryTitle, approvalComments, categoryKey, commentary, createdDate, entrySourceKey, publicationStatusKey, reviewedDate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useCommentaryList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["commentary-list", options],
    queryFn: () => CommentaryService.getAll(options),
  });
}

/**
 * Retrieve a single Commentary record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useCommentary(id: string) {
  return useQuery({
    queryKey: ["commentary", id],
    queryFn: () => CommentaryService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Commentary record.
 * @remarks Form validation: use CreateCommentarySchema with zodResolver for type-safe create forms
 */
export function useCreateCommentary() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Commentary, "id">) => CommentaryService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["commentary-list"] });
    },
  });
}

/**
 * Update an existing Commentary record.
 * @remarks Form validation: use UpdateCommentarySchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateCommentary() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Commentary, "id">>;
    }) => CommentaryService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["commentary-list"] });
      client.invalidateQueries({ queryKey: ["commentary", variables.id] });
    },
  });
}

/**
 * Delete a Commentary record by its unique identifier.
 */
export function useDeleteCommentary() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CommentaryService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["commentary-list"] });
      client.invalidateQueries({ queryKey: ["commentary", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Commentary_DATA_SOURCE_TYPE = 'InMemory' as const;

export { CommentarySchema, CreateCommentarySchema, UpdateCommentarySchema } from "../validators/commentary-validator";
export type { CommentaryInput, CreateCommentaryInput, UpdateCommentaryInput } from "../validators/commentary-validator";