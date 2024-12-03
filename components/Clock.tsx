'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Clock as ClockIcon } from 'lucide-react';

export function Clock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getWeekday = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
  
      hour12: true
    }).format(date);
  };

  return (
    <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-indigo-100/20 dark:border-indigo-800/20 shadow-xl flex items-center justify-center">
      <div className="space-y-6 text-center">
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-2xl font-semibold text-indigo-700 dark:text-indigo-300">
            Happy {getWeekday(now)}!
          </h2>
          <div className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
            {formatTime(now)}
          </div>
          <div className="text-2xl text-gray-600 dark:text-gray-300">
            {formatDate(now)}
          </div>
        </div>
      </div>
    </Card>
  );
} 