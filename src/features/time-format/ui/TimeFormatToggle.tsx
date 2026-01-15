import { useTimeFormat } from "../model/TimeFormatContext";

interface TimeFormatToggleProps {
  onToggle?: () => void;
}

export const TimeFormatToggle = ({ onToggle }: TimeFormatToggleProps) => {
  const { format, toggleFormat } = useTimeFormat();

  const handleToggle = () => {
    toggleFormat();
    onToggle?.();
  };

  return (
    <button
      onClick={handleToggle}
      className="relative inline-flex items-center bg-slate-100 rounded-xl sm:rounded-2xl p-0.5 sm:p-1 shadow-inner hover:bg-slate-200 transition-colors overflow-hidden shrink-0"
      aria-label="시간 형식 변경"
    >
      {/* 슬라이딩 배경 */}
      <div
        className={`absolute top-0.5 sm:top-1 left-0.5 sm:left-1 bottom-0.5 sm:bottom-1 w-[calc(50%-2px)] sm:w-[calc(50%-4px)] bg-linear-to-r from-[#70C1D3] to-[#5BA9BE] rounded-lg sm:rounded-xl shadow-lg shadow-[#70C1D3]/30 transition-all duration-300 ease-out ${
          format === "24h" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {/* 12시간제 버튼 */}
      <div
        className={`relative z-10 px-2.5 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-sm transition-colors duration-300 text-center whitespace-nowrap ${
          format === "12h" ? "text-white" : "text-slate-500"
        }`}
      >
        12시간
      </div>

      {/* 24시간제 버튼 */}
      <div
        className={`relative z-10 px-2.5 sm:px-6 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-sm transition-colors duration-300 text-center whitespace-nowrap ${
          format === "24h" ? "text-white" : "text-slate-500"
        }`}
      >
        24시간
      </div>
    </button>
  );
};
