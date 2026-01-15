import { useQuery } from "@tanstack/react-query";
import { weatherApi } from "../../../shared/api/weatherApi";
import type { WeatherResponse } from "../model/types";

interface UseWeatherProps {
  lat?: number;
  lon?: number;
  enabled?: boolean;
}

export const useWeather = ({ lat, lon, enabled = true }: UseWeatherProps) => {
  return useQuery<WeatherResponse>({
    // 쿼리 키를 개별 값으로 변경하여 React Query가 제대로 감지하도록 함
    queryKey: ["weather", "all", lat, lon],
    queryFn: () => weatherApi.getWeatherData(lat!, lon!),
    enabled: enabled && lat !== undefined && lon !== undefined && !isNaN(lat) && !isNaN(lon),
    staleTime: 5 * 60 * 1000,
    // 쿼리가 활성화될 때까지 기다리지 않고 즉시 실행
    refetchOnMount: true,
    // 쿼리 키가 변경되면 즉시 실행
    refetchOnWindowFocus: false,
  });
};
