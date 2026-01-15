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
      className="relative inline-flex items-center bg-slate-100 rounded-2xl p-1 shadow-inner hover:bg-slate-200 transition-colors overflow-hidden"
      aria-label="기온 단위 변경"
    >
      {/* 슬라이딩 배경 */}
      <div
        className={`absolute top-1 left-1 bottom-1 w-[calc(50%-4px)] bg-linear-to-r from-[#70C1D3] to-[#5BA9BE] rounded-xl shadow-lg shadow-[#70C1D3]/30 transition-all duration-300 ease-out ${
          unit === "F" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {/* °C 버튼 */}
      <div
        className={`relative z-10 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors duration-300 ${
          unit === "C" ? "text-white" : "text-slate-500"
        }`}
      >
        °C
      </div>

      {/* °F 버튼 */}
      <div
        className={`relative z-10 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors duration-300 ${
          unit === "F" ? "text-white" : "text-slate-500"
        }`}
      >
        °F
      </div>
    </button>
  );
};
