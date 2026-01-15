import type { HourlyForecast } from "../model/types";
import { useUnit } from "../../../features/unit-toggle/model/UnitContext";
import { Skeleton } from "../../../shared/ui/Skeleton";
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface TemperatureChartProps {
  data?: HourlyForecast[];
  isLoading: boolean;
}

export const TemperatureChart = ({
  data,
  isLoading,
}: TemperatureChartProps) => {
  const { convertTemp } = useUnit();

  if (isLoading) {
    return (
      <div className="glass p-6 w-full">
        <Skeleton className="w-full h-48 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  // 현재 시간 인덱스 찾기
  const currentHour = new Date().getHours();
  const currentIndex = data.findIndex((hour) => {
    const date = new Date(hour.time);
    return date.getHours() === currentHour;
  });

  // 차트 데이터 준비
  const chartData = data.map((hour, index) => {
    const date = new Date(hour.time);
    const hourTime = date.getHours();
    const isNow = hourTime === currentHour;

    return {
      time: isNow ? "지금" : `${hourTime}시`,
      hour: hourTime,
      temp: Math.round(convertTemp(hour.temp)),
      isCurrent: isNow,
    };
  });

  // 온도 범위 계산
  const temps = chartData.map((d) => d.temp);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);

  // 커스텀 툴팁
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg px-3 py-2">
          <p className="text-sm font-semibold text-gray-900">
            {payload[0].payload.time}
          </p>
          <p className="text-lg font-bold text-blue-600">
            {payload[0].value}°
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass p-6 w-full animate-spring">
      <div className="flex items-center gap-2 mb-6 text-gray-700 font-semibold text-sm">
        <span>24시간 온도 변화</span>
      </div>

      <div className="w-full h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              opacity={0.3}
              vertical={false}
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              interval={3}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#6b7280" }}
              domain={[minTemp - 2, maxTemp + 2]}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            {currentIndex >= 0 && (
              <ReferenceLine
                x={chartData[currentIndex]?.time}
                stroke="#3b82f6"
                strokeDasharray="2 2"
                opacity={0.5}
              />
            )}
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fill="url(#colorTemp)"
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                if (payload.isCurrent) {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill="#3b82f6"
                      stroke="#fff"
                      strokeWidth={2}
                      className="animate-pulse"
                    />
                  );
                }
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={2.5}
                    fill="#60a5fa"
                    opacity={0.6}
                  />
                );
              }}
              activeDot={{ r: 5, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between mt-3 text-xs text-gray-400">
        <span>최저: {minTemp}°</span>
        <span>최고: {maxTemp}°</span>
      </div>
    </div>
  );
};
