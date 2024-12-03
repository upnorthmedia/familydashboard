import { WEATHER_CONFIG } from '@/lib/config/weather';
import { FALLBACK_WEATHER, FALLBACK_FORECAST } from './fallback';
import { WeatherResponse, ForecastResponse } from '@/lib/types';
import { fetchWithRetry } from './fetch';

async function fetchWeatherData<T>(endpoint: string, city: string, fallback: T): Promise<T> {
  const apiKey = process.env.OPENWEATHER_API_KEY?.trim();
  
  if (!apiKey) {
    console.error('OpenWeather API key is not configured');
    return fallback;
  }

  try {
    const url = new URL(`${WEATHER_CONFIG.API_BASE_URL}/${endpoint}`);
    url.searchParams.append('q', city);
    url.searchParams.append('units', WEATHER_CONFIG.UNITS);
    url.searchParams.append('appid', apiKey);

    console.log(`Fetching ${endpoint} data for ${city} (${WEATHER_CONFIG.UNITS} units)`);

    const response = await fetchWithRetry(url.toString());
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error(`Weather API Error (${endpoint}):`, {
        status: response.status,
        message: errorData.message,
        city
      });
      return fallback;
    }
    
    const data = await response.json();
    
    if (data.cod && data.cod !== 200 && data.cod !== '200') {
      console.error(`Weather API Error (${endpoint}):`, data.message);
      return fallback;
    }
    
    return data;
  } catch (error) {
    console.error(`Weather API Error (${endpoint}):`, error);
    return fallback;
  }
}

export async function getCurrentWeather(city: string = WEATHER_CONFIG.DEFAULT_CITY): Promise<WeatherResponse> {
  return fetchWeatherData<WeatherResponse>('weather', city, FALLBACK_WEATHER);
}

export async function getWeatherForecast(city: string = WEATHER_CONFIG.DEFAULT_CITY): Promise<ForecastResponse> {
  return fetchWeatherData<ForecastResponse>('forecast', city, FALLBACK_FORECAST);
}