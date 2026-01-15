import { useUnit } from "../model/UnitContext";

interface UnitToggleProps {
  onToggle?: () => void;
}

export const UnitToggle = ({ onToggle }: UnitToggleProps) => {
  const { unit, toggleUnit } = useUnit();

  const handleToggle = () => {
    toggleUnit();
    onToggle?.();
  };

  return (
    <button
      onClick={handleToggle}
      className="relative inline-flex items-center bg-slate-100 rounded-xl sm:rounded-2xl p-0.5 sm:p-1 shadow-inner hover:bg-slate-200 transition-colors overflow-hidden shrink-0"
      aria-label="기온 단위 변경"
    >
      {/* 슬라이딩 배경 */}
      <div
        className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 bottom-0.5 sm:bottom-1 w-[calc(50%-2px)] sm:w-[calc(50%-4px)] bg-linear-to-r from-[#70C1D3] to-[#5BA9BE] rounded-lg sm:rounded-xl shadow-lg shadow-[#70C1D3]/30 transition-all duration-300 ease-out ${
          unit === "F" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {/* °C 버튼 */}
      <div
        className={`relative z-10 px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-colors duration-300 text-center ${
          unit === "C" ? "text-white" : "text-slate-500"
        }`}
      >
        °C
      </div>

      {/* °F 버튼 */}
      <div
        className={`relative z-10 px-3 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-colors duration-300 text-center ${
          unit === "F" ? "text-white" : "text-slate-500"
        }`}
      >
        °F
      </div>
    </button>
  );
};
