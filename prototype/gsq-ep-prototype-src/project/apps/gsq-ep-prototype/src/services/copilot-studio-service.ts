import type { IOperationResult } from '@microsoft/power-apps/data';
import { getClient } from '@microsoft/power-apps/data';
import { dataSourcesInfo } from '../../.power/appschemas/dataSourcesInfo';

const client = getClient(dataSourcesInfo);
const dataSourceName = 'shared_microsoftcopilotstudio';

export interface CopilotStudioResponse {
  lastResponse?: string;
  conversationId?: string;
  ConversationId?: string;
  conversationID?: string;
}

interface ExecuteCopilotParameters {
  copilot: string;
  message: string;
  notificationUrl: string;
  'x-ms-conversation-id'?: string;
}

export async function executeGsqCopilot(
  message: string,
  conversationId?: string,
): Promise<CopilotStudioResponse> {
  const parameters: ExecuteCopilotParameters = {
    copilot: 'new_gsqDdtExecPlatformStd',
    message,
    notificationUrl: 'https://notificationurlplaceholder',
    ...(conversationId ? { 'x-ms-conversation-id': conversationId } : {}),
  };
  const result: IOperationResult<CopilotStudioResponse> = await client.executeAsync<ExecuteCopilotParameters, CopilotStudioResponse>({
    connectorOperation: {
      tableName: dataSourceName,
      operationName: 'ExecuteCopilotAsyncV2',
      parameters,
    },
  });
  if (!result.success || !result.data) {
    throw new Error('Integration needed');
  }
  return result.data;
}
