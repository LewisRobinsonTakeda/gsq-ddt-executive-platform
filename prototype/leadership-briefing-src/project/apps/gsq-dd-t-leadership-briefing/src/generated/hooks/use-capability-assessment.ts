import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CapabilityAssessmentService } from "../services/capability-assessment-service";
import type { CapabilityAssessment } from "../models/capability-assessment-model";
import type { IOperationOptions } from '../../../app-gen-sdk/data/common/types';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Retrieve all CapabilityAssessment records with optional filtering and sorting.
 * @param options Optional filtering and sorting options
 *   Available properties for sorting: id, capabilityAssessmentName, assessmentDate, assessmentNote, capabilityDimensionKey, maturityLevelKey, score
 *   Filtering supports OData syntax, e.g., "status eq 'active'"
 */
export function useCapabilityAssessmentList(options?: IOperationOptions) {
  return useQuery({
    queryKey: ["capabilityAssessment-list", options],
    queryFn: () => CapabilityAssessmentService.getAll(options),
  });
}

/**
 * Retrieve a single CapabilityAssessment record by its unique identifier.
 * @param id The id of the record (must be a valid UUID)
 */
export function useCapabilityAssessment(id: string) {
  return useQuery({
    queryKey: ["capabilityAssessment", id],
    queryFn: () => CapabilityAssessmentService.get(id),
    enabled: !!id && UUID_REGEX.test(id),
  });
}

/**
 * Create a new CapabilityAssessment record.
 * @remarks Form validation: use CreateCapabilityAssessmentSchema with zodResolver for type-safe create forms
 */
export function useCreateCapabilityAssessment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<CapabilityAssessment, "id">) => CapabilityAssessmentService.create(data),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["capabilityAssessment-list"] });
    },
  });
}

/**
 * Update an existing CapabilityAssessment record.
 * @remarks Form validation: use UpdateCapabilityAssessmentSchema.partial().omit({ id: true }) with zodResolver for edit forms (matches changedFields input)
 */
export function useUpdateCapabilityAssessment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      changedFields,
    }: {
      id: string;
      changedFields: Partial<Omit<CapabilityAssessment, "id">>;
    }) => CapabilityAssessmentService.update(id, changedFields),
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["capabilityAssessment-list"] });
      client.invalidateQueries({ queryKey: ["capabilityAssessment", variables.id] });
    },
  });
}

/**
 * Delete a CapabilityAssessment record by its unique identifier.
 */
export function useDeleteCapabilityAssessment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => CapabilityAssessmentService.delete(id),
    onSuccess: (_data, id) => {
      client.invalidateQueries({ queryKey: ["capabilityAssessment-list"] });
      client.invalidateQueries({ queryKey: ["capabilityAssessment", id] });
    },
  });
}

/** Data source type for this table — drives InMemoryDataBanner visibility. */
export const CapabilityAssessment_DATA_SOURCE_TYPE = 'InMemory' as const;

export { CapabilityAssessmentSchema, CreateCapabilityAssessmentSchema, UpdateCapabilityAssessmentSchema } from "../validators/capability-assessment-validator";
export type { CapabilityAssessmentInput, CreateCapabilityAssessmentInput, UpdateCapabilityAssessmentInput } from "../validators/capability-assessment-validator";