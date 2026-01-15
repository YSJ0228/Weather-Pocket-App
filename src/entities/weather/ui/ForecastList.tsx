import type { ForecastDay } from "../model/types";
import { Skeleton } from "../../../shared/ui/Skeleton";
import { Calendar } from "lucide-react";
import { getWeatherIcon } from "../lib/getWeatherIcon";
import { useUnit } from "../../../features/unit-toggle/model/UnitContext";

interface ForecastListProps {
  data?: ForecastDay[];
  isLoading: boolean;
}

export const ForecastList = ({ data, isLoading }: ForecastListProps) => {
  const { convertTemp } = useUnit();

  if (isLoading) {
    return (
      <div className="glass p-6 w-full">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="w-4 h-4 rounded-full bg-gray-200" />
          <Skeleton className="w-32 h-4 bg-gray-200 rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex justify-between items-center py-2">
              <Skeleton className="w-16 h-4 bg-gray-200 rounded" />
              <Skeleton className="w-10 h-10 rounded-full bg-gray-200" />
              <Skeleton className="w-12 h-4 bg-gray-200 rounded" />
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
      style={{ animationDelay: "200ms" }}
    >
      <div className="flex items-center gap-2 mb-6 text-gray-700 font-semibold text-sm">
        <Calendar className="w-4 h-4" style={{ color: "#70C1D3" }} />
        <span>7일 예보</span>
      </div>

      <div className="space-y-1">
        {data.map((day) => {
          const date = new Date(day.date);
          const dayName = new Intl.DateTimeFormat("ko-KR", {
            weekday: "short",
          }).format(date);
          const monthDay = new Intl.DateTimeFormat("ko-KR", {
            month: "short",
            day: "numeric",
          }).format(date);

          return (
            <div
              key={day.date}
              className="flex justify-between items-center py-3 px-3 rounded-xl hover:bg-[#E8F2F5] transition-colors group/item"
            >
              <div className="w-20">
                <p className="text-gray-900 font-semibold text-sm">{dayName}</p>
                <p className="text-gray-500 text-xs font-medium">
                  {monthDay}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-1 justify-center">
                <div className="w-9 h-9" style={{ color: "#70C1D3" }}>
                  {getWeatherIcon(day.icon_code)}
                </div>
                <span className="text-xs text-gray-600 font-medium hidden sm:block">
                  {day.description}
                </span>
              </div>

              <div className="flex gap-5 w-24 justify-end">
                <span className="font-semibold text-sm" style={{ color: "#4A9DB8" }}>
                  {Math.round(convertTemp(day.temp_max))}°
                </span>
                <span className="font-medium text-sm" style={{ color: "#A8D5E0" }}>
                  {Math.round(convertTemp(day.temp_min))}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
