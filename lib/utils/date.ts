import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';

export function formatEventDate(date: Date): string {
  if (isToday(date)) {
    return `Today, ${format(date, 'h:mm a')}`;
  } else if (isTomorrow(date)) {
    return `Tomorrow, ${format(date, 'h:mm a')}`;
  } else if (isThisWeek(date)) {
    return format(date, 'EEEE, h:mm a');
  }
  return format(date, 'MMM d, h:mm a');
}

export function formatTimeRange(start: Date, end: Date): string {
  return `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
}