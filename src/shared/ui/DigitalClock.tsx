import { useState, useEffect } from "react";
import { useTimeFormat } from "../../features/time-format/model/TimeFormatContext";

export const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  const { formatTime } = useTimeFormat();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = formatTime(time.getHours(), time.getMinutes());
  const timeParts = formattedTime.split(" ");
  const timeOnly = timeParts[0];
  const period = timeParts[1]; // am/pm 또는 undefined

  const formattedDate = time.toLocaleDateString("ko-KR", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const [day, datePart] = formattedDate.split(", ");

  return (
    <div className="flex flex-col items-center justify-center py-2 sm:py-4 lg:py-6">
      <h2 
        className="mb-2 sm:mb-3 lg:mb-4 text-white tabular-nums flex items-baseline gap-2"
        style={{
          fontSize: "6rem",
          fontWeight: 700,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        <span>{timeOnly}</span>
        {period && (
          <span 
            className="text-white/70"
            style={{
              fontSize: "2rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            {period}
          </span>
        )}
      </h2>
      <p 
        className="text-white/95 flex items-center gap-2"
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
          letterSpacing: "-0.01em",
        }}
      >
        <span>{day}</span>
        <span>{datePart}</span>
      </p>
    </div>
  );
};
