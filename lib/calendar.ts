import { createDAVClient, DAVCalendar } from 'tsdav';

export interface ParsedEvent {
  id: string;
  summary: string;
  start: Date;
  end: Date;
  location?: string;
  calendar: string;
}

export function formatEventTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export function formatEventTimeRange(start: Date, end: Date): string {
  return `${formatEventTime(start)} - ${formatEventTime(end)}`;
}

interface CalendarConfig {
  serverUrl: string;
  credentials: {
    username: string;
    password: string;
  };
}

export class CalendarService {
  private client: any;
  private calendars: DAVCalendar[] = [];

  constructor(private config: CalendarConfig) {}

  async initialize() {
    this.client = await createDAVClient({
      serverUrl: this.config.serverUrl,
      credentials: {
        username: this.config.credentials.username,
        password: this.config.credentials.password,
      },
      authMethod: 'Basic',
      defaultAccountType: 'caldav',
    });

    await this.fetchCalendars();
  }

  private async fetchCalendars() {
    try {
      this.calendars = await this.client.fetchCalendars();
    } catch (error) {
      console.error('Failed to fetch calendars:', error);
      throw error;
    }
  }

  private parseICalEvent(data: string | Record<string, unknown> | undefined | null, calendarName: string): ParsedEvent | null {
    if (!data || typeof data !== 'string') return null;
    
    const lines = data.split('\r\n');
    let event: Partial<ParsedEvent> = { calendar: calendarName };
    let inEvent = false;

    for (const line of lines) {
      if (line === 'BEGIN:VEVENT') {
        inEvent = true;
        continue;
      }
      if (line === 'END:VEVENT') {
        break;
      }
      if (!inEvent) continue;

      const [keyFull, ...valueParts] = line.split(':');
      const [key, ...params] = keyFull.split(';');
      const value = valueParts.join(':').replace(/\\n/g, '\n').replace(/\\,/g, ',');

      switch (key) {
        case 'SUMMARY':
          event.summary = value.trim();
          break;
        case 'UID':
          event.id = value;
          break;
        case 'LOCATION':
          event.location = value.replace(/\\n/g, '\n').replace(/\\,/g, ',');
          break;
        case 'DTSTART':
        case 'DTEND':
          const tzParam = params.find(p => p.startsWith('TZID='));
          let dateStr = value;
          if (dateStr.includes('T')) {
            dateStr = dateStr.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6');
          }
          const date = new Date(dateStr);
          if (key === 'DTSTART') event.start = date;
          else event.end = date;
          break;
      }
    }

    if (!event.summary || !event.start || !event.end || !event.id) {
      console.log('Invalid event:', event);
      return null;
    }
    
    console.log('Parsed event:', {
      summary: event.summary,
      start: event.start.toISOString(),
      end: event.end.toISOString(),
      location: event.location
    });
    
    return event as ParsedEvent;
  }

  async getEvents(start: Date, end: Date) {
    try {
      console.log('Calendar Service - Fetching events with date range:', {
        start: start.toISOString(),
        end: end.toISOString()
      });

      const events: ParsedEvent[] = [];
      for (const calendar of this.calendars) {
        if (!calendar.components?.includes('VEVENT')) {
          console.log(`Skipping calendar ${calendar.displayName} - no VEVENT component`);
          continue;
        }

        console.log(`Processing calendar: ${calendar.displayName}`);
        const calendarEvents = await this.client.fetchCalendarObjects({
          calendar,
          timeRange: {
            start: start.toISOString(),
            end: end.toISOString(),
          },
          expand: true
        });

        console.log(`Found ${calendarEvents.length} raw events in ${calendar.displayName}`);
        
        for (const event of calendarEvents) {
          console.log('Raw event data:', {
            url: event.url,
            data: event.data,
            calendarData: event.calendarData
          });
          
          const eventData = event?.calendarData || event?.data;
          if (typeof eventData === 'string' || (eventData && typeof eventData === 'object')) {
            const parsedEvent = this.parseICalEvent(
              typeof eventData === 'string' ? eventData : JSON.stringify(eventData),
              calendar.displayName
            );
            if (parsedEvent) {
              events.push(parsedEvent);
            } else {
              console.log('Failed to parse event:', eventData);
            }
          } else {
            console.log('Invalid event data:', eventData);
          }
        }
      }

      events.sort((a, b) => a.start.getTime() - b.start.getTime());
      console.log('Final processed events:', events.map(e => ({
        summary: e.summary,
        start: e.start.toISOString(),
        end: e.end.toISOString(),
        calendar: e.calendar
      })));
      
      return events;
    } catch (error) {
      console.error('Failed to fetch events:', error);
      throw error;
    }
  }

  async createEvent(calendarId: string, event: any) {
    try {
      const calendar = this.calendars.find(cal => cal.url === calendarId);
      if (!calendar) {
        throw new Error('Calendar not found');
      }

      await this.client.createCalendarObject({
        calendar,
        iCalString: event.iCalString,
        filename: `${event.uid}.ics`,
      });
    } catch (error) {
      console.error('Failed to create event:', error);
      throw error;
    }
  }
} 