import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "../services/project-service";
import type { Project } from "../models/project-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Project records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, projectName, createdDate, eDBDomain, eDBIntegrationNeeded, eDBSourceOwnerRoleKey, jiraIntegrationNeeded, jiraKey, jiraSourceOwnerRoleKey, roadmapStatusKey, sPOTID, sPOTIntegrationNeeded, sPOTSourceOwnerRoleKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useProjectList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["project-list", options],
    queryFn: () => ProjectService.getAll(options),
  });
}

/**
 * Retrieve a single Project record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => ProjectService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Project record.
 * @remarks Form validation: use CreateProjectSchema with zodResolver for type-safe create forms
 */
export function useCreateProject() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Project, "id">) => ProjectService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["project-list"] });
    },
  });
}

/**
 * Update an existing Project record.
 * @remarks Form validation: use UpdateProjectSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateProject() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Project, "id">>;
    }) => ProjectService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["project-list"] });
      client.invalidateQueries({ queryKey: ["project", variables.id] });
    },
  });
}

/**
 * Delete a Project record by its unique identifier.
 */
export function useDeleteProject() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ProjectService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["project-list"] });
      client.invalidateQueries({ queryKey: ["project", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Project_DATA_SOURCE_TYPE = 'InMemory' as const;

export { ProjectSchema, CreateProjectSchema, UpdateProjectSchema } from "../validators/project-validator";
export type { ProjectInput, CreateProjectInput, UpdateProjectInput } from "../validators/project-validator";