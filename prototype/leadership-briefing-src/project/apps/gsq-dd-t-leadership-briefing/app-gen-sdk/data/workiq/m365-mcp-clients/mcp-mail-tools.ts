/**
 * Pre-built M365 MCP clients for mcp_MailTools — auto-generated from MCP server source.
 * Import these in your hooks.
 */
import { callM365Mcp, buildNlToolArgs } from './m365-mcp-utils';

// ─── Shared types ────────────────────────────────────────────────────────────

export interface DirectAttachment {
  fileName: string;
  contentBase64: string;
  contentType: string;
}

// ─── GetMessage (READ) ───────────────────────────────────────────────────────

export interface GetMessageArgs {
  id: string;
  preferHtml?: boolean;
  bodyPreviewOnly?: boolean;
}

export interface GetMessageResponse {
  id?: string;
  internetMessageId?: string;
  subject?: string;
  from?: string;
  toRecipients?: string[];
  ccRecipients?: string[];
  bodyPreview?: string;
  body?: string | null;
  receivedDateTime?: string;
  hasAttachments?: boolean;
  importance?: string;
  isRead?: boolean;
  conversationId?: string;
  conversationIndex?: string;
  sensitivityLabel?: string;
}

export async function getMessage(
  args: GetMessageArgs,
): Promise<GetMessageResponse[]> {
  return callM365Mcp<GetMessageResponse, GetMessageArgs>(
    'mcp_MailTools',
    '',
    'GetMessage',
    args,
  );
}

// ─── SearchMessagesQueryParameters (READ) ────────────────────────────────────

export interface SearchMessagesQueryParametersArgs {
  queryParameters: string;
}

export interface SearchMessagesQueryParametersResponse {
  id?: string;
  subject?: string;
  bodyPreview?: string;
  from?: { emailAddress: { name: string; address: string } };
  toRecipients?: Array<{ emailAddress: { name: string; address: string } }>;
  receivedDateTime?: string;
  isRead?: boolean;
  isDraft?: boolean;
  importance?: string;
  hasAttachments?: boolean;
}

export async function searchMessagesQueryParameters(
  args: SearchMessagesQueryParametersArgs,
): Promise<SearchMessagesQueryParametersResponse[]> {
  return callM365Mcp<
    SearchMessagesQueryParametersResponse,
    SearchMessagesQueryParametersArgs
  >('mcp_MailTools', '', 'SearchMessagesQueryParameters', args);
}

// ─── SearchMessages (READ — Copilot-backed) ─────────────────────────────────

export interface SearchMessagesArgs {
  message: string;
  responseSchema: Record<string, 'string' | 'number' | 'boolean'>;
  conversationId?: string;
}

/**
 * Copilot-backed search — pass responseSchema to define the response fields.
 */
export async function searchMessages<
  T = Record<string, string | number | boolean>,
>(args: SearchMessagesArgs): Promise<T[]> {
  const resolvedArgs = buildNlToolArgs(args);
  return callM365Mcp<T, typeof resolvedArgs>(
    'mcp_MailTools',
    '',
    'SearchMessages',
    resolvedArgs,
  );
}

// ─── GetAttachments (READ) ───────────────────────────────────────────────────

export interface GetAttachmentsArgs {
  messageId: string;
}

export interface GetAttachmentsResponse {
  id?: string;
  name?: string;
  contentType?: string;
  size?: number;
  isInline?: boolean;
  type?: string;
}

export async function getAttachments(
  args: GetAttachmentsArgs,
): Promise<GetAttachmentsResponse[]> {
  return callM365Mcp<GetAttachmentsResponse, GetAttachmentsArgs>(
    'mcp_MailTools',
    '',
    'GetAttachments',
    args,
  );
}

// ─── DownloadAttachment (READ) ───────────────────────────────────────────────

export interface DownloadAttachmentArgs {
  messageId: string;
  attachmentId: string;
}

export interface DownloadAttachmentResponse {
  id?: string;
  name?: string;
  contentType?: string;
  size?: number;
  contentBytes?: string;
}

export async function downloadAttachment(
  args: DownloadAttachmentArgs,
): Promise<DownloadAttachmentResponse[]> {
  return callM365Mcp<DownloadAttachmentResponse, DownloadAttachmentArgs>(
    'mcp_MailTools',
    '',
    'DownloadAttachment',
    args,
  );
}

// ─── CreateDraftMessage (WRITE) ──────────────────────────────────────────────

export interface CreateDraftMessageArgs {
  subject?: string;
  body?: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  contentType?: string;
}

export async function createDraftMessage(
  args: CreateDraftMessageArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, CreateDraftMessageArgs>(
    'mcp_MailTools',
    '',
    'CreateDraftMessage',
    args,
  );
}

// ─── UpdateDraft (WRITE) ─────────────────────────────────────────────────────

export interface UpdateDraftArgs {
  messageId: string;
  to?: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  body?: string;
  attachmentUris?: string[];
  directAttachments?: DirectAttachment[];
}

export async function updateDraft(args: UpdateDraftArgs): Promise<unknown[]> {
  return callM365Mcp<unknown, UpdateDraftArgs>(
    'mcp_MailTools',
    '',
    'UpdateDraft',
    args,
  );
}

// ─── SendEmailWithAttachments (WRITE) ────────────────────────────────────────

export interface SendEmailWithAttachmentsArgs {
  to?: string[];
  cc?: string[];
  bcc?: string[];
  subject?: string;
  body?: string;
  contentType?: string;
  attachmentUris?: string[];
  directAttachments?: DirectAttachment[];
}

export async function sendEmailWithAttachments(
  args: SendEmailWithAttachmentsArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, SendEmailWithAttachmentsArgs>(
    'mcp_MailTools',
    '',
    'SendEmailWithAttachments',
    args,
  );
}

// ─── AddDraftAttachments (WRITE) ─────────────────────────────────────────────

export interface AddDraftAttachmentsArgs {
  messageId: string;
  attachmentUris: string[];
}

export async function addDraftAttachments(
  args: AddDraftAttachmentsArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, AddDraftAttachmentsArgs>(
    'mcp_MailTools',
    '',
    'AddDraftAttachments',
    args,
  );
}

// ─── UpdateMessage (WRITE) ───────────────────────────────────────────────────

export interface UpdateMessageArgs {
  id: string;
  subject?: string;
  body?: string;
  contentType?: string;
  categories?: string[];
  importance?: string;
}

export async function updateMessage(
  args: UpdateMessageArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, UpdateMessageArgs>(
    'mcp_MailTools',
    '',
    'UpdateMessage',
    args,
  );
}

// ─── FlagEmail (WRITE) ──────────────────────────────────────────────────────

export interface FlagEmailArgs {
  messageId: string;
  flagStatus: string;
  mailboxAddress?: string;
}

export async function flagEmail(args: FlagEmailArgs): Promise<unknown[]> {
  return callM365Mcp<unknown, FlagEmailArgs>(
    'mcp_MailTools',
    '',
    'FlagEmail',
    args,
  );
}

// ─── DeleteMessage (WRITE) ───────────────────────────────────────────────────

export interface DeleteMessageArgs {
  id: string;
}

export async function deleteMessage(
  args: DeleteMessageArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, DeleteMessageArgs>(
    'mcp_MailTools',
    '',
    'DeleteMessage',
    args,
  );
}

// ─── ReplyToMessage (WRITE) ──────────────────────────────────────────────────

export interface ReplyToMessageArgs {
  id: string;
  comment?: string;
  preferHtml?: boolean;
  toRecipients?: string[];
  ccRecipients?: string[];
  bccRecipients?: string[];
  sendImmediately?: boolean;
}

export async function replyToMessage(
  args: ReplyToMessageArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, ReplyToMessageArgs>(
    'mcp_MailTools',
    '',
    'ReplyToMessage',
    args,
  );
}

// ─── ReplyAllToMessage (WRITE) ───────────────────────────────────────────────

export interface ReplyAllToMessageArgs {
  id: string;
  comment?: string;
  preferHtml?: boolean;
  toRecipients?: string[];
  ccRecipients?: string[];
  bccRecipients?: string[];
  sendImmediately?: boolean;
}

export async function replyAllToMessage(
  args: ReplyAllToMessageArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, ReplyAllToMessageArgs>(
    'mcp_MailTools',
    '',
    'ReplyAllToMessage',
    args,
  );
}

// ─── SendDraftMessage (WRITE) ────────────────────────────────────────────────

export interface SendDraftMessageArgs {
  id: string;
}

export async function sendDraftMessage(
  args: SendDraftMessageArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, SendDraftMessageArgs>(
    'mcp_MailTools',
    '',
    'SendDraftMessage',
    args,
  );
}

// ─── UploadAttachment (WRITE) ────────────────────────────────────────────────

export interface UploadAttachmentArgs {
  messageId: string;
  fileName: string;
  contentBase64: string;
  contentType?: string;
}

export async function uploadAttachment(
  args: UploadAttachmentArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, UploadAttachmentArgs>(
    'mcp_MailTools',
    '',
    'UploadAttachment',
    args,
  );
}

// ─── UploadLargeAttachment (WRITE) ──────────────────────────────────────────

export interface UploadLargeAttachmentArgs {
  messageId: string;
  fileName: string;
  contentBase64: string;
  contentType?: string;
}

export async function uploadLargeAttachment(
  args: UploadLargeAttachmentArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, UploadLargeAttachmentArgs>(
    'mcp_MailTools',
    '',
    'UploadLargeAttachment',
    args,
  );
}

// ─── DeleteAttachment (WRITE) ────────────────────────────────────────────────

export interface DeleteAttachmentArgs {
  messageId: string;
  attachmentId: string;
}

export async function deleteAttachment(
  args: DeleteAttachmentArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, DeleteAttachmentArgs>(
    'mcp_MailTools',
    '',
    'DeleteAttachment',
    args,
  );
}

// ─── ReplyWithFullThread (WRITE) ─────────────────────────────────────────────

export interface ReplyWithFullThreadArgs {
  messageId: string;
  introComment?: string;
  preferHtml?: boolean;
  additionalTo?: string[];
  additionalCc?: string[];
  additionalBcc?: string[];
  replyAll?: boolean;
  includeOriginalNonInlineAttachments?: boolean;
  sendImmediately?: boolean;
}

export async function replyWithFullThread(
  args: ReplyWithFullThreadArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, ReplyWithFullThreadArgs>(
    'mcp_MailTools',
    '',
    'ReplyWithFullThread',
    args,
  );
}

// ─── ReplyAllWithFullThread (WRITE) ──────────────────────────────────────────

export interface ReplyAllWithFullThreadArgs {
  messageId: string;
  introComment?: string;
  preferHtml?: boolean;
  additionalTo?: string[];
  additionalCc?: string[];
  additionalBcc?: string[];
  includeOriginalNonInlineAttachments?: boolean;
  sendImmediately?: boolean;
}

export async function replyAllWithFullThread(
  args: ReplyAllWithFullThreadArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, ReplyAllWithFullThreadArgs>(
    'mcp_MailTools',
    '',
    'ReplyAllWithFullThread',
    args,
  );
}

// ─── ForwardMessageWithFullThread (WRITE) ────────────────────────────────────

export interface ForwardMessageWithFullThreadArgs {
  messageId: string;
  introComment?: string;
  preferHtml?: boolean;
  additionalTo: string[];
  additionalCc?: string[];
  additionalBcc?: string[];
  includeOriginalNonInlineAttachments?: boolean;
}

export async function forwardMessageWithFullThread(
  args: ForwardMessageWithFullThreadArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, ForwardMessageWithFullThreadArgs>(
    'mcp_MailTools',
    '',
    'ForwardMessageWithFullThread',
    args,
  );
}

// ─── ForwardMessage (WRITE) ──────────────────────────────────────────────────

export interface ForwardMessageArgs {
  messageId: string;
  introComment?: string;
  preferHtml?: boolean;
  additionalTo: string[];
  additionalCc?: string[];
  additionalBcc?: string[];
  attachmentUris?: string[];
  directAttachments?: DirectAttachment[];
}

export async function forwardMessage(
  args: ForwardMessageArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, ForwardMessageArgs>(
    'mcp_MailTools',
    '',
    'ForwardMessage',
    args,
  );
}
