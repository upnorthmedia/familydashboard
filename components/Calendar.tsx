'use client';

import { Card } from '@/components/ui/card';
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { ParsedEvent, formatEventTimeRange } from '@/lib/calendar';
import { useEffect, useState } from 'react';
import { isToday, isTomorrow, startOfDay, endOfDay } from 'date-fns';

export function Calendar() {
  const [events, setEvents] = useState<ParsedEvent[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const start = startOfDay(new Date());
        const end = endOfDay(new Date(Date.now() + 24 * 60 * 60 * 1000)); // Include tomorrow
        
        const response = await fetch(
          `/api/calendar?start=${start.toISOString()}&end=${end.toISOString()}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch calendar events');
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvents();
    
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Filter events for today and tomorrow
  const todayEvents = events.filter(event => isToday(new Date(event.start)));
  const tomorrowEvents = events.filter(event => isTomorrow(new Date(event.start)));

  const renderEventList = (events: ParsedEvent[], title: string) => {
    if (events.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">{title}</h3>
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded-lg bg-white/90 dark:bg-gray-800/90 shadow-sm hover:shadow-md transition-all duration-200 border border-indigo-100/20 dark:border-indigo-800/20 backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {event.summary}
              </h3>
              <div className="text-right">
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {formatEventTimeRange(new Date(event.start), new Date(event.end))}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {event.calendar}
                </div>
              </div>
            </div>
            
            {event.location && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-indigo-100/20 dark:border-indigo-800/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
            Schedule
          </h2>
        </div>
        <div className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <p className="text-center text-indigo-600/70 dark:text-indigo-400/70 py-8">
            Loading events...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 dark:text-red-400 py-8">
            {error}
          </p>
        ) : todayEvents.length === 0 && tomorrowEvents.length === 0 ? (
          <p className="text-center text-indigo-600/70 dark:text-indigo-400/70 py-8">
            No upcoming events
          </p>
        ) : (
          <>
            {renderEventList(todayEvents, "Today's Events")}
            {renderEventList(tomorrowEvents, "Tomorrow's Events")}
          </>
        )}
      </div>
    </Card>
  );
}