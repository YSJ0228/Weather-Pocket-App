import { useState, useRef, useEffect } from "react";
import { Trash2, Edit2, Check, X } from "lucide-react";
import type { FavoriteDistrict } from "../model/types";
import { getWeatherIcon } from "../../../entities/weather/lib/getWeatherIcon";

export interface FavoriteCardProps {
  favorite: FavoriteDistrict;
  onRemove: () => void;
  onClick: () => void;
  onUpdateNickname: (newNickname: string) => void;
  currentTemp?: number;
  tempMax?: number;
  tempMin?: number;
  unit?: string;
  weatherIcon?: number;
  readonly?: boolean; // 읽기 전용 모드 (편집/삭제 버튼 숨김)
}

export const FavoriteCard = ({
  favorite,
  onRemove,
  onClick,
  onUpdateNickname,
  currentTemp,
  tempMax,
  tempMin,
  unit: _unit = "C",
  weatherIcon,
  readonly = false,
}: FavoriteCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(favorite.nickname);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== favorite.nickname) {
      onUpdateNickname(trimmedValue);
    } else {
      setEditValue(favorite.nickname);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(favorite.nickname);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };
  // readonly 모드일 때는 카드형 레이아웃
  if (readonly) {
    return (
      <div
        onClick={isEditing ? undefined : onClick}
        className="relative bg-white backdrop-blur-md border-2 border-slate-200/80 p-5 rounded-2xl group transition-all duration-300 hover:bg-white hover:border-[#70C1D3]/40 hover:shadow-xl hover:shadow-[#70C1D3]/10 hover:-translate-y-1 active:scale-[0.98]"
        style={{ cursor: isEditing ? "default" : "pointer" }}
      >
        {/* 배경 그라데이션 */}
        <div className="absolute inset-0 bg-linear-to-br from-[#70C1D3]/8 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {isEditing ? (
          /* 편집 모드 */
          <div className="relative z-10 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="flex-1 min-w-0 h-[40px] px-3 text-sm font-bold text-slate-800 bg-white border-2 border-[#70C1D3] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#70C1D3]/30"
              maxLength={30}
            />
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                className="h-[40px] w-[40px] rounded-xl text-white bg-[#70C1D3] hover:bg-[#5BA9BE] transition-all duration-200 active:scale-90 flex items-center justify-center"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="h-[40px] w-[40px] rounded-xl text-slate-500 bg-white border-2 border-slate-200 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 active:scale-90 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* 일반 모드 */
          <div className="relative z-10">
            {/* 상단: 아이콘 + 지역 이름 + 현재 온도 */}
            <div className="flex items-start justify-between gap-4 mb-3">
              {/* 왼쪽: 날씨 아이콘 */}
              <div className="shrink-0">
                {weatherIcon !== undefined ? (
                  <div className="w-10 h-10" style={{ color: "#70C1D3" }}>
                    {getWeatherIcon(weatherIcon)}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
                )}
              </div>
              
              {/* 가운데: 지역 이름 */}
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-slate-800 text-lg leading-tight wrap-break-word">
                  {favorite.nickname}
                </h3>
              </div>
              
              {/* 오른쪽: 현재 온도 */}
              <div className="shrink-0 text-right">
                {currentTemp !== undefined ? (
                  <p className="text-4xl font-black tracking-tight leading-none" style={{ color: "#70C1D3" }}>
                    {currentTemp.toFixed(0)}°
                  </p>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse animation-delay-150" />
                    <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse animation-delay-300" />
                  </div>
                )}
              </div>
            </div>
            
            {/* 하단: 최고/최저 온도 + 액션 버튼 (슬라이딩) */}
            <div className="relative">
              <div className="flex items-center justify-end transition-transform duration-300 group-hover:-translate-x-20">
                {/* 최고/최저 온도 */}
                {tempMax !== undefined && tempMin !== undefined && (
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                    <span>최고:{tempMax.toFixed(0)}°</span>
                    <span>최저:{tempMin.toFixed(0)}°</span>
                  </div>
                )}
              </div>
              
              {/* 액션 버튼 - 오른쪽에서 나타남 */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                  }}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#70C1D3] transition-all duration-200 active:scale-90"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                  className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-red-500 transition-all duration-200 active:scale-90"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 편집 가능 모드 (새로운 카드 레이아웃)
  return (
    <div
      onClick={isEditing ? undefined : onClick}
      className="relative bg-white backdrop-blur-md border-2 border-slate-200/80 p-5 rounded-2xl group transition-all duration-300 hover:bg-white hover:border-[#70C1D3]/40 hover:shadow-xl hover:shadow-[#70C1D3]/10 hover:-translate-y-1 active:scale-[0.98]"
      style={{ cursor: isEditing ? "default" : "pointer" }}
    >
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-linear-to-br from-[#70C1D3]/8 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {isEditing ? (
        /* 편집 모드 레이아웃 */
        <div className="relative z-10 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="flex-1 min-w-0 h-[42px] md:h-[48px] px-3 md:px-4 text-base md:text-lg font-bold text-slate-800 bg-white border-2 border-[#70C1D3] rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#70C1D3]/30"
            maxLength={30}
          />
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className="h-[42px] md:h-[48px] w-[42px] md:w-[48px] rounded-xl md:rounded-2xl text-white bg-[#70C1D3] hover:bg-[#5BA9BE] transition-all duration-200 active:scale-90 flex items-center justify-center"
            >
              <Check className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCancel();
              }}
              className="h-[42px] md:h-[48px] w-[42px] md:w-[48px] rounded-xl md:rounded-2xl text-slate-500 bg-white border-2 border-slate-200 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200 active:scale-90 flex items-center justify-center"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      ) : (
        /* 일반 모드 - 카드형 레이아웃 */
        <div className="relative z-10">
          {/* 상단: 아이콘 + 지역 이름 + 현재 온도 */}
          <div className="flex items-start justify-between gap-4 mb-3">
            {/* 왼쪽: 날씨 아이콘 */}
            <div className="shrink-0">
              {weatherIcon !== undefined ? (
                <div className="w-10 h-10 md:w-12 md:h-12" style={{ color: "#70C1D3" }}>
                  {getWeatherIcon(weatherIcon)}
                </div>
              ) : (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-200 animate-pulse" />
              )}
            </div>
            
            {/* 가운데: 지역 이름 */}
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-slate-800 text-lg md:text-xl leading-tight wrap-break-word">
                {favorite.nickname}
              </h3>
            </div>
            
            {/* 오른쪽: 현재 온도 */}
            <div className="shrink-0 text-right">
              {currentTemp !== undefined ? (
                <p className="text-4xl md:text-5xl font-black tracking-tight leading-none" style={{ color: "#70C1D3" }}>
                  {currentTemp.toFixed(0)}°
                </p>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse animation-delay-150" />
                  <div className="w-2 h-2 rounded-full bg-slate-300 animate-pulse animation-delay-300" />
                </div>
              )}
            </div>
          </div>
          
          {/* 하단: 최고/최저 온도 + 액션 버튼 */}
          <div className="flex items-center justify-between">
            {/* 왼쪽: 최고/최저 온도 */}
            <div>
              {tempMax !== undefined && tempMin !== undefined && (
                <div className="flex items-center gap-2 text-sm md:text-base font-bold text-slate-600">
                  <span>최고:{tempMax.toFixed(0)}°</span>
                  <span>최저:{tempMin.toFixed(0)}°</span>
                </div>
              )}
            </div>
            
            {/* 오른쪽: 액션 버튼 */}
            <div className="flex items-center gap-1 md:gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-2.5 md:p-3 rounded-xl md:rounded-2xl text-slate-300 hover:text-white hover:bg-[#70C1D3] transition-all duration-200 opacity-0 group-hover:opacity-100 active:scale-90"
              >
                <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-2.5 md:p-3 rounded-xl md:rounded-2xl text-slate-300 hover:text-white hover:bg-red-500 transition-all duration-200 opacity-0 group-hover:opacity-100 active:scale-90"
              >
                <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
