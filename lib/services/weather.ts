import { WeatherResponse, ForecastResponse } from '@/lib/types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Fallback data for when API calls fail
const FALLBACK_WEATHER: WeatherResponse = {
  main: {
    temp: 20,
    humidity: 65,
    feels_like: 21,
  },
  weather: [{
    main: 'Clear',
    description: 'clear sky',
    icon: '01d',
  }],
  name: process.env.WEATHER_CITY || 'London',
};

const FALLBACK_FORECAST: ForecastResponse = {
  list: Array(5).fill(null).map((_, i) => ({
    dt: Math.floor(Date.now() / 1000) + i * 3600,
    main: {
      temp: 20 + Math.random() * 5,
    },
    weather: [{
      main: 'Clear',
      icon: '01d',
    }],
  })),
};

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying fetch... (${retries} attempts remaining)`);
      await sleep(RETRY_DELAY);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}

async function fetchWeatherData(endpoint: string, city: string): Promise<any> {
  const apiKey = process.env.OPENWEATHER_API_KEY?.trim();
  
  if (!apiKey) {
    console.error('OpenWeather API key is not configured');
    return endpoint === 'weather' ? FALLBACK_WEATHER : FALLBACK_FORECAST;
  }

  const url = new URL(`https://api.openweathermap.org/data/2.5/${endpoint}`);
  url.searchParams.append('q', city);
  url.searchParams.append('units', 'metric');
  url.searchParams.append('appid', apiKey);

  try {
    const response = await fetchWithRetry(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Weather API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        endpoint,
        city
      });

      // Return fallback data instead of throwing errors
      return endpoint === 'weather' ? FALLBACK_WEATHER : FALLBACK_FORECAST;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Weather API Fetch Error:', {
      error,
      endpoint,
      city
    });

    // Return fallback data for any error
    return endpoint === 'weather' ? FALLBACK_WEATHER : FALLBACK_FORECAST;
  }
}

export async function getCurrentWeather(city: string): Promise<WeatherResponse> {
  return fetchWeatherData('weather', city);
}

export async function getWeatherForecast(city: string): Promise<ForecastResponse> {
  return fetchWeatherData('forecast', city);
}