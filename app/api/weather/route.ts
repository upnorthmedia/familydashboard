import { NextResponse } from 'next/server';
import { getCurrentWeather, getWeatherForecast } from '@/lib/services/weather/api';
import { WEATHER_CONFIG } from '@/lib/config/weather';

export const revalidate = WEATHER_CONFIG.CACHE_TIME;

export async function GET() {
  try {
    const city = `${process.env.WEATHER_CITY || 'Omaha'},US`;
    
    const [current, forecast] = await Promise.all([
      getCurrentWeather(city),
      getWeatherForecast(city),
    ]);

    return NextResponse.json(
      { current, forecast },
      {
        headers: {
          'Cache-Control': `s-maxage=${WEATHER_CONFIG.CACHE_TIME}, stale-while-revalidate`,
        },
      }
    );
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 }
    );
  }
}