/**
 * Pre-built M365 MCP clients for mcp_M365Copilot — auto-generated from MCP server source.
 * Import these in your hooks.
 */
import { callM365Mcp, buildNlToolArgs } from './m365-mcp-utils';

// ─── copilot_chat ────────────────────────────────────────────────────────────

export interface CopilotChatArgs {
  message: string;
  responseSchema: Record<string, 'string' | 'number' | 'boolean'>;
  conversationId?: string;
  agentId?: string;
  fileUris?: string[];
  enableWebSearch?: boolean;
}

/**
 * Copilot-backed NL query — pass responseSchema to define the response fields.
 */
export async function copilotChat<
  T = Record<string, string | number | boolean>,
>(args: CopilotChatArgs): Promise<T[]> {
  const resolvedArgs = buildNlToolArgs(args);
  return callM365Mcp<T, typeof resolvedArgs>(
    'mcp_m365copilot',
    '',
    'copilot_chat',
    resolvedArgs,
  );
}
