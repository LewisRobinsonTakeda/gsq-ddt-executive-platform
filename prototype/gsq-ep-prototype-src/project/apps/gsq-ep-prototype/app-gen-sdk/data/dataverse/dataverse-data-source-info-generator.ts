import type {
  ConvertToDataSourceInfoResult,
  DataSourceInfoGenerator,
} from '../common/data-source-info-generator';
import type { TableToTypescriptMapping } from '../common/table-mapping-types';

class DataverseDataSourceInfoGenerator implements DataSourceInfoGenerator {
  public convertToDataSourceInfo(
    tableMapping: TableToTypescriptMapping,
  ): ConvertToDataSourceInfoResult | undefined {
    return {
      key: tableMapping.dataSourceKey,
      info: {
        tableId: '',
        version: '',
        primaryKey:
          tableMapping.columns.find((x) => x.isPrimaryId)?.apiPropertyName ||
          '',
        dataSourceType: tableMapping.dataSourceType,
        apis: {},
      },
    };
  }
}

export const dataverseDataSourceInfoGenerator =
  new DataverseDataSourceInfoGenerator();
