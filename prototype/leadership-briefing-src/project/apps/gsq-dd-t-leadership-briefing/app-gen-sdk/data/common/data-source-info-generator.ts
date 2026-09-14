import { dataverseDataSourceInfoGenerator } from '../dataverse/dataverse-data-source-info-generator';
import { inMemoryDataSourceInfoGenerator } from '../in-memory/in-memory-data-source-info-generator';
import { sharePointDataSourceInfoGenerator } from '../sharepoint/sharepoint-data-source-info-generator';
import { getDataModelConfig } from './data-model-config-accessor';
import type {
  DataSourceInfo,
  DataSourcesInfo,
} from './data-sources-info-types';
import type { TableToTypescriptMapping } from './table-mapping-types';

export interface ConvertToDataSourceInfoResult {
  key: string;
  info: DataSourceInfo;
}

export interface DataSourceInfoGenerator {
  convertToDataSourceInfo(
    tableMapping: TableToTypescriptMapping,
  ): ConvertToDataSourceInfoResult | undefined;
}

export function convertToDataSourceInfo(
  tableMappings: TableToTypescriptMapping[],
): DataSourcesInfo {
  const dataSourcesInfo: DataSourcesInfo = {};

  for (const tableMapping of tableMappings) {
    let converter: (
      tableMapping: TableToTypescriptMapping,
    ) => ConvertToDataSourceInfoResult | undefined;
    if (tableMapping.dataSourceType === 'InMemory') {
      converter = inMemoryDataSourceInfoGenerator.convertToDataSourceInfo.bind(
        inMemoryDataSourceInfoGenerator,
      );
    } else if (tableMapping.dataSourceType === 'Dataverse') {
      converter = dataverseDataSourceInfoGenerator.convertToDataSourceInfo.bind(
        dataverseDataSourceInfoGenerator,
      );
    } else if (tableMapping.dataSourceType === 'SharePoint') {
      converter =
        sharePointDataSourceInfoGenerator.convertToDataSourceInfo.bind(
          sharePointDataSourceInfoGenerator,
        );
    } else {
      throw new Error(
        `Unsupported data source type: ${tableMapping.dataSourceType}`,
      );
    }
    const result = converter(tableMapping);
    if (result) {
      dataSourcesInfo[result.key] = result.info;
    }
  }

  return dataSourcesInfo;
}

export function getDataSourcesInfo(): DataSourcesInfo {
  const dataModelConfig = getDataModelConfig(false);
  return convertToDataSourceInfo(dataModelConfig.tableMappings);
}
