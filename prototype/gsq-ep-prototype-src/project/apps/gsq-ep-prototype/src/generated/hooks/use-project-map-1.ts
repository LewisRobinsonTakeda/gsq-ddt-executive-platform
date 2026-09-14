import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectMap_1Service } from "../services/project-map-1-service";
import type { ProjectMap_1 } from "../models/project-map-1-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ProjectMap_1 records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, fiscalYear, jiraKey, rockId, siteCode
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useProjectMap_1List(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["projectMap_1-list", options],
    queryFn: () => ProjectMap_1Service.getAll(options),
  });
}

/**
 * Retrieve a single ProjectMap_1 record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useProjectMap_1(id: string) {
  return useQuery({
    queryKey: ["projectMap_1", id],
    queryFn: () => ProjectMap_1Service.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ProjectMap_1 record.
 * @remarks Form validation: use CreateProjectMap_1Schema with zodResolver for type-safe create forms
 */
export function useCreateProjectMap_1() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ProjectMap_1, "id">) => ProjectMap_1Service.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["projectMap_1-list"] });
    },
  });
}

/**
 * Update an existing ProjectMap_1 record.
 * @remarks Form validation: use UpdateProjectMap_1Schema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateProjectMap_1() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ProjectMap_1, "id">>;
    }) => ProjectMap_1Service.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["projectMap_1-list"] });
      client.invalidateQueries({ queryKey: ["projectMap_1", variables.id] });
    },
  });
}

/**
 * Delete a ProjectMap_1 record by its unique identifier.
 */
export function useDeleteProjectMap_1() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ProjectMap_1Service.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["projectMap_1-list"] });
      client.invalidateQueries({ queryKey: ["projectMap_1", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ProjectMap_1_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ProjectMap_1Schema, CreateProjectMap_1Schema, UpdateProjectMap_1Schema } from "../validators/project-map-1-validator";
export type { ProjectMap_1Input, CreateProjectMap_1Input, UpdateProjectMap_1Input } from "../validators/project-map-1-validator";