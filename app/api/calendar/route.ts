import { NextResponse } from 'next/server';
import { CalendarService } from '@/lib/calendar';

export const dynamic = 'force-dynamic';

// Initialize calendar service
let calendarService: CalendarService | null = null;
let initializationError: Error | null = null;

async function getCalendarService() {
  console.log('getCalendarService called');
  
  if (initializationError) {
    console.error('Previous initialization error:', initializationError);
    throw initializationError;

  if (!calendarService) {
    console.log('Initializing new calendar service...');
    try {
      // Log environment variables (careful not to log actual credentials)
      console.log('Environment check:', {
        hasServerUrl: !!process.env.CALDAV_SERVER_URL,
        hasUsername: !!process.env.CALDAV_USERNAME,
        hasPassword: !!process.env.CALDAV_PASSWORD
      });

      if (!process.env.CALDAV_SERVER_URL || !process.env.CALDAV_USERNAME || !process.env.CALDAV_PASSWORD) {
        throw new Error('Missing required CalDAV environment variables');
      }

      calendarService = new CalendarService({
        serverUrl: process.env.CALDAV_SERVER_URL,
        credentials: {
          username: process.env.CALDAV_USERNAME,
          password: process.env.CALDAV_PASSWORD,
        },
      });

      console.log('Calendar service created, initializing...');
      await calendarService.initialize();
      console.log('Calendar service initialized successfully');
    } catch (error) {
      console.error('Calendar service initialization failed:', error);
      initializationError = error instanceof Error ? error : new Error('Failed to initialize calendar service');
      throw initializationError;
    }
  }

  return calendarService;
}

export async function GET(request: Request) {
  console.log('Calendar GET request received');
  try {
    const service = await getCalendarService();
    
    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');
    
    console.log('Raw date parameters:', { startParam, endParam });
    
    // If no dates provided, default to today and next 30 days
    const start = startParam ? new Date(startParam) : new Date();
    const end = endParam ? new Date(endParam) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    // Ensure start is beginning of day and end is end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    console.log('Processed date range:', {
      start: start.toISOString(),
      end: end.toISOString()
    });
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.error('Invalid date parameters:', { start, end });
      return NextResponse.json(
        { error: 'Invalid date parameters' },
        { status: 400 }
      );
    }
    
    console.log('Fetching events...');
    const events = await service.getEvents(start, end);
    console.log('Events response:', {
      count: events.length,
      events: events.map(e => ({
        id: e.id,
        summary: e.summary,
        start: e.start,
        end: e.end,
        location: e.location,
        calendar: e.calendar
      }))
    });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Calendar API error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  console.log('Calendar POST request received');
  try {
    const service = await getCalendarService();
    
    const { calendarId, event } = await request.json();
    console.log('Creating event:', { calendarId, event });
    
    await service.createEvent(calendarId, event);
    console.log('Event created successfully');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Calendar API error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 