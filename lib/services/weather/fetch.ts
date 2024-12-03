import { WEATHER_CONFIG } from '@/lib/config/weather';

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchWithRetry(url: string, retries = WEATHER_CONFIG.MAX_RETRIES): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), WEATHER_CONFIG.REQUEST_TIMEOUT);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        next: { revalidate: WEATHER_CONFIG.CACHE_TIME },
        cache: 'no-store',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Log response status for debugging
      console.log(`Weather API Response Status: ${response.status}`);
      
      return response;
    } catch (error) {
      lastError = error as Error;
      console.error(`Fetch attempt ${i + 1} failed:`, error);
      
      if (i < retries) {
        const delay = WEATHER_CONFIG.RETRY_DELAY * Math.pow(2, i);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay); // Exponential backoff
        continue;
      }
    }
  }
  
  throw lastError;
}