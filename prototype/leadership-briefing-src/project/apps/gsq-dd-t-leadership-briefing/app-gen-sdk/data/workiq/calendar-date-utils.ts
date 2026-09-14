/**
 * Converts calendar event DateTimeTimeZone objects to JavaScript Date objects.
 *
 * Calendar events from MCP return `start` and `end` as { dateTime, timeZone } where
 * `dateTime` is a wall-clock string with NO UTC offset and `timeZone` is a
 * Windows timezone name or IANA identifier. Passing dateTime directly to new Date()
 * misinterprets it as the browser's local time. This utility resolves the correct
 * UTC instant so the browser can display it in the user's local timezone.
 */

/**
 * Maps Windows timezone names to IANA timezone identifiers that the Intl API
 * understands. Covers all timezones documented at
 * https://learn.microsoft.com/en-us/windows-hardware/manufacture/desktop/default-time-zones
 */
const WINDOWS_TO_IANA: Record<string, string> = {
  'Dateline Standard Time': 'Etc/GMT+12',
  'UTC-11': 'Etc/GMT+11',
  'Aleutian Standard Time': 'America/Adak',
  'Hawaiian Standard Time': 'Pacific/Honolulu',
  'Marquesas Standard Time': 'Pacific/Marquesas',
  'Alaskan Standard Time': 'America/Anchorage',
  'UTC-09': 'Etc/GMT+9',
  'Pacific Standard Time (Mexico)': 'America/Tijuana',
  'UTC-08': 'Etc/GMT+8',
  'Pacific Standard Time': 'America/Los_Angeles',
  'US Mountain Standard Time': 'America/Phoenix',
  'Mountain Standard Time (Mexico)': 'America/Chihuahua',
  'Mountain Standard Time': 'America/Denver',
  'Central America Standard Time': 'America/Guatemala',
  'Central Standard Time': 'America/Chicago',
  'Easter Island Standard Time': 'Pacific/Easter',
  'Central Standard Time (Mexico)': 'America/Mexico_City',
  'Canada Central Standard Time': 'America/Regina',
  'SA Pacific Standard Time': 'America/Bogota',
  'Eastern Standard Time (Mexico)': 'America/Cancun',
  'Eastern Standard Time': 'America/New_York',
  'Haiti Standard Time': 'America/Port-au-Prince',
  'Cuba Standard Time': 'America/Havana',
  'US Eastern Standard Time': 'America/Indianapolis',
  'Turks And Caicos Standard Time': 'America/Grand_Turk',
  'Paraguay Standard Time': 'America/Asuncion',
  'Atlantic Standard Time': 'America/Halifax',
  'Venezuela Standard Time': 'America/Caracas',
  'Central Brazilian Standard Time': 'America/Cuiaba',
  'SA Western Standard Time': 'America/La_Paz',
  'Pacific SA Standard Time': 'America/Santiago',
  'Newfoundland Standard Time': 'America/St_Johns',
  'Tocantins Standard Time': 'America/Araguaina',
  'E. South America Standard Time': 'America/Sao_Paulo',
  'SA Eastern Standard Time': 'America/Cayenne',
  'Argentina Standard Time': 'America/Argentina/Buenos_Aires',
  'Greenland Standard Time': 'America/Godthab',
  'Montevideo Standard Time': 'America/Montevideo',
  'Magallanes Standard Time': 'America/Punta_Arenas',
  'Saint Pierre Standard Time': 'America/Miquelon',
  'Bahia Standard Time': 'America/Bahia',
  'UTC-02': 'Etc/GMT+2',
  'Azores Standard Time': 'Atlantic/Azores',
  'Cape Verde Standard Time': 'Atlantic/Cape_Verde',
  UTC: 'Etc/GMT',
  'Morocco Standard Time': 'Africa/Casablanca',
  'GMT Standard Time': 'Europe/London',
  'Greenwich Standard Time': 'Atlantic/Reykjavik',
  'Sao Tome Standard Time': 'Africa/Sao_Tome',
  'W. Europe Standard Time': 'Europe/Berlin',
  'Central Europe Standard Time': 'Europe/Budapest',
  'Romance Standard Time': 'Europe/Paris',
  'Central European Standard Time': 'Europe/Warsaw',
  'W. Central Africa Standard Time': 'Africa/Lagos',
  'Jordan Standard Time': 'Asia/Amman',
  'GTB Standard Time': 'Europe/Bucharest',
  'Middle East Standard Time': 'Asia/Beirut',
  'Egypt Standard Time': 'Africa/Cairo',
  'E. Europe Standard Time': 'Europe/Chisinau',
  'Syria Standard Time': 'Asia/Damascus',
  'West Bank Standard Time': 'Asia/Hebron',
  'South Africa Standard Time': 'Africa/Johannesburg',
  'FLE Standard Time': 'Europe/Kiev',
  'Israel Standard Time': 'Asia/Jerusalem',
  'South Sudan Standard Time': 'Africa/Juba',
  'Kaliningrad Standard Time': 'Europe/Kaliningrad',
  'Sudan Standard Time': 'Africa/Khartoum',
  'Libya Standard Time': 'Africa/Tripoli',
  'Namibia Standard Time': 'Africa/Windhoek',
  'Arabic Standard Time': 'Asia/Baghdad',
  'Türkiye Standard Time': 'Europe/Istanbul',
  'Turkey Standard Time': 'Europe/Istanbul',
  'Arab Standard Time': 'Asia/Riyadh',
  'Belarus Standard Time': 'Europe/Minsk',
  'Russian Standard Time': 'Europe/Moscow',
  'E. Africa Standard Time': 'Africa/Nairobi',
  'Iran Standard Time': 'Asia/Tehran',
  'Arabian Standard Time': 'Asia/Dubai',
  'Astrakhan Standard Time': 'Europe/Astrakhan',
  'Azerbaijan Standard Time': 'Asia/Baku',
  'Russia Time Zone 3': 'Europe/Samara',
  'Mauritius Standard Time': 'Indian/Mauritius',
  'Saratov Standard Time': 'Europe/Saratov',
  'Georgian Standard Time': 'Asia/Tbilisi',
  'Volgograd Standard Time': 'Europe/Volgograd',
  'Caucasus Standard Time': 'Asia/Yerevan',
  'Afghanistan Standard Time': 'Asia/Kabul',
  'West Asia Standard Time': 'Asia/Tashkent',
  'Ekaterinburg Standard Time': 'Asia/Yekaterinburg',
  'Pakistan Standard Time': 'Asia/Karachi',
  'Qyzylorda Standard Time': 'Asia/Qyzylorda',
  'India Standard Time': 'Asia/Kolkata',
  'Sri Lanka Standard Time': 'Asia/Colombo',
  'Nepal Standard Time': 'Asia/Kathmandu',
  'Central Asia Standard Time': 'Asia/Almaty',
  'Bangladesh Standard Time': 'Asia/Dhaka',
  'Omsk Standard Time': 'Asia/Omsk',
  'Myanmar Standard Time': 'Asia/Yangon',
  'SE Asia Standard Time': 'Asia/Bangkok',
  'Altai Standard Time': 'Asia/Barnaul',
  'W. Mongolia Standard Time': 'Asia/Hovd',
  'North Asia Standard Time': 'Asia/Krasnoyarsk',
  'N. Central Asia Standard Time': 'Asia/Novosibirsk',
  'Tomsk Standard Time': 'Asia/Tomsk',
  'China Standard Time': 'Asia/Shanghai',
  'North Asia East Standard Time': 'Asia/Irkutsk',
  'Singapore Standard Time': 'Asia/Singapore',
  'W. Australia Standard Time': 'Australia/Perth',
  'Taipei Standard Time': 'Asia/Taipei',
  'Ulaanbaatar Standard Time': 'Asia/Ulaanbaatar',
  'Aus Central W. Standard Time': 'Australia/Eucla',
  'Transbaikal Standard Time': 'Asia/Chita',
  'Tokyo Standard Time': 'Asia/Tokyo',
  'North Korea Standard Time': 'Asia/Pyongyang',
  'Korea Standard Time': 'Asia/Seoul',
  'Yakutsk Standard Time': 'Asia/Yakutsk',
  'Cen. Australia Standard Time': 'Australia/Adelaide',
  'AUS Central Standard Time': 'Australia/Darwin',
  'E. Australia Standard Time': 'Australia/Brisbane',
  'AUS Eastern Standard Time': 'Australia/Sydney',
  'West Pacific Standard Time': 'Pacific/Port_Moresby',
  'Tasmania Standard Time': 'Australia/Hobart',
  'Vladivostok Standard Time': 'Asia/Vladivostok',
  'Lord Howe Standard Time': 'Australia/Lord_Howe',
  'Bougainville Standard Time': 'Pacific/Bougainville',
  'Russia Time Zone 10': 'Asia/Srednekolymsk',
  'Magadan Standard Time': 'Asia/Magadan',
  'Norfolk Standard Time': 'Pacific/Norfolk',
  'Sakhalin Standard Time': 'Asia/Sakhalin',
  'Central Pacific Standard Time': 'Pacific/Guadalcanal',
  'Russia Time Zone 11': 'Asia/Kamchatka',
  'New Zealand Standard Time': 'Pacific/Auckland',
  'UTC+12': 'Etc/GMT-12',
  'Fiji Standard Time': 'Pacific/Fiji',
  'Chatham Islands Standard Time': 'Pacific/Chatham',
  'UTC+13': 'Etc/GMT-13',
  'Tonga Standard Time': 'Pacific/Tongatapu',
  'Samoa Standard Time': 'Pacific/Apia',
  'Line Islands Standard Time': 'Pacific/Kiritimati',
};

interface DateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

function extractDateParts(date: Date, timeZone: string): DateParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes): number => {
    const value = parseInt(
      parts.find((p) => p.type === type)?.value ?? '0',
      10,
    );
    // Intl formats midnight as hour 24 in some locales
    return type === 'hour' && value === 24 ? 0 : value;
  };

  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    hour: get('hour'),
    minute: get('minute'),
    second: get('second'),
  };
}

/**
 * Returns the UTC offset in milliseconds for `timeZone` at the instant `date`.
 * Positive values mean the timezone is ahead of UTC (east), negative behind (west).
 */
function getTimezoneOffsetMs(date: Date, timeZone: string): number {
  const utc = extractDateParts(date, 'UTC');
  const tz = extractDateParts(date, timeZone);

  const utcMs = Date.UTC(
    utc.year,
    utc.month - 1,
    utc.day,
    utc.hour,
    utc.minute,
    utc.second,
  );
  const tzMs = Date.UTC(
    tz.year,
    tz.month - 1,
    tz.day,
    tz.hour,
    tz.minute,
    tz.second,
  );

  return tzMs - utcMs;
}

/**
 * Converts a calendar event DateTimeTimeZone to a JavaScript Date.
 *
 * Calendar events from MCP return `start` and `end` objects shaped as
 * `{ dateTime: string, timeZone: string }`. The `dateTime` is a wall-clock
 * string (e.g. `"2024-03-15T09:00:00.0000000"`) and `timeZone` is a Windows
 * timezone name (e.g. `"Pacific Standard Time"`) or IANA identifier
 * (e.g. `"America/Los_Angeles"`).
 *
 * The returned Date represents the correct UTC instant so the browser
 * displays the right time in the user's local timezone.
 *
 * @param dateTime - Wall-clock datetime string from the calendar event
 * @param timeZone - Windows timezone name or IANA timezone identifier
 * @returns A Date representing the equivalent UTC instant
 *
 * @example
 * ```ts
 * const events = await listCalendarView(...);
 * const startDate = parseCalendarDateTime(event.start.dateTime, event.start.timeZone);
 * // Display in user's local timezone:
 * startDate.toLocaleTimeString();
 * ```
 */
export function parseCalendarDateTime(
  dateTime: string,
  timeZone: string,
): Date {
  const iana = WINDOWS_TO_IANA[timeZone] ?? timeZone;

  // If fractional seconds are present, trim them to ms precision, then append Z
  // so the Date constructor interprets the value as UTC.
  const trimmed = dateTime.replace(/(\.\d{3})\d*$/, '$1');
  const asUtc = new Date(trimmed.endsWith('Z') ? trimmed : trimmed + 'Z');

  if (isNaN(asUtc.getTime())) {
    // Unparseable — fall back to native parsing as a best effort
    return new Date(dateTime);
  }

  // Determine the UTC offset of the source timezone at this approximate instant.
  // We use the UTC-interpreted value as a close-enough reference point —
  // the offset lookup is accurate unless the wall-clock time falls exactly on
  // a DST transition boundary, which is extremely rare for calendar events.
  const offsetMs = getTimezoneOffsetMs(asUtc, iana);

  // wall-clock in TZ  →  UTC instant  =  wall-clock-as-UTC − offset
  return new Date(asUtc.getTime() - offsetMs);
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Splits a date range into consecutive chunks for calendar queries.
 * Each chunk's end equals the next chunk's start — no gaps, no overlaps.
 * For a given input the output is always identical (deterministic).
 *
 * @param startDate - Start of the range
 * @param endDate - End of the range
 * @param maxSpanInDays - Maximum number of days per chunk (default: 7)
 * @returns Array of { startDate, endDate } Date objects covering the full range
 */
export function chunkDateRange(
  startDate: Date,
  endDate: Date,
  maxSpanInDays = 7,
): { startDate: Date; endDate: Date }[] {
  const chunks: { startDate: Date; endDate: Date }[] = [];
  const chunkSizeMs = maxSpanInDays * MS_PER_DAY;
  let currentStart = startDate.getTime();
  const endTime = endDate.getTime();

  while (currentStart < endTime) {
    const chunkEnd = Math.min(currentStart + chunkSizeMs, endTime);
    chunks.push({
      startDate: new Date(currentStart),
      endDate: new Date(chunkEnd),
    });
    currentStart = chunkEnd;
  }

  return chunks;
}
