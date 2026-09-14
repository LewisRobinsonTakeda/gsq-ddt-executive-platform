import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RoadmapMilestoneService } from "../services/roadmap-milestone-service";
import type { RoadmapMilestone } from "../models/roadmap-milestone-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all RoadmapMilestone records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, roadmapMilestoneName, completedDate, milestoneNote, milestoneTypeKey, plannedDate, statusKey
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useRoadmapMilestoneList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["roadmapMilestone-list", options],
    queryFn: () => RoadmapMilestoneService.getAll(options),
  });
}

/**
 * Retrieve a single RoadmapMilestone record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useRoadmapMilestone(id: string) {
  return useQuery({
    queryKey: ["roadmapMilestone", id],
    queryFn: () => RoadmapMilestoneService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new RoadmapMilestone record.
 * @remarks Form validation: use CreateRoadmapMilestoneSchema with zodResolver for type-safe create forms
 */
export function useCreateRoadmapMilestone() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<RoadmapMilestone, "id">) => RoadmapMilestoneService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["roadmapMilestone-list"] });
    },
  });
}

/**
 * Update an existing RoadmapMilestone record.
 * @remarks Form validation: use UpdateRoadmapMilestoneSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateRoadmapMilestone() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<RoadmapMilestone, "id">>;
    }) => RoadmapMilestoneService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["roadmapMilestone-list"] });
      client.invalidateQueries({ queryKey: ["roadmapMilestone", variables.id] });
    },
  });
}

/**
 * Delete a RoadmapMilestone record by its unique identifier.
 */
export function useDeleteRoadmapMilestone() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => RoadmapMilestoneService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["roadmapMilestone-list"] });
      client.invalidateQueries({ queryKey: ["roadmapMilestone", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const RoadmapMilestone_DATA_SOURCE_TYPE = 'InMemory' as const;

export { RoadmapMilestoneSchema, CreateRoadmapMilestoneSchema, UpdateRoadmapMilestoneSchema } from "../validators/roadmap-milestone-validator";
export type { RoadmapMilestoneInput, CreateRoadmapMilestoneInput, UpdateRoadmapMilestoneInput } from "../validators/roadmap-milestone-validator";