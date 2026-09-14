import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectMapService } from "../services/project-map-service";
import type { ProjectMap } from "../models/project-map-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all ProjectMap records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, projectMapName, mappingStatusKey, roadmapYearBandKey, sequence
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useProjectMapList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["projectMap-list", options],
    queryFn: () => ProjectMapService.getAll(options),
  });
}

/**
 * Retrieve a single ProjectMap record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useProjectMap(id: string) {
  return useQuery({
    queryKey: ["projectMap", id],
    queryFn: () => ProjectMapService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new ProjectMap record.
 * @remarks Form validation: use CreateProjectMapSchema with zodResolver for type-safe create forms
 */
export function useCreateProjectMap() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ProjectMap, "id">) => ProjectMapService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["projectMap-list"] });
    },
  });
}

/**
 * Update an existing ProjectMap record.
 * @remarks Form validation: use UpdateProjectMapSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateProjectMap() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<ProjectMap, "id">>;
    }) => ProjectMapService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["projectMap-list"] });
      client.invalidateQueries({ queryKey: ["projectMap", variables.id] });
    },
  });
}

/**
 * Delete a ProjectMap record by its unique identifier.
 */
export function useDeleteProjectMap() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ProjectMapService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["projectMap-list"] });
      client.invalidateQueries({ queryKey: ["projectMap", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const ProjectMap_DATA_SOURCE_TYPE = 'InMemory' as const;

export { ProjectMapSchema, CreateProjectMapSchema, UpdateProjectMapSchema } from "../validators/project-map-validator";
export type { ProjectMapInput, CreateProjectMapInput, UpdateProjectMapInput } from "../validators/project-map-validator";