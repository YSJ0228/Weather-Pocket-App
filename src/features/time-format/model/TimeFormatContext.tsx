import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type TimeFormat = "12h" | "24h";

interface TimeFormatContextType {
  format: TimeFormat;
  toggleFormat: () => void;
  formatTime: (hour: number, minute: number) => string;
}

const TimeFormatContext = createContext<TimeFormatContextType | undefined>(
  undefined
);

export const TimeFormatProvider = ({ children }: { children: ReactNode }) => {
  const [format, setFormat] = useState<TimeFormat>(() => {
    const stored = localStorage.getItem("time-format");
    return (stored as TimeFormat) || "24h";
  });

  useEffect(() => {
    localStorage.setItem("time-format", format);
  }, [format]);

  const toggleFormat = () => {
    setFormat((prev) => (prev === "12h" ? "24h" : "12h"));
  };

  const formatTime = (hour: number, minute: number): string => {
    const minuteStr = minute.toString().padStart(2, "0");
    
    if (format === "12h") {
      const period = hour >= 12 ? "pm" : "am";
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minuteStr} ${period}`;
    } else {
      const hourStr = hour.toString().padStart(2, "0");
      return `${hourStr}:${minuteStr}`;
    }
  };

  return (
    <TimeFormatContext.Provider value={{ format, toggleFormat, formatTime }}>
      {children}
    </TimeFormatContext.Provider>
  );
};

export const useTimeFormat = () => {
  const context = useContext(TimeFormatContext);
  if (!context) {
    throw new Error("useTimeFormat must be used within TimeFormatProvider");
  }
  return context;
};
