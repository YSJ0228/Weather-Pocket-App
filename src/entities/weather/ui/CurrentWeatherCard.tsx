import { MapPin, Star, Droplets, CloudRain, Wind, Thermometer, ChevronUp, ChevronDown, Activity } from "lucide-react";
import { Skeleton } from "../../../shared/ui/Skeleton";
import type { WeatherData } from "../model/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getWeatherIcon } from "../lib/getWeatherIcon";
import { useUnit } from "../../../features/unit-toggle/model/UnitContext";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CurrentWeatherCardProps {
  weather?: WeatherData;
  locationName?: string;
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeatherCard = ({
  weather,
  locationName,
  isLoading,
  isError,
  error,
  isFavorite,
  onToggleFavorite,
}: CurrentWeatherCardProps) => {
  const { convertTemp, unit } = useUnit();

  if (isLoading) {
    return (
      <div className="glass p-10 w-full animate-pulse">
        <div className="flex justify-between items-start mb-12">
          <Skeleton className="w-40 h-8 bg-gray-200/50 rounded-lg" />
          <Skeleton className="w-12 h-12 rounded-full bg-gray-200/50" />
        </div>
        <div className="flex gap-12 items-center mb-12">
          <Skeleton className="w-32 h-32 rounded-3xl bg-gray-200/50" />
          <div className="space-y-4 flex-1">
            <Skeleton className="w-48 h-20 bg-gray-200/50 rounded-2xl" />
            <Skeleton className="w-32 h-8 bg-gray-200/50 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 bg-gray-200/50 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass p-8 sm:p-10 w-full border-2 border-orange-200/50 bg-orange-50/30 backdrop-blur-md rounded-3xl">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-linear-to-br from-orange-400/20 to-orange-500/20 flex items-center justify-center mb-6">
            <Activity className="w-10 h-10 text-orange-500" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-3">
            해당 장소의 정보가 제공되지 않습니다
          </h3>
          <p className="text-slate-600 text-sm leading-relaxed max-w-md">
            선택하신 위치의 날씨 정보를 가져올 수 없습니다.<br />
            다른 지역을 검색하거나 잠시 후 다시 시도해주세요.
          </p>
          {error?.message && (
            <p className="text-orange-500 text-xs mt-4 px-4 py-2 bg-orange-100/50 rounded-lg">
              {error.message}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!weather) return null;

  const tempDiff = weather.yesterday_temp !== undefined ? weather.temp - weather.yesterday_temp : 0;

  return (
    <div className="glass p-8 sm:p-10 w-full animate-spring relative overflow-hidden group">
      {/* 배경 블러 장식 - 더 은은하게 변경 */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-linear-to-br from-[#70C1D3]/5 to-transparent rounded-full blur-[100px] -mr-40 -mt-40 transition-transform duration-1000 group-hover:scale-110" />
      
      <div className="relative z-10">
        {/* 헤더 섹션 */}
        <div className="flex justify-between items-start mb-12">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 group/loc cursor-default">
              <div className="p-1.5 bg-[#70C1D3]/10 rounded-lg transition-colors group-hover/loc:bg-[#70C1D3]/20">
                <MapPin className="w-4 h-4 text-[#70C1D3]" />
              </div>
              <h1 className="text-gray-900 font-bold text-2xl tracking-tight">
                {locationName || weather.name}
              </h1>
            </div>
            <p className="text-gray-400 text-sm font-medium ml-9">
              {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })} 기준
            </p>
          </div>
          <button
            onClick={onToggleFavorite}
            className={cn(
              "p-3.5 rounded-2xl transition-all duration-300 shadow-sm border active:scale-95",
              isFavorite 
                ? "bg-[#70C1D3]/10 border-[#70C1D3]/30" 
                : "bg-white border-gray-100 hover:border-[#70C1D3]/30"
            )}
          >
            <Star 
              className={cn(
                "w-6 h-6 transition-colors",
                isFavorite ? "fill-current" : "hover:text-[#70C1D3]"
              )}
              style={isFavorite ? { color: "#70C1D3" } : { color: "rgb(209, 213, 219)" }}
            />
          </button>
        </div>

        {/* 메인 정보 섹션 - 사이드 바이 사이드 레이아웃 */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-16">
          <div className="flex items-center gap-8">
            <div className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-[0_20px_50px_rgba(112,193,211,0.3)] animate-float">
              {getWeatherIcon(weather.icon_code)}
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-8xl sm:text-9xl font-bold tracking-tighter" style={{ color: "#70C1D3" }}>
                  {convertTemp(weather.temp).toFixed(0)}°
                </span>
                <span className="text-4xl sm:text-5xl font-light text-slate-300 mb-4">{unit}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-slate-700">{weather.description}</span>
                <div className="h-4 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                <span className="text-rose-500 flex items-center gap-1">
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium text-slate-500">최고</span>
                  <span className="font-bold">{convertTemp(weather.temp_max).toFixed(0)}°</span>
                </span>
                <span className="text-blue-500 flex items-center gap-1">
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium text-slate-500">최저</span>
                  <span className="font-bold">{convertTemp(weather.temp_min).toFixed(0)}°</span>
                </span>
              </div>
              </div>
            </div>
          </div>

          {/* 어제 기온 비교 태그 */}
          {weather.yesterday_temp !== undefined && (
            <div className="bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl shadow-sm transition-transform hover:-translate-y-1">
              <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                어제보다 {" "}
                <span className={cn(
                  "text-lg font-bold tracking-tight",
                  tempDiff > 0 ? "text-rose-500" : "text-blue-500"
                )}>
                  {Math.abs(convertTemp(weather.temp) - convertTemp(weather.yesterday_temp)).toFixed(1)}°
                </span>
                <span className="text-slate-700">{tempDiff > 0 ? "높음" : "낮음"}</span>
              </p>
            </div>
          )}
        </div>

        {/* 상세 지표 그리드 - 타일 스타일 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile 
            icon={<Thermometer className="w-5 h-5" />} 
            label="체감 온도" 
            value={`${convertTemp(weather.feels_like).toFixed(0)}°`} 
            color="orange"
          />
          <StatTile 
            icon={<Droplets className="w-5 h-5" />} 
            label="습도" 
            value={`${weather.humidity}%`} 
            color="blue"
          />
          <StatTile 
            icon={<Wind className="w-5 h-5" />} 
            label="풍속" 
            value={`${weather.wind_speed}m/s`} 
            color="teal"
          />
          <StatTile 
            icon={<CloudRain className="w-5 h-5" />} 
            label="강수 확률" 
            value={`${weather.precip_prob}%`} 
            color="indigo"
          />
        </div>
      </div>
    </div>
  );
};

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'orange' | 'blue' | 'teal' | 'indigo';
}

const StatTile = ({ icon, label, value, color }: StatTileProps) => {
  const colorMap = {
    orange: "text-orange-500 bg-orange-50 border-orange-100/50",
    blue: "text-blue-500 bg-blue-50 border-blue-100/50",
    teal: "text-teal-500 bg-teal-50 border-teal-100/50",
    indigo: "text-[#70C1D3] bg-[#70C1D3]/5 border-[#70C1D3]/10"
  };

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/60 p-5 rounded-[24px] flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:bg-white/60 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1">
      <div className={cn("p-2.5 rounded-xl transition-transform group-hover:scale-110", colorMap[color])}>
        {icon}
      </div>
      <div className="text-center space-y-0.5">
        <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">{label}</p>
        <p className="text-slate-900 font-bold text-xl tracking-tight">{value}</p>
      </div>
    </div>
  );
};
