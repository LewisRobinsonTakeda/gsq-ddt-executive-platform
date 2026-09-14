import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProjectsService } from "../services/projects-service";
import type { Projects } from "../models/projects-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all Projects records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, businessValue, dependencies, description, finishDate, initiativeKey, initiativeName, jiraKey, jiraUrlText, ownerName, platform, programmeOrLocal, progressPct, siteCode, spotId, spotUrlText, startDate, statusCanonical
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useProjectsList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["projects-list", options],
    queryFn: () => ProjectsService.getAll(options),
  });
}

/**
 * Retrieve a single Projects record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useProjects(id: string) {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => ProjectsService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new Projects record.
 * @remarks Form validation: use CreateProjectsSchema with zodResolver for type-safe create forms
 */
export function useCreateProjects() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Projects, "id">) => ProjectsService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["projects-list"] });
    },
  });
}

/**
 * Update an existing Projects record.
 * @remarks Form validation: use UpdateProjectsSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateProjects() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<Projects, "id">>;
    }) => ProjectsService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["projects-list"] });
      client.invalidateQueries({ queryKey: ["projects", variables.id] });
    },
  });
}

/**
 * Delete a Projects record by its unique identifier.
 */
export function useDeleteProjects() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ProjectsService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["projects-list"] });
      client.invalidateQueries({ queryKey: ["projects", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const Projects_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { ProjectsSchema, CreateProjectsSchema, UpdateProjectsSchema } from "../validators/projects-validator";
export type { ProjectsInput, CreateProjectsInput, UpdateProjectsInput } from "../validators/projects-validator";