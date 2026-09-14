/**
 * Pre-built M365 MCP clients for mcp_MeServer — auto-generated from MCP server source.
 * Import these in your hooks.
 */
import { callM365Mcp } from './m365-mcp-utils';

// ─── GetMyDetails ────────────────────────────────────────────────────────────

export interface GetMyDetailsArgs {
  select?: string;
  expand?: string;
}

export interface GetMyDetailsResponse {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
  id?: string;
  jobTitle?: string;
  officeLocation?: string;
  mobilePhone?: string;
  businessPhones?: string[];
  department?: string;
  companyName?: string;
  city?: string;
  country?: string;
  state?: string;
}

export async function getMyDetails(
  args: GetMyDetailsArgs,
): Promise<GetMyDetailsResponse[]> {
  return callM365Mcp<GetMyDetailsResponse, GetMyDetailsArgs>(
    'mcp_MeServer',
    '',
    'GetMyDetails',
    args,
  );
}

// ─── GetUserDetails ──────────────────────────────────────────────────────────

export interface GetUserDetailsArgs {
  userIdentifier: string;
  select?: string;
  expand?: string;
}

export interface GetUserDetailsResponse {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
  id?: string;
  jobTitle?: string;
  officeLocation?: string;
  mobilePhone?: string;
  businessPhones?: string[];
  department?: string;
  companyName?: string;
  city?: string;
  country?: string;
  state?: string;
}

export async function getUserDetails(
  args: GetUserDetailsArgs,
): Promise<GetUserDetailsResponse[]> {
  return callM365Mcp<GetUserDetailsResponse, GetUserDetailsArgs>(
    'mcp_MeServer',
    '',
    'GetUserDetails',
    args,
  );
}

// ─── GetMultipleUsersDetails ─────────────────────────────────────────────────

export interface GetMultipleUsersDetailsArgs {
  searchValues: string[];
  propertyToSearchBy?: string;
  select?: string;
  expand?: string;
  top?: number;
  orderby?: string;
}

export interface GetMultipleUsersDetailsResponse {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
  id?: string;
  jobTitle?: string;
  officeLocation?: string;
  mobilePhone?: string;
  businessPhones?: string[];
  department?: string;
  companyName?: string;
  city?: string;
  country?: string;
  state?: string;
}

export async function getMultipleUsersDetails(
  args: GetMultipleUsersDetailsArgs,
): Promise<GetMultipleUsersDetailsResponse[]> {
  return callM365Mcp<
    GetMultipleUsersDetailsResponse,
    GetMultipleUsersDetailsArgs
  >('mcp_MeServer', '', 'GetMultipleUsersDetails', args);
}

// ─── GetManagerDetails ───────────────────────────────────────────────────────

export interface GetManagerDetailsArgs {
  userId: string;
  select?: string;
}

export interface GetManagerDetailsResponse {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
  id?: string;
  jobTitle?: string;
  officeLocation?: string;
  mobilePhone?: string;
  businessPhones?: string[];
  department?: string;
  companyName?: string;
  city?: string;
  country?: string;
  state?: string;
}

export async function getManagerDetails(
  args: GetManagerDetailsArgs,
): Promise<GetManagerDetailsResponse[]> {
  return callM365Mcp<GetManagerDetailsResponse, GetManagerDetailsArgs>(
    'mcp_MeServer',
    '',
    'GetManagerDetails',
    args,
  );
}

// ─── GetDirectReportsDetails ─────────────────────────────────────────────────

export interface GetDirectReportsDetailsArgs {
  userId: string;
  select?: string;
}

export interface GetDirectReportsDetailsResponse {
  displayName?: string;
  mail?: string;
  userPrincipalName?: string;
  id?: string;
  jobTitle?: string;
  officeLocation?: string;
  mobilePhone?: string;
  businessPhones?: string[];
  department?: string;
  companyName?: string;
  city?: string;
  country?: string;
  state?: string;
}

export async function getDirectReportsDetails(
  args: GetDirectReportsDetailsArgs,
): Promise<GetDirectReportsDetailsResponse[]> {
  return callM365Mcp<
    GetDirectReportsDetailsResponse,
    GetDirectReportsDetailsArgs
  >('mcp_MeServer', '', 'GetDirectReportsDetails', args);
}
