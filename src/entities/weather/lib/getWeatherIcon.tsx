import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  Snowflake,
  CloudFog,
  CloudDrizzle,
} from "lucide-react";

// Map WMO codes to Lucide Icons
export const getWeatherIcon = (code: number) => {
  if (code === 0) return <Sun className="w-full h-full text-yellow-400" />;
  if (code <= 3) return <Cloud className="w-full h-full text-slate-400" />;
  if (code <= 48) return <CloudFog className="w-full h-full text-slate-300" />;
  if (code <= 55)
    return <CloudDrizzle className="w-full h-full text-blue-300" />;
  if (code <= 65) return <CloudRain className="w-full h-full text-blue-400" />;
  if (code <= 77) return <Snowflake className="w-full h-full text-blue-100" />;
  if (code <= 82) return <CloudRain className="w-full h-full text-blue-500" />;
  if (code <= 86) return <Snowflake className="w-full h-full text-blue-200" />;
  if (code <= 99)
    return <CloudLightning className="w-full h-full text-yellow-500" />;
  return <Cloud className="w-full h-full text-slate-400" />;
};
