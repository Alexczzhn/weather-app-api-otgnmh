
// Weather API Service using OpenWeatherMap
// Free tier supports all countries worldwide including Kenya

const API_KEY = 'YOUR_API_KEY_HERE'; // Users should replace this with their own API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  lat: number;
  lon: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon: string;
  condition: string;
}

export interface DailyForecast {
  day: string;
  high: number;
  low: number;
  icon: string;
  condition: string;
}

// Convert OpenWeatherMap icon codes to SF Symbols
const getWeatherIcon = (iconCode: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': 'sun.max.fill',
    '01n': 'moon.stars.fill',
    '02d': 'cloud.sun.fill',
    '02n': 'cloud.moon.fill',
    '03d': 'cloud.fill',
    '03n': 'cloud.fill',
    '04d': 'smoke.fill',
    '04n': 'smoke.fill',
    '09d': 'cloud.rain.fill',
    '09n': 'cloud.rain.fill',
    '10d': 'cloud.sun.rain.fill',
    '10n': 'cloud.moon.rain.fill',
    '11d': 'cloud.bolt.fill',
    '11n': 'cloud.bolt.fill',
    '13d': 'snow',
    '13n': 'snow',
    '50d': 'cloud.fog.fill',
    '50n': 'cloud.fog.fill',
  };
  return iconMap[iconCode] || 'cloud.fill';
};

// Format time from timestamp
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
};

// Format day from timestamp
const formatDay = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Fetch current weather by city name
export const fetchWeatherByCity = async (cityName: string, unit: 'C' | 'F' = 'C'): Promise<WeatherData | null> => {
  try {
    const units = unit === 'C' ? 'metric' : 'imperial';
    const response = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&units=${units}&appid=${API_KEY}`
    );

    if (!response.ok) {
      console.log('Weather API error:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('Weather data fetched for:', cityName);

    return {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1000), // Convert m to km
      uvIndex: 0, // UV index requires separate API call
      sunrise: formatTime(data.sys.sunrise),
      sunset: formatTime(data.sys.sunset),
      lat: data.coord.lat,
      lon: data.coord.lon,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

// Fetch current weather by coordinates
export const fetchWeatherByCoords = async (lat: number, lon: number, unit: 'C' | 'F' = 'C'): Promise<WeatherData | null> => {
  try {
    const units = unit === 'C' ? 'metric' : 'imperial';
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );

    if (!response.ok) {
      console.log('Weather API error:', response.status);
      return null;
    }

    const data = await response.json();
    console.log('Weather data fetched for coordinates:', lat, lon);

    return {
      location: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1000),
      uvIndex: 0,
      sunrise: formatTime(data.sys.sunrise),
      sunset: formatTime(data.sys.sunset),
      lat: data.coord.lat,
      lon: data.coord.lon,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return null;
  }
};

// Fetch hourly forecast
export const fetchHourlyForecast = async (lat: number, lon: number, unit: 'C' | 'F' = 'C'): Promise<HourlyForecast[]> => {
  try {
    const units = unit === 'C' ? 'metric' : 'imperial';
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );

    if (!response.ok) {
      console.log('Forecast API error:', response.status);
      return [];
    }

    const data = await response.json();
    console.log('Hourly forecast fetched');

    // Get next 6 hours
    return data.list.slice(0, 6).map((item: any) => ({
      time: formatTime(item.dt),
      temp: Math.round(item.main.temp),
      icon: getWeatherIcon(item.weather[0].icon),
      condition: item.weather[0].main,
    }));
  } catch (error) {
    console.error('Error fetching hourly forecast:', error);
    return [];
  }
};

// Fetch daily forecast
export const fetchDailyForecast = async (lat: number, lon: number, unit: 'C' | 'F' = 'C'): Promise<DailyForecast[]> => {
  try {
    const units = unit === 'C' ? 'metric' : 'imperial';
    const response = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );

    if (!response.ok) {
      console.log('Forecast API error:', response.status);
      return [];
    }

    const data = await response.json();
    console.log('Daily forecast fetched');

    // Group by day and get min/max temps
    const dailyData: { [key: string]: any } = {};
    
    data.list.forEach((item: any) => {
      const day = formatDay(item.dt);
      if (!dailyData[day]) {
        dailyData[day] = {
          day,
          temps: [],
          icon: item.weather[0].icon,
          condition: item.weather[0].main,
        };
      }
      dailyData[day].temps.push(item.main.temp);
    });

    // Convert to array and calculate high/low
    return Object.values(dailyData).slice(0, 5).map((day: any) => ({
      day: day.day,
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      icon: getWeatherIcon(day.icon),
      condition: day.condition,
    }));
  } catch (error) {
    console.error('Error fetching daily forecast:', error);
    return [];
  }
};

// Search cities (returns list of matching cities)
export const searchCities = async (query: string): Promise<Array<{ name: string; country: string; lat: number; lon: number }>> => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${API_KEY}`
    );

    if (!response.ok) {
      console.log('Geocoding API error:', response.status);
      return [];
    }

    const data = await response.json();
    console.log('Cities found:', data.length);

    return data.map((city: any) => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

// Get mock data as fallback when API key is not set
export const getMockWeatherData = (unit: 'C' | 'F' = 'C'): WeatherData => {
  return {
    location: "Nairobi",
    country: "Kenya",
    temperature: unit === 'C' ? 24 : 75,
    feelsLike: unit === 'C' ? 22 : 72,
    condition: "Partly Cloudy",
    description: "Expect partly cloudy skies throughout the day",
    humidity: 65,
    windSpeed: 12,
    pressure: 1013,
    visibility: 10,
    uvIndex: 8,
    sunrise: "6:30 AM",
    sunset: "6:45 PM",
    lat: -1.2921,
    lon: 36.8219,
  };
};

export const getMockHourlyForecast = (unit: 'C' | 'F' = 'C'): HourlyForecast[] => {
  return [
    { time: "Now", temp: unit === 'C' ? 24 : 75, icon: "cloud.sun.fill", condition: "Partly Cloudy" },
    { time: "2 PM", temp: unit === 'C' ? 26 : 79, icon: "sun.max.fill", condition: "Sunny" },
    { time: "3 PM", temp: unit === 'C' ? 27 : 81, icon: "sun.max.fill", condition: "Sunny" },
    { time: "4 PM", temp: unit === 'C' ? 26 : 79, icon: "cloud.sun.fill", condition: "Partly Cloudy" },
    { time: "5 PM", temp: unit === 'C' ? 25 : 77, icon: "cloud.fill", condition: "Cloudy" },
    { time: "6 PM", temp: unit === 'C' ? 23 : 73, icon: "cloud.moon.fill", condition: "Cloudy" },
  ];
};

export const getMockDailyForecast = (unit: 'C' | 'F' = 'C'): DailyForecast[] => {
  return [
    { day: "Mon", high: unit === 'C' ? 27 : 81, low: unit === 'C' ? 18 : 64, icon: "sun.max.fill", condition: "Sunny" },
    { day: "Tue", high: unit === 'C' ? 26 : 79, low: unit === 'C' ? 17 : 63, icon: "cloud.sun.fill", condition: "Partly Cloudy" },
    { day: "Wed", high: unit === 'C' ? 24 : 75, low: unit === 'C' ? 16 : 61, icon: "cloud.rain.fill", condition: "Rainy" },
    { day: "Thu", high: unit === 'C' ? 25 : 77, low: unit === 'C' ? 17 : 63, icon: "cloud.fill", condition: "Cloudy" },
    { day: "Fri", high: unit === 'C' ? 27 : 81, low: unit === 'C' ? 18 : 64, icon: "sun.max.fill", condition: "Sunny" },
  ];
};
