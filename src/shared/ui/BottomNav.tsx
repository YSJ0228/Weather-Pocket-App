import { Cloud, MapPin, Settings } from "lucide-react";
import { clsx } from "clsx";

interface BottomNavProps {
  activeTab: "weather" | "location" | "settings";
  onChange: (tab: "weather" | "location" | "settings") => void;
}

export const BottomNav = ({ activeTab, onChange }: BottomNavProps) => {
  const tabs = [
    { id: "weather", label: "날씨", icon: Cloud },
    { id: "location", label: "위치", icon: MapPin },
    { id: "settings", label: "설정", icon: Settings },
  ] as const;

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <nav 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md glass p-2 flex justify-between items-center z-50 backdrop-blur-xl"
      style={{
        borderRadius: "9999px",
        boxShadow: "0 10px 40px rgba(112, 193, 211, 0.15), 0 0 0 1px rgba(168, 213, 224, 0.2)",
      }}
    >
      {/* 움직이는 배경 레이어 */}
      <div 
        className="absolute top-2 bottom-2 transition-all duration-500 ease-in-out"
        style={{
          width: `calc((100% - 1rem) / ${tabs.length})`,
          left: `calc(0.5rem + (${activeIndex} * (100% - 1rem) / ${tabs.length}))`,
          backgroundColor: "#70C1D3",
          borderRadius: "9999px",
          boxShadow: "0 4px 12px rgba(112, 193, 211, 0.3)",
        }}
      />

      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            "flex-1 flex flex-col items-center gap-1.5 py-3 px-3 transition-all duration-500 ease-in-out rounded-full relative z-10",
            activeTab === tab.id
              ? "text-white"
              : "text-gray-600 hover:text-gray-900"
          )}
          style={{
            transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
          }}
        >
          <tab.icon
            className={clsx(
              "w-5 h-5 transition-all duration-500 ease-in-out",
              activeTab === tab.id ? "fill-current scale-110" : "scale-100"
            )}
            style={{ transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
          <span className={clsx(
            "text-[10px] font-medium tracking-tight transition-all duration-500 ease-in-out",
            activeTab === tab.id ? "font-semibold" : ""
          )}
          style={{ transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
          >
            {tab.label}
          </span>
        </button>
      ))}
    </nav>
  );
};
