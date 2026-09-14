import { getInMemoryDataSourceOperations } from '../in-memory/in-memory-data-source-operations';
import { AppGenLocalDataClient } from './local-data-client';

export const localDataSourceOperations = getInMemoryDataSourceOperations(
  new AppGenLocalDataClient(),
);
