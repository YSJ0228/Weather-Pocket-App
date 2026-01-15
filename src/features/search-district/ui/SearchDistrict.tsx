import { useState } from "react";
import { Search, MapPin, X } from "lucide-react";
import {
  useDistrictSearch,
  parseDistrict,
} from "../../../entities/district/lib/useDistrictSearch";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SearchDistrictProps {
  onSelect: (district: string, districtInfo?: { province: string; city: string; village: string }) => void | Promise<void>;
  className?: string;
}

export const SearchDistrict = ({
  onSelect,
  className,
}: SearchDistrictProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { districts, isLoading } = useDistrictSearch(query);

  const handleSelect = async (district: string, e?: React.MouseEvent) => {
    // 이벤트 전파 방지
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const { province, city, village } = parseDistrict(district);
    
    // 검색창 닫기
    setQuery("");
    setIsFocused(false);
    
    // onSelect 호출 
    try {
      await onSelect(district, { province, city, village });
    } catch (error) {
      console.error("Error selecting district:", error);
    }
  };

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto", className)}>
      <div className="relative group">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 z-10">
          <Search 
            className={cn(
              "w-5.5 h-5.5 transition-all duration-300",
              isFocused ? "text-[#70C1D3] scale-110" : "text-slate-400"
            )} 
          />
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="지역을 검색하세요 (예: 종로구, 강남구)"
          className={cn(
            "w-full pl-14 pr-12 py-4.5 rounded-2xl bg-white/90 backdrop-blur-sm",
            "text-slate-800 text-base font-medium placeholder:text-slate-400 placeholder:font-normal",
            "border-2 transition-all duration-300 shadow-lg",
            "focus:outline-none focus:bg-white",
            isFocused 
              ? "border-[#70C1D3] shadow-[0_8px_30px_rgb(112,193,211,0.15)] scale-[1.01]" 
              : "border-slate-200/80 hover:border-slate-300 shadow-slate-200/50"
          )}
        />
        
        {query && (
          <button
            onClick={() => setQuery("")}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2",
              "p-2 rounded-xl transition-all duration-200",
              "text-slate-400 hover:text-slate-600 hover:bg-slate-100",
              "active:scale-90"
            )}
          >
            <X className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      {isFocused && (query.trim().length > 0 || isLoading) && (
        <div className={cn(
          "absolute top-full left-0 right-0 mt-3 max-h-96 overflow-hidden",
          "rounded-2xl bg-white/95 backdrop-blur-xl border-2 border-slate-200/80",
          "shadow-2xl shadow-slate-300/40 z-50",
          "animate-in fade-in slide-in-from-top-2 duration-300"
        )}>
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 mx-auto mb-3 rounded-full border-3 border-[#70C1D3]/30 border-t-[#70C1D3] animate-spin" />
                <p className="text-slate-500 text-sm font-medium">검색 중...</p>
              </div>
            ) : districts.length > 0 ? (
              <ul className="py-2">
                {districts.map((district, index) => {
                  const { province, city, village } = parseDistrict(district);
                  return (
                    <li key={district}>
                      <button
                        type="button"
                        onClick={(e) => handleSelect(district, e)}
                        onMouseDown={(e) => e.preventDefault()}
                        className={cn(
                          "w-full px-5 py-4 text-left flex items-center gap-4",
                          "transition-all duration-200 group/item relative",
                          "hover:bg-linear-to-r hover:from-[#E8F2F5] hover:to-[#F0F8FA]",
                          "active:scale-[0.99]",
                          index !== 0 && "border-t border-slate-100"
                        )}
                      >
                        <div className={cn(
                          "p-2.5 rounded-xl transition-all duration-200",
                          "bg-slate-50 group-hover/item:bg-[#70C1D3]/10",
                          "group-hover/item:scale-110"
                        )}>
                          <MapPin className="w-5 h-5 text-[#70C1D3]" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-800 text-base font-bold leading-tight truncate mb-1">
                            {village || city || province}
                          </p>
                          <p className="text-slate-500 text-xs font-medium leading-tight truncate">
                            {[province, city, village]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        </div>
                        
                        {/* Hover indicator */}
                        <div className={cn(
                          "w-1.5 h-10 rounded-full transition-all duration-200",
                          "bg-[#70C1D3] opacity-0 group-hover/item:opacity-100",
                          "absolute right-3 top-1/2 -translate-y-1/2"
                        )} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-700 text-base font-bold mb-1.5">검색 결과가 없습니다</p>
                <p className="text-slate-500 text-sm">
                  다른 검색어를 입력해 보세요
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isFocused && (
        <div
          className="fixed inset-0 bg-black/5 backdrop-blur-[2px] -z-10 animate-in fade-in duration-300"
          onClick={() => setIsFocused(false)}
        />
      )}
    </div>
  );
};
