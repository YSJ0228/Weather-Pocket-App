import { useState, useEffect } from "react";
import { getCurrentLocation, type Coordinates } from "./geolocation";

export const useGeolocation = () => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentLocation()
      .then((position) => {
        setCoords(position);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "위치 정보를 가져오는 데 실패했습니다."
        );
        setIsLoading(false);
      });
  }, []);

  return { coords, error, isLoading };
};
