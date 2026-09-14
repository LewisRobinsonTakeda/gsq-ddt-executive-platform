/**
 * Pre-built M365 MCP clients for mcp_TeamsServer — auto-generated from MCP server source.
 * Import these in your hooks.
 */
import { callM365Mcp, buildNlToolArgs } from './m365-mcp-utils';

// ─── ListTeams (READ) ────────────────────────────────────────────────────────

export interface ListTeamsArgs {
  userId?: string;
}

export interface ListTeamsResponse {
  id?: string;
  displayName?: string;
  description?: string;
  createdDateTime?: string;
  webUrl?: string;
}

export async function listTeams(
  args: ListTeamsArgs,
): Promise<ListTeamsResponse[]> {
  return callM365Mcp<ListTeamsResponse, ListTeamsArgs>(
    'mcp_TeamsServer',
    '',
    'ListTeams',
    args,
  );
}

// ─── ListChats (READ) ────────────────────────────────────────────────────────

export interface ListChatsArgs {
  userUpns?: string[];
  topic?: string;
  top?: number;
  fetchAllPages?: boolean;
}

export interface ListChatsResponse {
  id?: string;
  topic?: string;
  chatType?: string;
  createdDateTime?: string;
  lastUpdatedDateTime?: string;
  members?: Array<{ displayName: string; email: string; id: string }>;
}

export async function listChats(
  args: ListChatsArgs,
): Promise<ListChatsResponse[]> {
  return callM365Mcp<ListChatsResponse, ListChatsArgs>(
    'mcp_TeamsServer',
    '',
    'ListChats',
    args,
  );
}

// ─── ListChannels (READ) ─────────────────────────────────────────────────────

export interface ListChannelsArgs {
  teamId: string;
  select?: string;
  filter?: string;
}

export interface ListChannelsResponse {
  id?: string;
  displayName?: string;
  description?: string;
  membershipType?: string;
  createdDateTime?: string;
  webUrl?: string;
}

export async function listChannels(
  args: ListChannelsArgs,
): Promise<ListChannelsResponse[]> {
  return callM365Mcp<ListChannelsResponse, ListChannelsArgs>(
    'mcp_TeamsServer',
    '',
    'ListChannels',
    args,
  );
}

// ─── ListChatMessages (READ) ─────────────────────────────────────────────────

export interface ListChatMessagesArgs {
  chatId: string;
  top?: number;
  filter?: string;
  orderby?: string;
}

export interface ListChatMessagesResponse {
  id?: string;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
  from?: { displayName: string; id: string };
  body?: { contentType: string; content: string };
}

export async function listChatMessages(
  args: ListChatMessagesArgs,
): Promise<ListChatMessagesResponse[]> {
  return callM365Mcp<ListChatMessagesResponse, ListChatMessagesArgs>(
    'mcp_TeamsServer',
    '',
    'ListChatMessages',
    args,
  );
}

// ─── ListChannelMessages (READ) ──────────────────────────────────────────────

export interface ListChannelMessagesArgs {
  teamId: string;
  channelId: string;
  top?: number;
}

export interface ListChannelMessagesResponse {
  id?: string;
  createdDateTime?: string;
  from?: { displayName: string; userId: string } | null;
  body?: { contentType: string; content: string } | null;
}

export async function listChannelMessages(
  args: ListChannelMessagesArgs,
): Promise<ListChannelMessagesResponse[]> {
  return callM365Mcp<ListChannelMessagesResponse, ListChannelMessagesArgs>(
    'mcp_TeamsServer',
    '',
    'ListChannelMessages',
    args,
  );
}

// ─── GetTeam (READ) ──────────────────────────────────────────────────────────

export interface GetTeamArgs {
  teamId: string;
  select?: string;
  expand?: string;
}

export interface GetTeamResponse {
  id?: string;
  displayName?: string;
  description?: string;
  createdDateTime?: string;
  webUrl?: string;
}

export async function getTeam(args: GetTeamArgs): Promise<GetTeamResponse[]> {
  return callM365Mcp<GetTeamResponse, GetTeamArgs>(
    'mcp_TeamsServer',
    '',
    'GetTeam',
    args,
  );
}

// ─── GetChat (READ) ──────────────────────────────────────────────────────────

export interface GetChatArgs {
  chatId: string;
}

export interface GetChatResponse {
  id?: string;
  topic?: string;
  chatType?: string;
  createdDateTime?: string;
  lastUpdatedDateTime?: string;
}

export async function getChat(args: GetChatArgs): Promise<GetChatResponse[]> {
  return callM365Mcp<GetChatResponse, GetChatArgs>(
    'mcp_TeamsServer',
    '',
    'GetChat',
    args,
  );
}

// ─── GetChannel (READ) ──────────────────────────────────────────────────────

export interface GetChannelArgs {
  teamId: string;
  channelId: string;
  select?: string;
  filter?: string;
}

export interface GetChannelResponse {
  id?: string;
  displayName?: string;
  description?: string;
  membershipType?: string;
  createdDateTime?: string;
  webUrl?: string;
}

export async function getChannel(
  args: GetChannelArgs,
): Promise<GetChannelResponse[]> {
  return callM365Mcp<GetChannelResponse, GetChannelArgs>(
    'mcp_TeamsServer',
    '',
    'GetChannel',
    args,
  );
}

// ─── ListChatMembers (READ) ─────────────────────────────────────────────────

export interface ListChatMembersArgs {
  chatId: string;
}

export interface ListChatMembersResponse {
  id?: string;
  displayName?: string;
  email?: string;
  userId?: string;
  roles?: string[];
}

export async function listChatMembers(
  args: ListChatMembersArgs,
): Promise<ListChatMembersResponse[]> {
  return callM365Mcp<ListChatMembersResponse, ListChatMembersArgs>(
    'mcp_TeamsServer',
    '',
    'ListChatMembers',
    args,
  );
}

// ─── ListChannelMembers (READ) ──────────────────────────────────────────────

export interface ListChannelMembersArgs {
  teamId: string;
  channelId: string;
  top?: number;
}

export interface ListChannelMembersResponse {
  id?: string;
  displayName?: string;
  email?: string;
  userId?: string;
  roles?: string[];
}

export async function listChannelMembers(
  args: ListChannelMembersArgs,
): Promise<ListChannelMembersResponse[]> {
  return callM365Mcp<ListChannelMembersResponse, ListChannelMembersArgs>(
    'mcp_TeamsServer',
    '',
    'ListChannelMembers',
    args,
  );
}

// ─── GetChatMessage (READ) ──────────────────────────────────────────────────

export interface GetChatMessageArgs {
  chatId: string;
  messageId: string;
}

export interface GetChatMessageResponse {
  id?: string;
  createdDateTime?: string;
  lastModifiedDateTime?: string;
  from?: { displayName: string; id: string };
  body?: { contentType: string; content: string };
}

export async function getChatMessage(
  args: GetChatMessageArgs,
): Promise<GetChatMessageResponse[]> {
  return callM365Mcp<GetChatMessageResponse, GetChatMessageArgs>(
    'mcp_TeamsServer',
    '',
    'GetChatMessage',
    args,
  );
}

// ─── ListChannelMessageReplies (READ) ────────────────────────────────────────

export interface ListChannelMessageRepliesArgs {
  teamId: string;
  channelId: string;
  messageId: string;
  maxReplies?: number;
}

export interface ListChannelMessageRepliesResponse {
  id?: string;
  createdDateTime?: string;
  from?: { displayName: string; userId: string } | null;
  body?: { contentType: string; content: string } | null;
}

export async function listChannelMessageReplies(
  args: ListChannelMessageRepliesArgs,
): Promise<ListChannelMessageRepliesResponse[]> {
  return callM365Mcp<
    ListChannelMessageRepliesResponse,
    ListChannelMessageRepliesArgs
  >('mcp_TeamsServer', '', 'ListChannelMessageReplies', args);
}

// ─── SearchTeamsMessages (READ — Copilot-backed) ─────────────────────────────

export interface SearchTeamsMessagesArgs {
  message: string;
  responseSchema: Record<string, 'string' | 'number' | 'boolean'>;
  conversationId?: string;
}

/**
 * Copilot-backed search — pass responseSchema to define the response fields.
 */
export async function searchTeamsMessages<
  T = Record<string, string | number | boolean>,
>(args: SearchTeamsMessagesArgs): Promise<T[]> {
  const resolvedArgs = buildNlToolArgs(args);
  return callM365Mcp<T, typeof resolvedArgs>(
    'mcp_TeamsServer',
    '',
    'SearchTeamsMessages',
    resolvedArgs,
  );
}

// ─── SearchTeamMessagesQueryParameters (READ) ────────────────────────────────

export interface SearchTeamMessagesQueryParametersArgs {
  queryString: string;
  from?: number;
  size?: number;
}

export interface SearchTeamMessagesQueryParametersResponse {
  id?: string;
  createdDateTime?: string;
  from?: { displayName: string; id: string };
  body?: { contentType: string; content: string };
  chatId?: string;
  channelIdentity?: { teamId: string; channelId: string };
  webLink?: string;
}

export async function searchTeamMessagesQueryParameters(
  args: SearchTeamMessagesQueryParametersArgs,
): Promise<SearchTeamMessagesQueryParametersResponse[]> {
  return callM365Mcp<
    SearchTeamMessagesQueryParametersResponse,
    SearchTeamMessagesQueryParametersArgs
  >('mcp_TeamsServer', '', 'SearchTeamMessagesQueryParameters', args);
}

// ─── PostMessage (WRITE) ─────────────────────────────────────────────────────

export interface PostMessageArgs {
  chatId: string;
  content: string;
  contentType?: string;
  mentions?: string;
  importance?: string;
  adaptiveCardJson?: string;
}

export async function postMessage(args: PostMessageArgs): Promise<unknown[]> {
  return callM365Mcp<unknown, PostMessageArgs>(
    'mcp_TeamsServer',
    '',
    'PostMessage',
    args,
  );
}

// ─── SendMessageToSelf (WRITE) ──────────────────────────────────────────────

export interface SendMessageToSelfArgs {
  content: string;
  contentType?: string;
  mentions?: string;
  importance?: string;
  adaptiveCardJson?: string;
}

export async function sendMessageToSelf(
  args: SendMessageToSelfArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, SendMessageToSelfArgs>(
    'mcp_TeamsServer',
    '',
    'SendMessageToSelf',
    args,
  );
}

// ─── PostChannelMessage (WRITE) ──────────────────────────────────────────────

export interface PostChannelMessageArgs {
  teamId: string;
  channelId: string;
  content: string;
  contentType?: string;
  subject?: string;
  mentions?: string;
  importance?: string;
  adaptiveCardJson?: string;
}

export async function postChannelMessage(
  args: PostChannelMessageArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, PostChannelMessageArgs>(
    'mcp_TeamsServer',
    '',
    'PostChannelMessage',
    args,
  );
}

// ─── CreateChat (WRITE) ─────────────────────────────────────────────────────

export interface CreateChatArgs {
  chatType: string;
  members_upns: string[];
  topic?: string;
}

export async function createChat(args: CreateChatArgs): Promise<unknown[]> {
  return callM365Mcp<unknown, CreateChatArgs>(
    'mcp_TeamsServer',
    '',
    'CreateChat',
    args,
  );
}

// ─── DeleteChat (WRITE) ─────────────────────────────────────────────────────

export interface DeleteChatArgs {
  chatId: string;
}

export async function deleteChat(args: DeleteChatArgs): Promise<unknown[]> {
  return callM365Mcp<unknown, DeleteChatArgs>(
    'mcp_TeamsServer',
    '',
    'DeleteChat',
    args,
  );
}

// ─── UpdateChat (WRITE) ─────────────────────────────────────────────────────

export interface UpdateChatArgs {
  chatId: string;
  topic: string;
}

export async function updateChat(args: UpdateChatArgs): Promise<unknown[]> {
  return callM365Mcp<unknown, UpdateChatArgs>(
    'mcp_TeamsServer',
    '',
    'UpdateChat',
    args,
  );
}

// ─── CreateChannel (WRITE) ──────────────────────────────────────────────────

export interface CreateChannelArgs {
  teamId: string;
  displayName: string;
  description?: string;
}

export async function createChannel(
  args: CreateChannelArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, CreateChannelArgs>(
    'mcp_TeamsServer',
    '',
    'CreateChannel',
    args,
  );
}

// ─── CreatePrivateChannel (WRITE) ───────────────────────────────────────────

export interface CreatePrivateChannelArgs {
  teamId: string;
  displayName: string;
  description?: string;
}

export async function createPrivateChannel(
  args: CreatePrivateChannelArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, CreatePrivateChannelArgs>(
    'mcp_TeamsServer',
    '',
    'CreatePrivateChannel',
    args,
  );
}

// ─── UpdateChannel (WRITE) ──────────────────────────────────────────────────

export interface UpdateChannelArgs {
  teamId: string;
  channelId: string;
  displayName?: string;
  description?: string;
}

export async function updateChannel(
  args: UpdateChannelArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, UpdateChannelArgs>(
    'mcp_TeamsServer',
    '',
    'UpdateChannel',
    args,
  );
}

// ─── AddChatMember (WRITE) ──────────────────────────────────────────────────

export interface AddChatMemberArgs {
  chatId: string;
  roles: string[];
  userodata_bind: string;
}

export async function addChatMember(
  args: AddChatMemberArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, AddChatMemberArgs>(
    'mcp_TeamsServer',
    '',
    'AddChatMember',
    args,
  );
}

// ─── AddChannelMember (WRITE) ───────────────────────────────────────────────

export interface AddChannelMemberArgs {
  teamId: string;
  channelId: string;
  userId: string;
}

export async function addChannelMember(
  args: AddChannelMemberArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, AddChannelMemberArgs>(
    'mcp_TeamsServer',
    '',
    'AddChannelMember',
    args,
  );
}

// ─── UpdateChatMessage (WRITE) ──────────────────────────────────────────────

export interface UpdateChatMessageArgs {
  chatId: string;
  messageId: string;
  content: string;
  contentType?: string;
}

export async function updateChatMessage(
  args: UpdateChatMessageArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, UpdateChatMessageArgs>(
    'mcp_TeamsServer',
    '',
    'UpdateChatMessage',
    args,
  );
}

// ─── DeleteChatMessage (WRITE) ──────────────────────────────────────────────

export interface DeleteChatMessageArgs {
  chatId: string;
  messageId: string;
}

export async function deleteChatMessage(
  args: DeleteChatMessageArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, DeleteChatMessageArgs>(
    'mcp_TeamsServer',
    '',
    'DeleteChatMessage',
    args,
  );
}

// ─── ReplyToChannelMessage (WRITE) ──────────────────────────────────────────

export interface ReplyToChannelMessageArgs {
  teamId: string;
  channelId: string;
  messageId: string;
  content: string;
  contentType?: string;
  mentions?: string;
  importance?: string;
  adaptiveCardJson?: string;
}

export async function replyToChannelMessage(
  args: ReplyToChannelMessageArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, ReplyToChannelMessageArgs>(
    'mcp_TeamsServer',
    '',
    'ReplyToChannelMessage',
    args,
  );
}

// ─── UpdateChannelMember (WRITE) ─────────────────────────────────────────────

export interface UpdateChannelMemberArgs {
  teamId: string;
  channelId: string;
  membershipId: string;
  role: string;
}

export async function updateChannelMember(
  args: UpdateChannelMemberArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, UpdateChannelMemberArgs>(
    'mcp_TeamsServer',
    '',
    'UpdateChannelMember',
    args,
  );
}
