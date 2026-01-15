import type { WeatherData } from "../model/types";
import { Sun, Cloud, Gauge, Sunrise, Sunset, Activity } from "lucide-react";
import { Skeleton } from "../../../shared/ui/Skeleton";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useTimeFormat } from "../../../features/time-format/model/TimeFormatContext";

ChartJS.register(ArcElement, ChartTooltip, Legend);

interface WeatherStatsProps {
  weather?: WeatherData;
  isLoading: boolean;
}

export const WeatherStats = ({ weather, isLoading }: WeatherStatsProps) => {
  const { formatTime: formatTimeFromContext } = useTimeFormat();

  if (isLoading) {
    return (
      <div className="glass p-6 w-full">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const stats = [
    {
      label: "자외선 지수",
      value: Math.min((weather.uv_index / 12) * 100, 100),
      displayValue: weather.uv_index.toFixed(1),
      unit: "",
      icon: Sun,
      color: "#F59E0B",
      bgColor: "bg-amber-50",
    },
    {
      label: "미세먼지(PM10)",
      value: Math.min((weather.air_quality.pm10 / 150) * 100, 100),
      displayValue: weather.air_quality.pm10.toFixed(0),
      unit: "㎍/㎥",
      icon: Activity,
      color: "#10B981",
      bgColor: "bg-emerald-50",
    },
    {
      label: "구름량",
      value: weather.cloud_cover,
      displayValue: weather.cloud_cover.toString(),
      unit: "%",
      icon: Cloud,
      color: "#64748B",
      bgColor: "bg-slate-100",
    },
  ];

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return formatTimeFromContext(date.getHours(), date.getMinutes());
    } catch (e) {
      return isoString;
    }
  };

  const renderTime = (isoString: string) => {
    const timeStr = formatTime(isoString);
    const parts = timeStr.split(" ");
    const timeOnly = parts[0];
    const period = parts[1]; // am/pm 또는 undefined

    if (period) {
      return (
        <>
          <span>{timeOnly}</span>
          <span className="text-[9px] ml-0.5">{period}</span>
        </>
      );
    }
    return <span>{timeOnly}</span>;
  };

  return (
    <div className="glass p-6 w-full animate-spring">
      <div className="flex items-center gap-2 mb-6 text-gray-700 font-semibold text-sm">
        <Gauge className="w-4 h-4" style={{ color: "#70C1D3" }} />
        <span>상세 기상 통계</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 도넛 차트 지표들 */}
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const chartData = {
            labels: [stat.label, "remainder"],
            datasets: [
              {
                data: [stat.value, 100 - stat.value],
                backgroundColor: [stat.color, "#e5e7eb"],
                borderWidth: 0,
                cutout: "75%",
              },
            ],
          };

          const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
              datalabels: { display: false },
            },
          };

          return (
            <div
              key={index}
              className={`${stat.bgColor} rounded-2xl p-4 transition-all hover:shadow-md border border-transparent hover:border-white/50`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
                <span className="text-xs font-bold text-gray-600">
                  {stat.label}
                </span>
              </div>

              <div className="relative h-24 mb-2">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-bold" style={{ color: stat.color }}>
                      {stat.displayValue}
                      <span className="text-[10px] ml-0.5 text-gray-500 font-medium">
                        {stat.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* 일출/일몰 카드 */}
        <div className="bg-[#FFE4C4]/50 rounded-2xl p-4 flex flex-col border border-orange-200/50 hover:shadow-md hover:border-orange-300/50 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <Sunrise className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-orange-900/70">일출/일몰</span>
          </div>
          
          <div className="flex gap-2 flex-1">
            {/* 일출 섹션 */}
            <div className="flex-1 bg-white/70 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-sm border border-orange-100">
              <Sunrise className="w-4 h-4 text-orange-500 mb-1" />
              <span className="text-[9px] font-black text-orange-800/50 uppercase mb-1">일출</span>
              <div className="text-[11px] font-black text-orange-900 whitespace-nowrap">{renderTime(weather.sunrise)}</div>
            </div>
            
            {/* 일몰 섹션 */}
            <div className="flex-1 bg-white/70 rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-sm border border-orange-100">
              <Sunset className="w-4 h-4 text-orange-500 mb-1" />
              <span className="text-[9px] font-black text-orange-800/50 uppercase mb-1">일몰</span>
              <div className="text-[11px] font-black text-orange-900 whitespace-nowrap">{renderTime(weather.sunset)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
