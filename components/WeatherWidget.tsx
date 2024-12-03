'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, CloudSnow, CloudLightning, Wind, Droplets, AlertCircle, RefreshCcw } from 'lucide-react';
import useSWR from 'swr';
import { WeatherData } from '@/lib/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch weather data');
  }
  return res.json();
};

const WeatherIcon = ({ condition }: { condition: string }) => {
  switch (condition.toLowerCase()) {
    case 'clear':
      return <Sun className="w-12 h-12 text-yellow-500" />;
    case 'rain':
      return <CloudRain className="w-12 h-12 text-blue-500" />;
    case 'snow':
      return <CloudSnow className="w-12 h-12 text-blue-200" />;
    case 'thunderstorm':
      return <CloudLightning className="w-12 h-12 text-purple-500" />;
    case 'clouds':
      return <Cloud className="w-12 h-12 text-gray-500" />;
    default:
      return <Cloud className="w-12 h-12 text-gray-500" />;
  }
};

export function WeatherWidget() {
  const { data, error, isLoading, mutate } = useSWR<WeatherData>('/api/weather', fetcher, {
    refreshInterval: 300000, // 5 minutes
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  if (error) {
    return (
      <Alert variant="destructive" className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Failed to load weather data</AlertDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => mutate()}
          className="ml-4"
        >
          <RefreshCcw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </Alert>
    );
  }

  if (isLoading || !data) {
    return (
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-200 dark:bg-blue-700 rounded w-1/3"></div>
          <div className="h-12 bg-blue-200 dark:bg-blue-700 rounded w-1/2"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-blue-200 dark:bg-blue-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const { current, forecast } = data;

  return (
    <Card className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-indigo-100/20 dark:border-indigo-800/20 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text">
            {Math.round(current.main.temp)}°F
          </h2>
          <p className="text-2xl text-indigo-700 dark:text-indigo-300">{current.weather[0].main}</p>
          <p className="text-lg text-gray-500 dark:text-gray-400">{current.name}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <WeatherIcon condition={current.weather[0].main} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => mutate()}
            className="text-gray-500 hover:text-gray-700"
          >
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Droplets className="h-5 w-5" />
          <span>Humidity: {current.main.humidity}%</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
          <Wind className="h-5 w-5" />
          <span>Feels like: {Math.round(current.main.feels_like)}°F</span>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {forecast.list.slice(0, 4).map((item, index) => (
          <div key={index} className="text-center p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <div className="flex justify-center items-center my-2">
              <WeatherIcon condition={item.weather[0].main} />
            </div>
            <p className="text-lg font-semibold">{Math.round(item.main.temp)}°F</p>
          </div>
        ))}
      </div>
    </Card>
  );
}