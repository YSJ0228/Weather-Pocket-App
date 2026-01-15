import type { HourlyForecast } from "../model/types";
import { Skeleton } from "../../../shared/ui/Skeleton";
import { Clock } from "lucide-react";
import { getWeatherIcon } from "../lib/getWeatherIcon";
import { useUnit } from "../../../features/unit-toggle/model/UnitContext";
import { clsx } from "clsx";
import { useRef, useEffect } from "react";

interface HourlyForecastListProps {
  data?: HourlyForecast[];
  isLoading: boolean;
}

export const HourlyForecastList = ({
  data,
  isLoading,
}: HourlyForecastListProps) => {
  const { convertTemp } = useUnit();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentHourRef = useRef<HTMLDivElement>(null);

  // 현재 시각으로 스크롤
  useEffect(() => {
    if (currentHourRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const currentElement = currentHourRef.current;
      
      // 현재 시각 요소의 위치로 스크롤
      const scrollPosition =
        currentElement.offsetLeft -
        container.offsetLeft -
        container.clientWidth / 2 +
        currentElement.clientWidth / 2;
      
      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="glass p-6 w-full overflow-hidden">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="w-4 h-4 rounded-full bg-gray-200" />
          <Skeleton className="w-32 h-4 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-4 overflow-x-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 min-w-[60px]"
            >
              <Skeleton className="w-8 h-4 bg-gray-200 rounded" />
              <Skeleton className="w-10 h-10 rounded-full bg-gray-200" />
              <Skeleton className="w-8 h-5 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div
      className="glass p-6 w-full animate-spring"
      style={{ animationDelay: "100ms" }}
    >
      <div className="flex items-center gap-2 mb-6 text-gray-700 font-semibold text-sm">
        <Clock className="w-4 h-4 text-gray-500" />
        <span>시간별 예보</span>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide snap-x"
      >
        {data.map((hour) => {
          const date = new Date(hour.time);
          const currentHour = new Date().getHours();
          const hourTime = date.getHours();
          const isNow = currentHour === hourTime;
          const timeStr = isNow ? "지금" : `${hourTime}:00`;

          return (
            <div
              key={hour.time}
              ref={isNow ? currentHourRef : null}
              className={clsx(
                "flex flex-col items-center gap-3 min-w-[65px] shrink-0 snap-center p-3 rounded-xl transition-all",
                isNow
                  ? "bg-blue-50 border border-blue-200"
                  : "hover:bg-gray-50"
              )}
            >
              <span
                className={clsx(
                  "text-xs font-medium transition-colors",
                  isNow
                    ? "text-blue-600"
                    : "text-gray-600"
                )}
              >
                {timeStr}
              </span>
              <div className="w-11 h-11 text-gray-700">
                {getWeatherIcon(hour.icon_code)}
              </div>
              <span className="text-gray-900 font-semibold text-base">
                {Math.round(convertTemp(hour.temp))}°
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
