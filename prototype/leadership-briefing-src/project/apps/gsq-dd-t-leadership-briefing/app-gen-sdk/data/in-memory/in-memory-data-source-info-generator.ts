import type {
  ConvertToDataSourceInfoResult,
  DataSourceInfoGenerator,
} from '../common/data-source-info-generator';
import type { TableToTypescriptMapping } from '../common/table-mapping-types';

class InMemoryDataSourceInfoGenerator implements DataSourceInfoGenerator {
  public convertToDataSourceInfo(
    _tableMapping: TableToTypescriptMapping,
  ): ConvertToDataSourceInfoResult | undefined {
    return undefined;
  }
}

export const inMemoryDataSourceInfoGenerator: InMemoryDataSourceInfoGenerator =
  new InMemoryDataSourceInfoGenerator();
