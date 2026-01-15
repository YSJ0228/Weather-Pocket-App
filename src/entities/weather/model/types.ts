export interface WeatherData {
  coord: { lon: number; lat: number };
  temp: number;
  yesterday_temp?: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind_speed: number;
  description: string;
  icon_code: number; // WMO Code
  name: string;
  id: string;
  // Extended Data
  uv_index: number;
  precip_prob: number;
  sunrise: string;
  sunset: string;
  cloud_cover: number;
  air_quality: {
    pm10: number;
    pm2_5: number;
  };
}

export interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  icon_code: number;
  description: string;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  icon_code: number;
  description: string;
}

export interface WeatherResponse {
  current: WeatherData;
  daily: ForecastDay[];
  hourly: HourlyForecast[];
}
