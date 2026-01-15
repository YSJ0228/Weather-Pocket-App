import type { ForecastDay } from "../model/types";
import { useUnit } from "../../../features/unit-toggle/model/UnitContext";
import { Skeleton } from "../../../shared/ui/Skeleton";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTooltip,
  Legend,
  Filler,
  ChartDataLabels
);

interface DailyTemperatureChartProps {
  data?: ForecastDay[];
  isLoading: boolean;
}

export const DailyTemperatureChart = ({
  data,
  isLoading,
}: DailyTemperatureChartProps) => {
  const { convertTemp } = useUnit();

  if (isLoading) {
    return (
      <div className="glass p-6 w-full">
        <Skeleton className="w-full h-48 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  // 차트 데이터 준비
  const chartData = data.map((day) => {
    const date = new Date(day.date);
    const dayName = new Intl.DateTimeFormat("ko-KR", {
      weekday: "short",
    }).format(date);

    return {
      day: dayName,
      date: day.date,
      max: Math.round(convertTemp(day.temp_max)),
      min: Math.round(convertTemp(day.temp_min)),
      range: Math.round(convertTemp(day.temp_max)) - Math.round(convertTemp(day.temp_min)),
    };
  });

  // 온도 범위 계산
  const allTemps = chartData.flatMap((d) => [d.max, d.min]);
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);

  // Chart.js 데이터 준비 (라인 그래프만)
  const chartJsData = {
    labels: chartData.map((d) => d.day),
    datasets: [
      {
        label: "최고 온도",
        data: chartData.map((d) => d.max),
        borderColor: "#70C1D3",
        backgroundColor: "#70C1D3",
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "#70C1D3",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        fill: false,
        tension: 0.4,
        datalabels: {
          display: true,
          anchor: "end" as const,
          align: "top" as const,
          color: "#70C1D3",
          font: {
            size: 11,
            weight: 600,
          },
          formatter: (value: number) => `${value}°`,
          padding: {
            top: 4,
          },
        },
      },
      {
        label: "최저 온도",
        data: chartData.map((d) => d.min),
        borderColor: "#A8D5E0",
        backgroundColor: "#A8D5E0",
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: "#A8D5E0",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        fill: false,
        tension: 0.4,
        datalabels: {
          display: true,
          anchor: "start" as const,
          align: "bottom" as const,
          color: "#4A9DB8",
          font: {
            size: 11,
            weight: 600,
          },
          formatter: (value: number) => `${value}°`,
          padding: {
            bottom: 4,
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
        bodyColor: "#374151",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: 600,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          title: (context: any) => {
            if (context && context.length > 0 && context[0].dataIndex !== undefined) {
              const index = context[0].dataIndex;
              return chartData[index]?.day || "";
            }
            return "";
          },
          label: (context: any) => {
            if (!context || context.parsed === undefined) return "";
            const datasetLabel = context.dataset?.label || "";
            const value = context.parsed.y;
            
            if (datasetLabel === "최고 온도") {
              return `최고: ${value}°`;
            } else if (datasetLabel === "최저 온도") {
              return `최저: ${value}°`;
            }
            return `${datasetLabel}: ${value}°`;
          },
          labelColor: (context: any) => {
            const color = context.dataset?.borderColor || "#70C1D3";
            return {
              borderColor: color,
              backgroundColor: color,
            };
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
            size: 11,
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
            size: 11,
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
        <span style={{ color: "#70C1D3" }}>7일 온도 범위</span>
      </div>

      <div className="w-full h-48">
        <Line data={chartJsData} options={chartOptions} />
      </div>

      <div className="flex justify-between mt-3 text-xs" style={{ color: "#4A9DB8" }}>
        <span>최저: {minTemp}°</span>
        <span>최고: {maxTemp}°</span>
      </div>
    </div>
  );
};
