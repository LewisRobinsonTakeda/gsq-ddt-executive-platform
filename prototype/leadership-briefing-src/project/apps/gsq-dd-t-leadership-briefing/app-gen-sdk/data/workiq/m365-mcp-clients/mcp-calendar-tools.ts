/**
 * Pre-built M365 MCP clients for mcp_CalendarTools — auto-generated from MCP server source.
 * Import these in your hooks.
 */
import { callM365Mcp } from './m365-mcp-utils';

// ─── Shared types ────────────────────────────────────────────────────────────

export interface RecurrenceModel {
  pattern?: {
    type?: string;
    interval?: number;
    daysOfWeek?: string[];
    dayOfMonth?: number;
    month?: number;
    firstDayOfWeek?: string;
    index?: string;
  };
  range?: {
    type?: string;
    startDate?: string;
    endDate?: string;
    numberOfOccurrences?: number;
  };
}

// ─── ListEvents (READ) ──────────────────────────────────────────────────────

export interface ListEventsArgs {
  startDateTime?: string;
  endDateTime?: string;
  meetingTitle?: string;
  attendeeEmails?: string[];
  timeZone?: string;
  select?: string;
  top?: number;
}

export interface ListEventsResponse {
  id?: string;
  subject?: string;
  start?: { dateTime: string; timeZone: string };
  end?: { dateTime: string; timeZone: string };
  location?: { displayName: string };
  organizer?: { emailAddress: { name: string; address: string } };
  attendees?: Array<{
    emailAddress: { name: string; address: string };
    status: { response: string };
  }>;
  isOnlineMeeting?: boolean;
  onlineMeetingUrl?: string;
  bodyPreview?: string;
  importance?: string;
  sensitivity?: string;
  showAs?: string;
  isAllDay?: boolean;
  isCancelled?: boolean;
  recurrence?: unknown;
}

export async function listEvents(
  args: ListEventsArgs,
): Promise<ListEventsResponse[]> {
  return callM365Mcp<ListEventsResponse, ListEventsArgs>(
    'mcp_CalendarTools',
    '',
    'ListEvents',
    args,
  );
}

// ─── ListCalendarView (READ) ─────────────────────────────────────────────────

export interface ListCalendarViewArgs {
  userIdentifier?: string;
  startDateTime?: string;
  endDateTime?: string;
  timeZone?: string;
  subject?: string;
  select?: string;
  top?: number;
}

export interface ListCalendarViewResponse {
  id?: string;
  subject?: string;
  start?: { dateTime: string; timeZone: string };
  end?: { dateTime: string; timeZone: string };
  location?: { displayName: string };
  organizer?: { emailAddress: { name: string; address: string } };
  attendees?: Array<{
    emailAddress: { name: string; address: string };
    status: { response: string };
  }>;
  isOnlineMeeting?: boolean;
  onlineMeetingUrl?: string;
  bodyPreview?: string;
  importance?: string;
  isAllDay?: boolean;
  isCancelled?: boolean;
  showAs?: string;
}

export async function listCalendarView(
  args: ListCalendarViewArgs,
): Promise<ListCalendarViewResponse[]> {
  return callM365Mcp<ListCalendarViewResponse, ListCalendarViewArgs>(
    'mcp_CalendarTools',
    '',
    'ListCalendarView',
    args,
  );
}

// ─── FindMeetingTimes (READ) ─────────────────────────────────────────────────

export interface FindMeetingTimesArgs {
  userIdentifier?: string;
  attendeeEmails?: string[];
  meetingDuration: string;
  startDateTime?: string;
  endDateTime?: string;
  timeZone?: string;
  maxCandidates?: number;
  isOrganizerOptional?: boolean;
  returnSuggestionReasons?: boolean;
  minimumAttendeePercentage?: number;
}

export interface FindMeetingTimesResponse {
  meetingTimeSuggestions?: Array<{
    meetingTimeSlot: {
      start: { dateTime: string; timeZone: string };
      end: { dateTime: string; timeZone: string };
    };
    confidence: number;
    organizerAvailability: string;
    attendeeAvailability: Array<{
      attendee: { emailAddress: { name: string; address: string } };
      availability: string;
    }>;
    suggestionReason: string;
  }>;
  emptySuggestionsReason?: string;
}

export async function findMeetingTimes(
  args: FindMeetingTimesArgs,
): Promise<FindMeetingTimesResponse[]> {
  return callM365Mcp<FindMeetingTimesResponse, FindMeetingTimesArgs>(
    'mcp_CalendarTools',
    '',
    'FindMeetingTimes',
    args,
  );
}

// ─── GetUserDateAndTimeZoneSettings (READ) ───────────────────────────────────

export interface GetUserDateAndTimeZoneSettingsArgs {
  userIdentifier?: string;
}

export interface GetUserDateAndTimeZoneSettingsResponse {
  timeZone?: string;
  dateFormat?: string;
  timeFormat?: string;
  workingHours?: {
    startTime: string;
    endTime: string;
    daysOfWeek: string[];
  };
}

export async function getUserDateAndTimeZoneSettings(
  args: GetUserDateAndTimeZoneSettingsArgs,
): Promise<GetUserDateAndTimeZoneSettingsResponse[]> {
  return callM365Mcp<
    GetUserDateAndTimeZoneSettingsResponse,
    GetUserDateAndTimeZoneSettingsArgs
  >('mcp_CalendarTools', '', 'GetUserDateAndTimeZoneSettings', args);
}

// ─── GetRooms (READ) ─────────────────────────────────────────────────────────

export interface GetRoomsResponse {
  name?: string;
  address?: string;
}

export async function getRooms(): Promise<GetRoomsResponse[]> {
  return callM365Mcp<GetRoomsResponse>('mcp_CalendarTools', '', 'GetRooms', {});
}

// ─── CreateEvent (WRITE) ─────────────────────────────────────────────────────

export interface CreateEventArgs {
  subject: string;
  attendeeEmails: string[];
  startDateTime: string;
  endDateTime: string;
  timeZone?: string;
  bodyContent?: string;
  bodyContentType?: string;
  location?: string;
  isOnlineMeeting?: boolean;
  onlineMeetingProvider?: string;
  allowNewTimeProposals?: boolean;
  recurrence?: RecurrenceModel;
  importance?: string;
  sensitivity?: string;
  showAs?: string;
  responseRequested?: boolean;
}

export async function createEvent(args: CreateEventArgs): Promise<unknown[]> {
  return callM365Mcp<unknown, CreateEventArgs>(
    'mcp_CalendarTools',
    '',
    'CreateEvent',
    args,
  );
}

// ─── UpdateEvent (WRITE) ─────────────────────────────────────────────────────

export interface UpdateEventArgs {
  eventId: string;
  subject?: string;
  startDateTime?: string;
  endDateTime?: string;
  timeZone?: string;
  attendeesToAdd?: string[];
  attendeesToRemove?: string[];
  body?: string;
  location?: string;
  recurrence?: RecurrenceModel;
  importance?: string;
  sensitivity?: string;
  showAs?: string;
  responseRequested?: boolean;
}

export async function updateEvent(args: UpdateEventArgs): Promise<unknown[]> {
  return callM365Mcp<unknown, UpdateEventArgs>(
    'mcp_CalendarTools',
    '',
    'UpdateEvent',
    args,
  );
}

// ─── DeleteEventById (WRITE) ─────────────────────────────────────────────────

export interface DeleteEventByIdArgs {
  eventId: string;
}

export async function deleteEventById(
  args: DeleteEventByIdArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, DeleteEventByIdArgs>(
    'mcp_CalendarTools',
    '',
    'DeleteEventById',
    args,
  );
}

// ─── AcceptEvent (WRITE) ─────────────────────────────────────────────────────

export interface AcceptEventArgs {
  eventId: string;
  comment?: string;
  sendResponse?: boolean;
}

export async function acceptEvent(args: AcceptEventArgs): Promise<unknown[]> {
  return callM365Mcp<unknown, AcceptEventArgs>(
    'mcp_CalendarTools',
    '',
    'AcceptEvent',
    args,
  );
}

// ─── TentativelyAcceptEvent (WRITE) ──────────────────────────────────────────

export interface TentativelyAcceptEventArgs {
  eventId: string;
  comment?: string;
  sendResponse?: boolean;
}

export async function tentativelyAcceptEvent(
  args: TentativelyAcceptEventArgs,
): Promise<unknown[]> {
  return callM365Mcp<unknown, TentativelyAcceptEventArgs>(
    'mcp_CalendarTools',
    '',
    'TentativelyAcceptEvent',
    args,
  );
}

// ─── DeclineEvent (WRITE) ────────────────────────────────────────────────────

export interface DeclineEventArgs {
  eventId: string;
  comment?: string;
  sendResponse?: boolean;
}

export async function declineEvent(args: DeclineEventArgs): Promise<unknown[]> {
  return callM365Mcp<unknown, DeclineEventArgs>(
    'mcp_CalendarTools',
    '',
    'DeclineEvent',
    args,
  );
}

// ─── CancelEvent (WRITE) ────────────────────────────────────────────────────

export interface CancelEventArgs {
  eventId: string;
  comment?: string;
}

export async function cancelEvent(args: CancelEventArgs): Promise<unknown[]> {
  return callM365Mcp<unknown, CancelEventArgs>(
    'mcp_CalendarTools',
    '',
    'CancelEvent',
    args,
  );
}

// ─── ForwardEvent (WRITE) ────────────────────────────────────────────────────

export interface ForwardEventArgs {
  eventId: string;
  recipientEmails: string[];
  comment?: string;
}

export async function forwardEvent(args: ForwardEventArgs): Promise<unknown[]> {
  return callM365Mcp<unknown, ForwardEventArgs>(
    'mcp_CalendarTools',
    '',
    'ForwardEvent',
    args,
  );
}
