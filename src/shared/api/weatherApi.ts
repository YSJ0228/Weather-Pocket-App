const BASE_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// WMO Weather interpretation codes (WW)
const getWmoDescription = (code: number) => {
  const descriptions: Record<number, string> = {
    0: "맑음",
    1: "대체로 맑음",
    2: "구름 조금",
    3: "흐림",
    45: "안개",
    48: "침착 안개",
    51: "가벼운 이슬비",
    53: "이슬비",
    55: "강한 이슬비",
    61: "약한 비",
    63: "비",
    65: "강한 비",
    71: "약한 눈",
    73: "눈",
    75: "강한 눈",
    77: "눈알갱이",
    80: "약한 소나기",
    81: "소나기",
    82: "강한 소나기",
    85: "약한 눈 소나기",
    86: "강한 눈 소나기",
    95: "뇌우",
    96: "뇌우와 우박",
    99: "심한 뇌우와 우박",
  };
  return descriptions[code] || "알 수 없음";
};

// OpenWeatherMap을 사용한 역지오코딩 폴백 함수
const getOpenWeatherMapReverseGeocoding = async (
  lat: number,
  lon: number
): Promise<string> => {
  if (!API_KEY) return "현재 위치";
  try {
    const response = await fetch(
      `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
    );
    if (!response.ok) {
      console.warn(
        `OpenWeatherMap reverse geocoding failed: ${response.status} ${response.statusText}`
      );
      return "현재 위치";
    }
    const data = await response.json();
    if (data.length === 0) return "현재 위치";
    return data[0].local_names?.ko || data[0].name || "현재 위치";
  } catch (error) {
    console.error("OpenWeatherMap reverse geocoding error:", error);
    return "현재 위치";
  }
};

export const weatherApi = {
  getWeatherData: async (lat: number, lon: number) => {
    // 1. Weather Data
    const weatherParams = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,cloud_cover",
      hourly: "temperature_2m,weather_code,precipitation_probability,uv_index",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
      timezone: "auto",
      forecast_days: "7",
      past_days: "1", // 어제 데이터 포함
    });

    // 2. Air Quality Data
    const airQualityParams = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: "pm10,pm2_5",
    });

    const [weatherRes, airRes] = await Promise.all([
      fetch(`${BASE_URL}?${weatherParams.toString()}`),
      fetch(`${AIR_QUALITY_URL}?${airQualityParams.toString()}`),
    ]);

    if (!weatherRes.ok)
      throw new Error("날씨 데이터를 가져오는 데 실패했습니다.");

    const data = await weatherRes.json();
    const airData = await airRes.json();

    const currentHourIndex = new Date().getHours();
    
    // 어제의 같은 시간대 기온 가져오기
    // Open-Meteo는 past_days: 1 설정 시 어제 00:00부터 hourly 데이터를 반환함
    // Index 0-23: 어제, Index 24-47: 오늘
    // data.hourly.temperature_2m[currentHourIndex]는 어제 이 시간 기온
    const yesterdayTemp = data.hourly.temperature_2m[currentHourIndex];
    
    // 오늘의 현재 시간 인덱스 
    const todayHourIndex = currentHourIndex + 24;

    // 좌표를 소수점 4자리로 반올림하여 일관된 ID 생성 (약 11m 정확도)
    const roundedLat = Number(lat.toFixed(4));
    const roundedLon = Number(lon.toFixed(4));

    return {
      current: {
        coord: { lat: roundedLat, lon: roundedLon },
        temp: data.current.temperature_2m,
        yesterday_temp: yesterdayTemp,
        feels_like: data.current.apparent_temperature,
        temp_min: data.daily.temperature_2m_min[1], // 인덱스 1 = 오늘
        temp_max: data.daily.temperature_2m_max[1], // 인덱스 1 = 오늘
        humidity: data.current.relative_humidity_2m,
        wind_speed: data.current.wind_speed_10m,
        description: getWmoDescription(data.current.weather_code),
        icon_code: data.current.weather_code,
        name: "",
        id: `${roundedLat}-${roundedLon}`,

        // Extended Data
        uv_index: data.hourly.uv_index[todayHourIndex] || 0,
        precip_prob:
          data.hourly.precipitation_probability[todayHourIndex] || 0,
        sunrise: data.daily.sunrise[1], // 인덱스 1 = 오늘
        sunset: data.daily.sunset[1],   // 인덱스 1 = 오늘
        cloud_cover: data.current.cloud_cover,
        air_quality: {
          pm10: airData.current ? airData.current.pm10 : 0,
          pm2_5: airData.current ? airData.current.pm2_5 : 0,
        },
      },
      // past_days: 1 설정으로 인덱스 0은 어제, 1부터 오늘
      // 오늘부터 7일간 표시 (인덱스 1~7)
      daily: data.daily.time.slice(1, 8).map((time: string, i: number) => ({
        date: time,
        temp_max: data.daily.temperature_2m_max[i + 1],
        temp_min: data.daily.temperature_2m_min[i + 1],
        icon_code: data.daily.weather_code[i + 1],
        description: getWmoDescription(data.daily.weather_code[i + 1]),
      })),
      hourly: data.hourly.time.slice(24, 48).map((time: string, i: number) => ({
        time,
        temp: data.hourly.temperature_2m[i + 24],
        icon_code: data.hourly.weather_code[i + 24],
        description: getWmoDescription(data.hourly.weather_code[i + 24]),
      })),
    };
  },

  getGeocoding: async (query: string) => {
    if (!API_KEY) throw new Error("API Key is missing.");
    const response = await fetch(
      `${GEO_URL}/direct?q=${encodeURIComponent(
        query
      )},KR&limit=1&appid=${API_KEY}`
    );
    const data = await response.json();
    if (data.length === 0) throw new Error("지역을 찾을 수 없습니다.");
    return {
      lat: data[0].lat,
      lon: data[0].lon,
      name: data[0].local_names?.ko || data[0].name,
    };
  },

  getReverseGeocoding: async (lat: number, lon: number) => {
    const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY;

    if (!KAKAO_API_KEY) {
      console.warn("Kakao API key not found, falling back to OpenWeatherMap");
      // Fallback to OpenWeatherMap if Kakao key is not set
      return await getOpenWeatherMapReverseGeocoding(lat, lon);
    }

    try {
      // Kakao Local API (Reverse Geocoding)
      const kaHeader = "os/web";
      
      const response = await fetch(
        `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}`,
        {
          headers: {
            Authorization: `KakaoAK ${KAKAO_API_KEY}`,
            KA: kaHeader,
          },
        }
      );

      // HTTP 응답 상태 코드 확인
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Kakao API HTTP Error: ${response.status} ${response.statusText}`,
          errorText
        );
        // HTTP 에러 시 OpenWeatherMap으로 폴백
        return await getOpenWeatherMapReverseGeocoding(lat, lon);
      }

      const data = await response.json();

      // 카카오 API 에러 응답 확인
      if (data.error) {
        console.error("Kakao API Error:", data.error);
        // API 에러 시 OpenWeatherMap으로 폴백
        return await getOpenWeatherMapReverseGeocoding(lat, lon);
      }

      if (!data.documents || data.documents.length === 0) {
        console.warn("Kakao geocoding failed: No documents found", data);
        return "현재 위치";
      }

      const address = data.documents[0].address;
      
      // address 객체 존재 여부 확인
      if (!address) {
        console.warn("Kakao geocoding failed: No address found", data);
        return "현재 위치";
      }

      // Priority: 동/리 > 구/군 > 시/도
      const region3 = address.region_3depth_name; // 동/리
      const region2 = address.region_2depth_name; // 구/군
      const region1 = address.region_1depth_name; // 시/도

      if (region3 && region3 !== "") {
        if (region2 && region2 !== "") {
          return `${region2} ${region3}`;
        }
        return region3;
      }

      if (region2 && region2 !== "") {
        return region2;
      }

      if (region1 && region1 !== "") {
        return region1;
      }

      return "현재 위치";
    } catch (error) {
      console.error("Kakao geocoding error:", error);
      // 네트워크 에러 등 예외 발생 시 OpenWeatherMap으로 폴백
      return await getOpenWeatherMapReverseGeocoding(lat, lon);
    }
  },
};
