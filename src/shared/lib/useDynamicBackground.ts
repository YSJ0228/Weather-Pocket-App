import { useMemo } from "react";

/**
 * Maps WMO weather codes to CSS gradient backgrounds.
 * Inspired by the provided reference images.
 */
export const useDynamicBackground = (code: number | undefined) => {
  return useMemo(() => {
    // Main color theme - #70C1D3 based
    if (code === undefined) return "bg-gradient-to-br from-[#D4E8ED] via-[#E8F2F5] to-[#F0F8FA]";

    // Clear sky - bright cyan
    if (code === 0)
      return "bg-gradient-to-br from-[#A8D5E0] via-[#B8DDE5] to-[#C8E5EA]";

    // Partly cloudy / Clouds - soft cyan-blue
    if (code >= 1 && code <= 3)
      return "bg-gradient-to-br from-[#B8DDE5] via-[#C8E5EA] to-[#D4E8ED]";

    // Fog - light cyan-gray
    if (code === 45 || code === 48)
      return "bg-gradient-to-br from-[#C8E5EA] via-[#D4E8ED] to-[#E0EBEE]";

    // Drizzle / Rain - cool cyan-blue
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      return "bg-gradient-to-br from-[#9BC8D5] via-[#A8D5E0] to-[#B8DDE5]";
    }

    // Snow - bright cyan-white
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
      return "bg-gradient-to-br from-[#B8DDE5] via-[#D4E8ED] to-white";
    }

    // Thunderstorm - deep cyan
    if (code >= 95)
      return "bg-gradient-to-br from-[#7AB3C5] via-[#8BC0D0] to-[#9BC8D5]";

    return "bg-gradient-to-br from-[#D4E8ED] via-[#E8F2F5] to-[#F0F8FA]";
  }, [code]);
};
