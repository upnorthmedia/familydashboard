export const WEATHER_CONFIG = {
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5',
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  REQUEST_TIMEOUT: 5000,
  UNITS: 'imperial', // Ensures Fahrenheit temperatures
  DEFAULT_CITY: 'Omaha,US',
  CACHE_TIME: 300, // 5 minutes in seconds
} as const;