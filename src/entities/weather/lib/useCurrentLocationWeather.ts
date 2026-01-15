import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { weatherApi } from "../../../shared/api/weatherApi";
import {
  getCurrentLocation,
  type Coordinates,
} from "../../../shared/lib/geolocation";
import type { WeatherResponse } from "../model/types";

export const useCurrentLocationWeather = () => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // 1. Get browser geolocation on mount
  useEffect(() => {
    getCurrentLocation()
      .then((position) => setCoords(position))
      .catch((error) => {
        setLocationError(
          error instanceof Error
            ? error.message
            : "위치 정보를 가져오는 데 실패했습니다."
        );
      });
  }, []);

  // 2. Fetch weather only when coords are available
  const weatherQuery = useQuery<WeatherResponse>({
    queryKey: ["weather", "current", coords],
    queryFn: () => weatherApi.getWeatherData(coords!.lat, coords!.lon),
    enabled: !!coords,
  });

  return {
    weather: weatherQuery.data,
    isLoading: weatherQuery.isLoading || (!coords && !locationError),
    isError: weatherQuery.isError || !!locationError,
    error:
      weatherQuery.error || (locationError ? new Error(locationError) : null),
    coords,
  };
};
