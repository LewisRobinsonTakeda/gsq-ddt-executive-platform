import dataModelConfig from '../../../.internal/data-model-config.json';
import type { DataModelConfig } from './table-mapping-types';

export function getDataModelConfig(
  throwIfUpdateInProgress: boolean = true,
): DataModelConfig {
  const castedDataModelConfig = dataModelConfig as unknown as DataModelConfig;
  if (castedDataModelConfig.updateInProgress && throwIfUpdateInProgress) {
    throw new Error('The data model configuration is currently being updated.');
  }
  return castedDataModelConfig;
}
