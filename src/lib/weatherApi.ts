// OpenWeatherMap API integration
const OWM_BASE = 'https://api.openweathermap.org/data/2.5';

export interface OWMWeatherData {
  city: string;
  country: string;
  rainfall: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherDescription: string;
  weatherIcon: string;
  lat: number;
  lon: number;
  feelsLike: number;
  pressure: number;
  visibility: number;
}

export async function fetchWeatherByCity(city: string, apiKey: string): Promise<OWMWeatherData> {
  const res = await fetch(`${OWM_BASE}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const d = await res.json();

  return {
    city: d.name,
    country: d.sys.country,
    rainfall: d.rain?.['1h'] ?? 0,
    temperature: d.main.temp,
    humidity: d.main.humidity,
    windSpeed: d.wind?.speed ? d.wind.speed * 3.6 : 0,
    weatherDescription: d.weather[0]?.description ?? '',
    weatherIcon: d.weather[0]?.icon ?? '01d',
    lat: d.coord.lat,
    lon: d.coord.lon,
    feelsLike: d.main.feels_like,
    pressure: d.main.pressure,
    visibility: d.visibility ?? 10000,
  };
}

export async function fetchWeatherByCoords(lat: number, lon: number, apiKey: string): Promise<OWMWeatherData> {
  const res = await fetch(`${OWM_BASE}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const d = await res.json();

  return {
    city: d.name,
    country: d.sys.country,
    rainfall: d.rain?.['1h'] ?? 0,
    temperature: d.main.temp,
    humidity: d.main.humidity,
    windSpeed: d.wind?.speed ? d.wind.speed * 3.6 : 0,
    weatherDescription: d.weather[0]?.description ?? '',
    weatherIcon: d.weather[0]?.icon ?? '01d',
    lat: d.coord.lat,
    lon: d.coord.lon,
    feelsLike: d.main.feels_like,
    pressure: d.main.pressure,
    visibility: d.visibility ?? 10000,
  };
}

// Mock data for when API key is not provided
export function getMockWeatherData(city = 'Mumbai'): OWMWeatherData {
  return {
    city,
    country: 'IN',
    rainfall: 12.5 + Math.random() * 20,
    temperature: 24 + Math.random() * 8,
    humidity: 72 + Math.random() * 20,
    windSpeed: 25 + Math.random() * 30,
    weatherDescription: 'heavy rain',
    weatherIcon: '10d',
    lat: 19.076,
    lon: 72.877,
    feelsLike: 28,
    pressure: 1008,
    visibility: 4000,
  };
}
