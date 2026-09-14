import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CapabilityTrackerService } from "../services/capability-tracker-service";
import type { CapabilityTracker } from "../models/capability-tracker-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all CapabilityTracker records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, adoptPct, blockerCategory, blockerDesc, capabilityId, deployPct, functionName, intAdoptPct, intDeployPct, intTranscribePct, missingInts, ownerName, plant, platform, programName, region, reqIntCount, reqIntIds, scopeType, scopeValue, siteCode, spotId, targetQuarter, transcribePct
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useCapabilityTrackerList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["capabilityTracker-list", options],
    queryFn: () => CapabilityTrackerService.getAll(options),
  });
}

/**
 * Retrieve a single CapabilityTracker record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useCapabilityTracker(id: string) {
  return useQuery({
    queryKey: ["capabilityTracker", id],
    queryFn: () => CapabilityTrackerService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new CapabilityTracker record.
 * @remarks Form validation: use CreateCapabilityTrackerSchema with zodResolver for type-safe create forms
 */
export function useCreateCapabilityTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<CapabilityTracker, "id">) => CapabilityTrackerService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["capabilityTracker-list"] });
    },
  });
}

/**
 * Update an existing CapabilityTracker record.
 * @remarks Form validation: use UpdateCapabilityTrackerSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateCapabilityTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<CapabilityTracker, "id">>;
    }) => CapabilityTrackerService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["capabilityTracker-list"] });
      client.invalidateQueries({ queryKey: ["capabilityTracker", variables.id] });
    },
  });
}

/**
 * Delete a CapabilityTracker record by its unique identifier.
 */
export function useDeleteCapabilityTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CapabilityTrackerService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["capabilityTracker-list"] });
      client.invalidateQueries({ queryKey: ["capabilityTracker", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const CapabilityTracker_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { CapabilityTrackerSchema, CreateCapabilityTrackerSchema, UpdateCapabilityTrackerSchema } from "../validators/capability-tracker-validator";
export type { CapabilityTrackerInput, CreateCapabilityTrackerInput, UpdateCapabilityTrackerInput } from "../validators/capability-tracker-validator";