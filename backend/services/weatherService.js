const WEATHER_ENDPOINT = 'https://api.weatherapi.com/v1/current.json';

async function getCurrentWeather(city, apiKey) {
  const url = new URL(WEATHER_ENDPOINT);
  url.searchParams.set('key', apiKey);
  url.searchParams.set('q', city);
  url.searchParams.set('aqi', 'no');

  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = body?.error?.message || 'The weather service could not complete the request.';
    const error = new Error(message);
    error.statusCode = response.status === 400 ? 404 : 502;
    throw error;
  }

  return {
    location: {
      name: body.location.name,
      region: body.location.region,
      country: body.location.country,
      localtime: body.location.localtime
    },
    current: {
      temperatureC: body.current.temp_c,
      feelsLikeC: body.current.feelslike_c,
      condition: body.current.condition.text,
      icon: `https:${body.current.condition.icon}`,
      humidity: body.current.humidity,
      windKph: body.current.wind_kph,
      windDirection: body.current.wind_dir,
      pressureMb: body.current.pressure_mb,
      visibilityKm: body.current.vis_km,
      lastUpdated: body.current.last_updated
    }
  };
}

module.exports = { getCurrentWeather };
