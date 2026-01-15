import { useTimeFormat } from "../model/TimeFormatContext";

export const TimeFormatToggle = () => {
  const { format, toggleFormat } = useTimeFormat();

  return (
    <button
      onClick={toggleFormat}
      className="relative inline-flex items-center bg-slate-100 rounded-2xl p-1 shadow-inner hover:bg-slate-200 transition-colors overflow-hidden"
      aria-label="시간 형식 변경"
    >
      {/* 슬라이딩 배경 */}
      <div
        className={`absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-linear-to-r from-[#70C1D3] to-[#5BA9BE] rounded-xl shadow-lg shadow-[#70C1D3]/30 transition-all duration-300 ease-out ${
          format === "24h" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {/* 12시간제 버튼 */}
      <div
        className={`relative z-10 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors duration-300 ${
          format === "12h" ? "text-white" : "text-slate-500"
        }`}
      >
        12시간
      </div>

      {/* 24시간제 버튼 */}
      <div
        className={`relative z-10 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors duration-300 ${
          format === "24h" ? "text-white" : "text-slate-500"
        }`}
      >
        24시간
      </div>
    </button>
  );
};
