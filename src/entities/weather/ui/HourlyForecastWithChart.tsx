import type { HourlyForecast } from "../model/types";
import { Skeleton } from "../../../shared/ui/Skeleton";
import { Clock } from "lucide-react";
import { getWeatherIcon } from "../lib/getWeatherIcon";
import { useUnit } from "../../../features/unit-toggle/model/UnitContext";
import { clsx } from "clsx";
import { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  ChartTooltip,
  Legend,
  ChartDataLabels
);

interface HourlyForecastWithChartProps {
  data?: HourlyForecast[];
  isLoading: boolean;
}

export const HourlyForecastWithChart = ({
  data,
  isLoading,
}: HourlyForecastWithChartProps) => {
  const { convertTemp } = useUnit();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const currentHourRef = useRef<HTMLDivElement>(null);

  // 현재 시각으로 스크롤
  useEffect(() => {
    if (currentHourRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const currentElement = currentHourRef.current;

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
        <Skeleton className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
        <div className="flex gap-4 overflow-x-hidden">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton
              key={i}
              className="w-16 h-20 bg-gray-200 rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  // 현재 시간 인덱스 찾기
  const currentHour = new Date().getHours();

  // 차트 데이터 준비
  const chartData = data.map((hour) => {
    const date = new Date(hour.time);
    const hourTime = date.getHours();
    const isNow = hourTime === currentHour;

    return {
      time: isNow ? "지금" : `${hourTime}시`,
      hour: hourTime,
      temp: Math.round(convertTemp(hour.temp)),
      isCurrent: isNow,
      icon: hour.icon_code,
      description: hour.description,
    };
  });

  // 온도 범위 계산
  const temps = chartData.map((d) => d.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  // Chart.js 데이터 준비
  const chartJsData = {
    labels: chartData.map((d) => d.time),
    datasets: [
      {
        label: "온도",
        data: chartData.map((d) => d.temp),
        borderColor: "#70C1D3",
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(112, 193, 211, 0.3)");
          gradient.addColorStop(1, "rgba(112, 193, 211, 0.05)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2.5,
        pointRadius: (context: any) => {
          return chartData[context.dataIndex]?.isCurrent ? 5 : 3;
        },
        pointBackgroundColor: (context: any) => {
          return chartData[context.dataIndex]?.isCurrent ? "#70C1D3" : "#A8D5E0";
        },
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#70C1D3",
        datalabels: {
          display: true,
          anchor: "end" as const,
          align: "top" as const,
          color: (context: any) => {
            return chartData[context.dataIndex]?.isCurrent ? "#4A9DB8" : "#70C1D3";
          },
          font: {
            size: 10,
            weight: 600,
          },
          formatter: (value: number) => {
            return `${value}°`;
          },
          padding: {
            top: 4,
          },
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1f2937",
        bodyColor: "#70C1D3",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (context: any) => {
            const index = context[0].dataIndex;
            return chartData[index].time;
          },
          label: (context: any) => {
            const index = context.dataIndex;
            return `${context.parsed.y}° - ${chartData[index].description}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          color: "#6b7280",
        },
        border: {
          display: false,
        },
      },
      y: {
        min: minTemp - 2,
        max: maxTemp + 2,
        grid: {
          color: "rgba(229, 231, 235, 0.3)",
          borderDash: [3, 3],
        },
        ticks: {
          font: {
            size: 10,
          },
          color: "#6b7280",
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="glass p-6 w-full animate-spring">
      <div className="flex items-center gap-2 mb-6 text-gray-700 font-semibold text-sm">
        <Clock className="w-4 h-4" style={{ color: "#70C1D3" }} />
        <span>24시간 예보</span>
      </div>

      {/* 온도 그래프 */}
      <div className="w-full h-48 mb-6">
        <Line data={chartJsData} options={chartOptions} />
      </div>

      {/* 시간별 예보 리스트 */}
      <div className="relative">
        {/* 그래프와 리스트를 연결하는 가이드 라인 */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#A8D5E0] to-transparent opacity-40" />
        
        <div
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x -mx-2 px-2 pt-2"
        >
          {data.map((hour) => {
            const date = new Date(hour.time);
            const hourTime = date.getHours();
            const isNow = hourTime === currentHour;
            const timeStr = isNow ? "지금" : `${hourTime}:00`;
            const temp = Math.round(convertTemp(hour.temp));

            return (
              <div
                key={hour.time}
                ref={isNow ? currentHourRef : null}
                className={clsx(
                  "flex flex-col items-center gap-2.5 min-w-[75px] shrink-0 snap-center p-3.5 rounded-2xl transition-all relative group",
                  isNow
                    ? "bg-[#E8F2F5]/80 border border-[#A8D5E0]/50 shadow-sm backdrop-blur-sm"
                    : "hover:bg-[#E8F2F5]/50 border border-transparent hover:border-[#A8D5E0]/30"
                )}
              >
                {/* 그래프와 연결되는 시각적 인디케이터 */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div
                    className={clsx(
                      "w-1.5 h-1.5 rounded-full transition-all",
                      isNow
                        ? "shadow-sm"
                        : "opacity-60 group-hover:opacity-80"
                    )}
                    style={{ 
                      backgroundColor: isNow ? "#70C1D3" : "#A8D5E0",
                      boxShadow: isNow ? "0 0 8px rgba(112, 193, 211, 0.5)" : "none"
                    }}
                  />
                  <div
                    className={clsx(
                      "w-px h-1 transition-all mt-0.5",
                      isNow ? "opacity-80" : "opacity-40"
                    )}
                    style={{ backgroundColor: "#70C1D3" }}
                  />
                </div>

                <span
                  className={clsx(
                    "text-xs font-medium transition-colors mt-1",
                    isNow ? "font-semibold" : "text-gray-600"
                  )}
                  style={{ color: isNow ? "#4A9DB8" : undefined }}
                >
                  {timeStr}
                </span>

                <div className="w-14 h-14 flex items-center justify-center transition-transform group-hover:scale-110" style={{ color: "#70C1D3" }}>
                  {getWeatherIcon(hour.icon_code)}
                </div>

                <span
                  className={clsx(
                    "text-base font-semibold transition-colors",
                    isNow ? "" : "text-gray-900"
                  )}
                  style={{ color: isNow ? "#4A9DB8" : undefined }}
                >
                  {temp}°
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 온도 범위 표시 */}
      <div className="flex justify-between mt-4 text-xs pt-3 border-t border-[#A8D5E0]/30" style={{ color: "#4A9DB8" }}>
        <span>최저: {minTemp}°</span>
        <span>최고: {maxTemp}°</span>
      </div>
    </div>
  );
};
