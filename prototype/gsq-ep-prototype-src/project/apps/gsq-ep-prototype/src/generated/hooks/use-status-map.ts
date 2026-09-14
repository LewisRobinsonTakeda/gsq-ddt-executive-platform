import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StatusMapService } from "../services/status-map-service";
import type { StatusMap } from "../models/status-map-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all StatusMap records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, statusMapName, executiveStatusKey, roadmapYearBandKey, statusSummary, updatedDate
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useStatusMapList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["statusMap-list", options],
    queryFn: () => StatusMapService.getAll(options),
  });
}

/**
 * Retrieve a single StatusMap record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useStatusMap(id: string) {
  return useQuery({
    queryKey: ["statusMap", id],
    queryFn: () => StatusMapService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new StatusMap record.
 * @remarks Form validation: use CreateStatusMapSchema with zodResolver for type-safe create forms
 */
export function useCreateStatusMap() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<StatusMap, "id">) => StatusMapService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["statusMap-list"] });
    },
  });
}

/**
 * Update an existing StatusMap record.
 * @remarks Form validation: use UpdateStatusMapSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateStatusMap() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<StatusMap, "id">>;
    }) => StatusMapService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["statusMap-list"] });
      client.invalidateQueries({ queryKey: ["statusMap", variables.id] });
    },
  });
}

/**
 * Delete a StatusMap record by its unique identifier.
 */
export function useDeleteStatusMap() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => StatusMapService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["statusMap-list"] });
      client.invalidateQueries({ queryKey: ["statusMap", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const StatusMap_DATA_SOURCE_TYPE = 'InMemory' as const;

export { StatusMapSchema, CreateStatusMapSchema, UpdateStatusMapSchema } from "../validators/status-map-validator";
export type { StatusMapInput, CreateStatusMapInput, UpdateStatusMapInput } from "../validators/status-map-validator";