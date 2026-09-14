/**
 * Internal MCP call wrapper and response parser — not for direct use in hooks.
 * Import typed functions from the server-specific client files instead.
 */

import { initialize } from '@microsoft/power-apps/app';
import { MicrosoftMCPServersService } from '../../../../src/generated/services/MicrosoftMCPServersService';

// ─── Response parser ─────────────────────────────────────────────────────────

/** Error thrown when an MCP tool call fails (e.g., 429 rate limit, auth failure, bad arguments). */
export class McpToolError extends Error {
  readonly isRateLimited: boolean;

  constructor(message: string) {
    super(message);
    this.name = 'McpToolError';
    this.isRateLimited =
      message.includes('429') || message.toLowerCase().includes('rate limit');
  }
}

/** Extracts a JSON array from a markdown fence, or parses the text directly. */
function parseFencedJson<T>(text: string): T[] {
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/m);
  const json = fenceMatch?.[1] ?? text;
  const parsed: unknown = JSON.parse(json.trim());
  return Array.isArray(parsed) ? (parsed as T[]) : [parsed as T];
}

/**
 * Shared layers 1–4: unwrap { success, data } → SSE → JSON-RPC → content[0].text → wrapper.
 * Returns the parsed wrapper object, or null if any layer fails.
 */
function unwrapToWrapper(raw: unknown): Record<string, unknown> | null {
  try {
    // Layer 1: Unwrap { success, data } envelope if present
    let text: string;
    if (typeof raw === 'string') {
      try {
        const envelope = JSON.parse(raw) as Record<string, unknown>;
        text = typeof envelope?.data === 'string' ? envelope.data : raw;
      } catch {
        text = raw;
      }
    } else if (raw !== null && typeof raw === 'object' && 'data' in raw) {
      // The { success, data } envelope may carry `data` as a raw string (SSE/JSON
      // from MailTools/Copilot) or as an already-parsed object (mcp_MeServer and
      // other servers return the JSON-RPC result object directly). Coercing an
      // object with String() yields "[object Object]", which fails the downstream
      // JSON.parse and silently returns []. Serialize objects instead of String().
      const inner = (raw as Record<string, unknown>).data;
      if (typeof inner === 'string') {
        text = inner;
      } else {
        // JSON.stringify(undefined) returns undefined, which would make `text`
        // non-string and throw on text.split(). Bail out intentionally instead
        // of relying on the outer catch to turn it into a silent [].
        const serialized = JSON.stringify(inner);
        if (serialized === undefined) {
          return null;
        }
        text = serialized;
      }
    } else if (raw !== null && typeof raw === 'object') {
      text = JSON.stringify(raw);
    } else {
      return null;
    }

    // Layer 2: Strip SSE envelope — get the line starting with "data: "
    const dataLine = text.split('\n').find((l) => l.startsWith('data:'));
    const jsonRpcStr = dataLine ? dataLine.slice(6) : text;

    // Layer 3: Parse JSON-RPC envelope
    const rpc = JSON.parse(jsonRpcStr) as Record<string, unknown>;
    const result = rpc?.result as Record<string, unknown> | undefined;

    // Check for MCP tool-level errors (e.g., 429 rate limits)
    if (result?.isError === true) {
      const content = result.content;
      const errorText = Array.isArray(content)
        ? (content as Array<{ type: string; text?: string }>)
            .filter((c) => c.type === 'text')
            .map((c) => c.text ?? '')
            .join(' ')
        : 'Unknown MCP tool error';
      throw new McpToolError(errorText);
    }

    const content = result?.content;
    if (!Array.isArray(content)) return null;
    const textEntry = (content as Array<{ type: string; text?: string }>).find(
      (c) => c.type === 'text',
    );
    if (!textEntry?.text) return null;

    // Layer 4: Parse wrapper.
    const rawText = textEntry.text;
    try {
      return JSON.parse(rawText) as Record<string, unknown>;
    } catch {
      const jsonStart = rawText.search(/[{[]/);
      if (jsonStart === -1) return null;
      return JSON.parse(rawText.slice(jsonStart)) as Record<string, unknown>;
    }
  } catch {
    return null;
  }
}

/**
 * Parses any MCP response into a flat array of items. Handles all response shapes:
 *
 * - Graph API list: rawResponse → { value: T[] }
 * - LLM conversation: rawResponse → { messages: [...] } → markdown fence JSON
 * - Service envelope: { message: string, data: T | T[] }
 * - Domain-keyed array: { teams: T[] }, { channels: T[] }, etc.
 * - Single-record: plain object → wrapped in one-element array
 */
export function extractItems<T = unknown>(raw: unknown): T[] {
  const wrapper = unwrapToWrapper(raw);
  if (!wrapper) return [];

  // rawResponse field: present for MailTools and mcp_m365copilot responses
  if (typeof wrapper.rawResponse === 'string') {
    try {
      const inner = JSON.parse(wrapper.rawResponse) as Record<string, unknown>;

      if (Array.isArray(inner.value)) {
        return inner.value as T[];
      }

      if (Array.isArray(inner.messages)) {
        const messages = inner.messages as Array<{ text?: string }>;
        if (messages.length < 2) return [];
        const replyText = messages[messages.length - 1]?.text ?? '';
        return parseFencedJson<T>(replyText);
      }

      return [inner as unknown as T];
    } catch {
      return [];
    }
  }

  // Natural-language reply field
  if (typeof wrapper.reply === 'string') {
    try {
      return parseFencedJson<T>(wrapper.reply);
    } catch {
      return [];
    }
  }

  // Service envelope: { message: string, data: T | T[] }
  if (
    typeof wrapper.message === 'string' &&
    wrapper.data != null &&
    typeof wrapper.data === 'object'
  ) {
    if (Array.isArray(wrapper.data)) {
      return wrapper.data as T[];
    }
    const data = wrapper.data as Record<string, unknown>;
    if (Array.isArray(data.value)) {
      return data.value as T[];
    }
    return [data as unknown as T];
  }

  // Domain-keyed array: { teams: T[] }, { channels: T[] }, etc.
  const arrayValue = Object.values(wrapper).find(
    (v) =>
      Array.isArray(v) &&
      v.length > 0 &&
      typeof v[0] === 'object' &&
      v[0] !== null,
  );
  if (arrayValue !== undefined) {
    return arrayValue as T[];
  }

  // Single-record direct response
  if (Object.keys(wrapper).length > 0) {
    return [wrapper as unknown as T];
  }

  return [];
}

// ─── MCP call wrapper ────────────────────────────────────────────────────────

type McpServerMethod = (
  sessionId?: string,
  rpc?: Record<string, unknown>,
) => Promise<unknown>;

export async function callM365Mcp<
  ResponseData = Record<string, unknown>,
  RequestParams = Record<string, unknown>,
>(
  server: keyof typeof MicrosoftMCPServersService & string,
  sessionId: string,
  toolName: string,
  args: RequestParams,
): Promise<ResponseData[]> {
  const method = MicrosoftMCPServersService[
    server as keyof typeof MicrosoftMCPServersService
  ] as McpServerMethod | undefined;
  if (!method) {
    throw new Error(`Unknown MCP server: ${server}`);
  }

  initialize();
  // TODO: The MicrosoftMCPServersService doesn't expose a way to manage the MCP session ID.
  // The happy path flow is that the session ID is returned as a header after the first call to the MCP server,
  // and subsequent calls should reuse that session ID.
  // When a session is expired or doesn't exist, the MCP server responds with 404. The right course of action is to
  // retry the request without a session ID, which will create a new session and return a new session ID in the response header.
  //
  // For now, since we don't have a way to manage the session ID, we'll just make the call with no session ID and let the MCP server generate a new session for each call.
  // This is what the way the generated apps have historically done it. The `sessionId` parameter gives room to the agent to pass in a generated session ID which would cause the call to fail, which is why we are ignoring it for now.

  const result = await method.call(MicrosoftMCPServersService, '', {
    jsonrpc: '2.0',
    id: crypto.randomUUID(),
    method: 'tools/call',
    params: { name: toolName, arguments: args },
  });
  return extractItems<ResponseData>(result);
}

/**
 * Strip responseSchema from args, serialize it, and merge into the message field.
 * Used by NL-backed tool wrappers (copilotChat, searchMessages, searchTeamsMessages).
 */
export function buildNlToolArgs<
  T extends {
    message: string;
    responseSchema: Record<string, 'string' | 'number' | 'boolean'>;
  },
>(args: T): Omit<T, 'responseSchema'> {
  const { responseSchema, ...rest } = args;
  const schemaStr = Object.entries(responseSchema)
    .map(([key, type]) => `${key}:${type}`)
    .join(', ');
  return {
    ...rest,
    message: `${rest.message}. Return data as a flat JSON array with the following properties -> ${schemaStr}`,
  } as Omit<T, 'responseSchema'>;
}
