import { WeatherResponse, ForecastResponse } from '@/lib/types';

export const FALLBACK_WEATHER: WeatherResponse = {
  main: {
    temp: 72,
    humidity: 65,
    feels_like: 75,
  },
  weather: [{
    main: 'Clear',
    description: 'clear sky',
    icon: '01d',
  }],
  name: process.env.WEATHER_CITY || 'Omaha',
};

export const FALLBACK_FORECAST: ForecastResponse = {
  list: Array(5).fill(null).map((_, i) => ({
    dt: Math.floor(Date.now() / 1000) + i * 3600,
    main: {
      temp: 72 + Math.random() * 10,
    },
    weather: [{
      main: 'Clear',
      icon: '01d',
    }],
  })),
};