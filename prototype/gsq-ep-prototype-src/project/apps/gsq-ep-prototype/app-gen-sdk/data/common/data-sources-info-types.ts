export interface ApiResponseInfo {
  type?: string;
  format?: string;
}

export interface ApiParameter {
  name: string;
  in: string;
  required: boolean;
  type: string;
}

export interface ApiDefinition {
  path: string;
  method: string;
  parameters: ApiParameter[];
  responseInfo?: Record<string, ApiResponseInfo>;
}

export interface DataSourceInfo {
  tableId: string;
  version?: string;
  primaryKey?: string;
  dataSourceType?: string;
  apis: Record<string, ApiDefinition>;
}

export type DataSourcesInfo = Record<string, DataSourceInfo>;
