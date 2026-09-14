import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IntegrationsTrackerService } from "../services/integrations-tracker-service";
import type { IntegrationsTracker } from "../models/integrations-tracker-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all IntegrationsTracker records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, title, actualGoLive, adoptPct, adoptStatus, blockerNotes, deployPct, deployStatus, domainPair, integrationId, manualStatus, plant, productGroup, productLine, requiredWork, scopeType, siteCode, spotId, status1Key, statusKey, targetGoLive, transcribePct
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useIntegrationsTrackerList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["integrationsTracker-list", options],
    queryFn: () => IntegrationsTrackerService.getAll(options),
  });
}

/**
 * Retrieve a single IntegrationsTracker record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useIntegrationsTracker(id: string) {
  return useQuery({
    queryKey: ["integrationsTracker", id],
    queryFn: () => IntegrationsTrackerService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new IntegrationsTracker record.
 * @remarks Form validation: use CreateIntegrationsTrackerSchema with zodResolver for type-safe create forms
 */
export function useCreateIntegrationsTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<IntegrationsTracker, "id">) => IntegrationsTrackerService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["integrationsTracker-list"] });
    },
  });
}

/**
 * Update an existing IntegrationsTracker record.
 * @remarks Form validation: use UpdateIntegrationsTrackerSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateIntegrationsTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<IntegrationsTracker, "id">>;
    }) => IntegrationsTrackerService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["integrationsTracker-list"] });
      client.invalidateQueries({ queryKey: ["integrationsTracker", variables.id] });
    },
  });
}

/**
 * Delete a IntegrationsTracker record by its unique identifier.
 */
export function useDeleteIntegrationsTracker() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => IntegrationsTrackerService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["integrationsTracker-list"] });
      client.invalidateQueries({ queryKey: ["integrationsTracker", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const IntegrationsTracker_DATA_SOURCE_TYPE = 'SharePoint' as const;

export { IntegrationsTrackerSchema, CreateIntegrationsTrackerSchema, UpdateIntegrationsTrackerSchema } from "../validators/integrations-tracker-validator";
export type { IntegrationsTrackerInput, CreateIntegrationsTrackerInput, UpdateIntegrationsTrackerInput } from "../validators/integrations-tracker-validator";