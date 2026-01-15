import { useState, useEffect } from "react";
import { useQueries } from "@tanstack/react-query";
import { UnitToggle } from "../../../features/unit-toggle/ui/UnitToggle";
import { TimeFormatToggle } from "../../../features/time-format/ui/TimeFormatToggle";
import { SearchDistrict } from "../../../features/search-district/ui/SearchDistrict";
import { CurrentWeatherCard } from "../../../entities/weather/ui/CurrentWeatherCard";
import { FavoriteCard } from "../../../entities/favorite/ui/FavoriteCard";
import { ForecastList } from "../../../entities/weather/ui/ForecastList";
import { HourlyForecastWithChart } from "../../../entities/weather/ui/HourlyForecastWithChart";
import { DailyTemperatureChart } from "../../../entities/weather/ui/DailyTemperatureChart";
import { WeatherStats } from "../../../entities/weather/ui/WeatherStats";
import { useWeather } from "../../../entities/weather/lib/useWeather";
import { useGeolocation } from "../../../shared/lib/useGeolocation";
import { useFavorites } from "../../../entities/favorite/lib/useFavorites";
import { weatherApi } from "../../../shared/api/weatherApi";
import { Star, MapPin, X, Trash2 } from "lucide-react";
import type { Coordinates } from "../../../shared/lib/geolocation";
import { DigitalClock } from "../../../shared/ui/DigitalClock";
import { BottomNav } from "../../../shared/ui/BottomNav";
import { ConfirmModal } from "../../../shared/ui/ConfirmModal";
import { Toast } from "../../../shared/ui/Toast";
import { useDynamicBackground } from "../../../shared/lib/useDynamicBackground";
import { useUnit } from "../../../features/unit-toggle/model/UnitContext";

export const WeatherDashboard = () => {
  const { coords: browserCoords, isLoading: isGeoLoading } = useGeolocation();
  const [activeCoords, setActiveCoords] = useState<Coordinates | null>(null);
  const [activeLocationName, setActiveLocationName] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "weather" | "location" | "settings"
  >("weather");
  const [isFavoritePanelOpen, setIsFavoritePanelOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: "success" | "error" | "info" | "edit" }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const { favorites, addFavorite, removeFavorite, updateNickname, isFavorite, clearAll } = useFavorites();
  const { convertTemp, unit } = useUnit();

  const favoriteWeatherQueries = useQueries({
    queries: favorites.map((fav) => ({
      queryKey: ["weather", "favorite", fav.lat, fav.lon],
      queryFn: () => weatherApi.getWeatherData(fav.lat, fav.lon),
      staleTime: 5 * 60 * 1000,
      enabled: !!fav.lat && !!fav.lon,
    })),
  });

  // 1. Initial sync: When browser location is obtained, set it as active if none is set
  useEffect(() => {
    const initLocation = async () => {
      if (browserCoords && !activeCoords) {
        setActiveCoords(browserCoords);
        try {
          const name = await weatherApi.getReverseGeocoding(
            browserCoords.lat,
            browserCoords.lon
          );
          setActiveLocationName(name || "현재 위치");
        } catch (err) {
          console.error("Reverse geocoding failed", err);
          setActiveLocationName("현재 위치");
        }
      }
    };
    initLocation();
  }, [browserCoords, activeCoords]);

  const handleBackToCurrent = async () => {
    if (!browserCoords) return;
    setActiveCoords(browserCoords);
    try {
      const name = await weatherApi.getReverseGeocoding(
        browserCoords.lat,
        browserCoords.lon
      );
      setActiveLocationName(name || "현재 위치");
    } catch (err) {
      console.error("Back to current location failed", err);
      setActiveLocationName("현재 위치");
    }
  };

  const handleRemoveFavorite = (id: string) => {
    removeFavorite(id);
    setToast({
      isOpen: true,
      message: "즐겨찾기에서 제거되었습니다",
      type: "info",
    });
  };

  const handleUpdateNickname = (id: string, newNickname: string) => {
    updateNickname(id, newNickname);
    setToast({
      isOpen: true,
      message: "지역명이 수정되었습니다",
      type: "edit",
    });
  };

  // 2. Main weather query for active coordinates (includes daily and hourly)
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    isError,
    error,
  } = useWeather({
    lat: activeCoords?.lat,
    lon: activeCoords?.lon,
    // 좌표가 유효하면 즉시 쿼리 실행 (isSearching 조건 제거)
    enabled: !!activeCoords && 
            activeCoords.lat !== undefined && 
            activeCoords.lon !== undefined &&
            !isNaN(activeCoords.lat) &&
            !isNaN(activeCoords.lon),
  });

  const handleSelectDistrict = async (
    districtId: string,
    districtInfo?: { province: string; city: string; village: string }
  ): Promise<void> => {
    try {
      setIsSearching(true);
      
      // 지역 정보 파싱 (districtInfo가 있으면 사용, 없으면 파싱)
      let province = "";
      let city = "";
      let village = "";
      
      if (districtInfo) {
        province = districtInfo.province;
        city = districtInfo.city;
        village = districtInfo.village;
      } else {
        const parts = districtId.split("-");
        province = parts[0] || "";
        city = parts[1] || "";
        village = parts[2] || "";
      }
      
      // 검색 쿼리: 동/리 > 구/군 > 시/도 순서로 우선순위
      const query = village || city || province;
      
      if (!query) {
        throw new Error("검색할 지역명이 없습니다.");
      }
      
      // 임시로 파싱된 지역명 표시 (더 읽기 쉽게)
      let tempLocationName = "";
      if (village && city) {
        tempLocationName = `${city} ${village}`;
      } else if (city) {
        tempLocationName = city;
      } else if (province) {
        tempLocationName = province;
      } else {
        tempLocationName = query;
      }
      setActiveLocationName(tempLocationName);

      // Geocoding으로 좌표 가져오기
      const coords = await weatherApi.getGeocoding(query);
      
      if (!coords || !coords.lat || !coords.lon) {
        throw new Error("좌표를 가져올 수 없습니다.");
      }
      
      const newCoords = { lat: coords.lat, lon: coords.lon };
      setActiveCoords(newCoords);
      setIsSearching(false);
      
      weatherApi.getReverseGeocoding(coords.lat, coords.lon)
        .then((accurateName) => {
          if (accurateName && accurateName !== "현재 위치") {
            setActiveLocationName(accurateName);
          }
        })
        .catch(() => {});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류";
      alert(`해당 지역의 좌표를 찾을 수 없습니다: ${errorMessage}\n다른 검색어를 시도해보세요.`);
      setActiveLocationName("검색 실패");
      setIsSearching(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!weatherData) return;
    const { current } = weatherData;
    const districtId = current.id;
    if (isFavorite(districtId)) {
      removeFavorite(districtId);
      setToast({
        isOpen: true,
        message: "즐겨찾기에서 제거되었습니다",
        type: "info",
      });
    } else {
      try {
        addFavorite(
          districtId,
          current.coord.lat,
          current.coord.lon,
          activeLocationName || current.name
        );
        setToast({
          isOpen: true,
          message: "즐겨찾기에 추가되었습니다",
          type: "success",
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "즐겨찾기 추가에 실패했습니다.";
        setToast({
          isOpen: true,
          message: errorMessage,
          type: "error",
        });
      }
    }
  };

  const isLoading = isGeoLoading || isWeatherLoading || isSearching;
  const backgroundClass = useDynamicBackground(weatherData?.current.icon_code);

  return (
    <div
      className={`fixed inset-0 overflow-y-auto transition-all duration-700 ${backgroundClass}`}
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col min-h-full pb-32 px-4 sm:px-6">
        {activeTab === "weather" && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* 시계와 모바일 즐겨찾기 버튼 */}
            <div className="relative flex items-center justify-center">
              <DigitalClock />
              
              {/* 모바일/태블릿 즐겨찾기 버튼 - lg 이상에서는 숨김 */}
              <div className="lg:hidden absolute right-4 md:right-6 top-1/2 -translate-y-1/2">
                <button
                  onClick={() => setIsFavoritePanelOpen(true)}
                  className="relative p-3 md:p-3.5 rounded-xl md:rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-white/40 shadow-lg hover:shadow-xl transition-all active:scale-95"
                >
                  <Star className="w-5 h-5 md:w-6 md:h-6 fill-current" style={{ color: "#70C1D3" }} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-red-500 text-white text-xs md:text-sm font-bold rounded-full flex items-center justify-center shadow-md">
                      {favorites.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* 메인 콘텐츠와 즐겨찾기를 분리된 구조로 배치 */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:items-start lg:overflow-visible">
              {/* 메인 콘텐츠 영역 - 스크롤 가능 */}
              <div className="flex-1 flex flex-col gap-6 md:gap-8 min-w-0 w-full">
                <main className="flex flex-col gap-6 md:gap-8">
                  <section>
                    {activeCoords &&
                      browserCoords &&
                      (activeCoords.lat !== browserCoords.lat ||
                        activeCoords.lon !== browserCoords.lon) && (
                        <button
                          onClick={handleBackToCurrent}
                          className="mb-4 md:mb-5 text-xs md:text-sm bg-white hover:bg-[#E8F2F5] text-gray-700 py-2.5 md:py-3 px-5 md:px-6 rounded-full flex items-center gap-2 transition-all mx-auto shadow-sm border font-medium"
                          style={{ borderColor: "#A8D5E0" }}
                        >
                          <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: "#70C1D3" }} /> 내 현위치 날씨 보기
                        </button>
                      )}

                    <CurrentWeatherCard
                      weather={weatherData?.current}
                      locationName={activeLocationName}
                      isLoading={isLoading}
                      isError={isError}
                      error={error}
                      isFavorite={
                        weatherData ? isFavorite(weatherData.current.id) : false
                      }
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </section>

                  <section>
                    <HourlyForecastWithChart
                      data={weatherData?.hourly}
                      isLoading={isLoading}
                    />
                  </section>

                  <section>
                    <ForecastList data={weatherData?.daily} isLoading={isLoading} />
                  </section>

                  <section>
                    <DailyTemperatureChart
                      data={weatherData?.daily}
                      isLoading={isLoading}
                    />
                  </section>

                  <section>
                    <WeatherStats
                      weather={weatherData?.current}
                      isLoading={isLoading}
                    />
                  </section>
                </main>
              </div>

              {/* 즐겨찾기 사이드바 - 데스크톱에서만 표시 */}
              <aside className="hidden lg:block lg:w-80 lg:shrink-0 lg:order-last lg:sticky lg:top-6 lg:self-start lg:h-fit">
                <div className="glass p-5 sm:p-6 rounded-[28px] border-2 border-white/40 shadow-xl shadow-slate-200/30 overflow-visible">
                    {/* 헤더 */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-[#70C1D3]/10 rounded-xl">
                          <Star className="w-5 h-5 fill-current" style={{ color: "#70C1D3" }} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                          즐겨찾기
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                        <span className="text-sm font-bold" style={{ color: "#70C1D3" }}>{favorites.length}</span>
                        <span className="text-xs font-medium text-slate-400">/</span>
                        <span className="text-xs font-medium text-slate-400">6</span>
                      </div>
                    </div>
                    
                    {/* 카드 리스트 - 목록 형식 */}
                    {favorites.length > 0 ? (
                      <div className="space-y-3 py-1 lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto lg:pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        {favorites.map((fav, index) => {
                          const weatherData = favoriteWeatherQueries[index]?.data;
                          const currentTemp = weatherData?.current?.temp;
                          const tempMax = weatherData?.current?.temp_max;
                          const tempMin = weatherData?.current?.temp_min;
                          const weatherIcon = weatherData?.current?.icon_code;
                          
                          return (
                            <FavoriteCard
                              key={fav.id}
                              favorite={fav}
                              currentTemp={currentTemp ? convertTemp(currentTemp) : undefined}
                              tempMax={tempMax ? convertTemp(tempMax) : undefined}
                              tempMin={tempMin ? convertTemp(tempMin) : undefined}
                              unit={unit}
                              weatherIcon={weatherIcon}
                              onRemove={() => handleRemoveFavorite(fav.id)}
                              onUpdateNickname={(newNickname) => handleUpdateNickname(fav.id, newNickname)}
                              onClick={() => {
                                setActiveCoords({ lat: fav.lat, lon: fav.lon });
                                setActiveLocationName(fav.nickname);
                              }}
                              readonly={true}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-16 px-4">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-[#70C1D3]/10 to-[#A8D5E0]/10 flex items-center justify-center">
                          <Star className="w-10 h-10" style={{ color: "#70C1D3" }} />
                        </div>
                        <p className="text-base font-bold text-slate-700 mb-1.5">
                          즐겨찾기가 비어있어요
                        </p>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          위치 탭에서 자주 보는<br />지역을 즐겨찾기에 추가하세요
                        </p>
                      </div>
                    )}
                  </div>
              </aside>
            </div>
          </div>
        )}

        {activeTab === "location" && (
          <div className="flex flex-col gap-8 px-4 sm:px-6 pt-8 sm:pt-12 pb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <header className="text-center space-y-3 max-w-2xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                지역 검색
              </h1>
              <p className="text-white/90 text-base font-medium leading-relaxed drop-shadow-sm">
                원하는 지역을 검색하고<br className="sm:hidden" /> 즐겨찾기에 추가하세요
              </p>
            </header>

            {/* Search Input */}
            <SearchDistrict
              onSelect={async (id, districtInfo) => {
                try {
                  setActiveTab("weather");
                  handleSelectDistrict(id, districtInfo).catch(() => {
                    alert("지역을 선택하는 중 오류가 발생했습니다. 다시 시도해주세요.");
                  });
                } catch (error) {
                  alert("지역을 선택하는 중 오류가 발생했습니다. 다시 시도해주세요.");
                }
              }}
            />

            {/* Favorites Section */}
            <section className="max-w-2xl mx-auto w-full">
              <div className="glass p-6 sm:p-8 rounded-3xl border-2 border-white/40 shadow-2xl shadow-slate-300/30 overflow-visible">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-7">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#70C1D3]/10 rounded-xl shadow-sm">
                      <Star className="w-5.5 h-5.5 fill-current" style={{ color: "#70C1D3" }} />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
                        즐겨찾기
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">
                        최대 6개까지 추가 가능
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 bg-linear-to-r from-slate-50 to-slate-100 px-4 py-2 rounded-xl border border-slate-200/80 shadow-sm">
                      <span className="text-base font-black text-[#70C1D3]">{favorites.length}</span>
                      <span className="text-sm font-medium text-slate-400">/</span>
                      <span className="text-sm font-bold text-slate-500">6</span>
                    </div>
                    {favorites.length > 0 && (
                      <button
                        onClick={() => setIsDeleteAllModalOpen(true)}
                        className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-90 shadow-sm"
                        title="전체 삭제"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Favorites List */}
                {favorites.length > 0 ? (
                  <div className="space-y-3 py-1">
                    {favorites.map((fav, index) => {
                      const weatherData = favoriteWeatherQueries[index]?.data;
                      const currentTemp = weatherData?.current?.temp;
                      const tempMax = weatherData?.current?.temp_max;
                      const tempMin = weatherData?.current?.temp_min;
                      const weatherIcon = weatherData?.current?.icon_code;
                      
                      return (
                        <FavoriteCard
                          key={fav.id}
                          favorite={fav}
                          currentTemp={currentTemp ? convertTemp(currentTemp) : undefined}
                          tempMax={tempMax ? convertTemp(tempMax) : undefined}
                          tempMin={tempMin ? convertTemp(tempMin) : undefined}
                          unit={unit}
                          weatherIcon={weatherIcon}
                          onRemove={() => handleRemoveFavorite(fav.id)}
                          onUpdateNickname={(newNickname) => handleUpdateNickname(fav.id, newNickname)}
                          onClick={() => {
                            setActiveCoords({ lat: fav.lat, lon: fav.lon });
                            setActiveLocationName(fav.nickname);
                            setActiveTab("weather");
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 px-6">
                    <div className="w-24 h-24 mx-auto mb-5 rounded-2xl bg-linear-to-br from-[#70C1D3]/10 via-[#A8D5E0]/10 to-[#70C1D3]/5 flex items-center justify-center shadow-inner">
                      <Star className="w-12 h-12" style={{ color: "#70C1D3" }} />
                    </div>
                    <p className="text-lg font-black text-slate-800 mb-2">
                      즐겨찾기가 비어있어요
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      자주 보는 지역을 검색해서<br />즐겨찾기에 추가하세요
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="flex flex-col gap-8 sm:gap-10 px-4 sm:px-6 pt-6 sm:pt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="text-center space-y-3 max-w-2xl mx-auto">
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                설정
              </h1>
              <p className="text-white/90 text-base font-medium leading-relaxed drop-shadow-sm">
                앱 환경을 설정하세요
              </p>
            </header>

            <section className="glass p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900">기온 단위</h4>
                  <p className="text-xs text-gray-500 mt-0.5">
                    선호하는 기온 단위를 선택하세요
                  </p>
                </div>
                <UnitToggle />
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">시간 형식</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      12시간제 또는 24시간제를 선택하세요
                    </p>
                  </div>
                  <TimeFormatToggle />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 text-center tracking-wider">
                  Weather Pocket v1.0.0
                </p>
              </div>
            </section>
          </div>
        )}

        <BottomNav activeTab={activeTab} onChange={setActiveTab} />

        {/* 모바일 즐겨찾기 슬라이드 패널 - lg 이상에서는 숨김 */}
        {isFavoritePanelOpen && (
          <>
            {/* 백드롭 */}
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-60 lg:hidden animate-in fade-in duration-300"
              onClick={() => setIsFavoritePanelOpen(false)}
            />
            
            {/* 슬라이드 패널 */}
            <div className="fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm md:max-w-md bg-white z-70 lg:hidden shadow-2xl animate-in slide-in-from-right duration-300">
              {/* 패널 헤더 */}
              <div className="flex items-center justify-between p-5 md:p-7 border-b border-slate-200">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2 md:p-2.5 bg-[#70C1D3]/10 rounded-xl md:rounded-2xl">
                    <Star className="w-5 h-5 md:w-6 md:h-6 fill-current" style={{ color: "#70C1D3" }} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                      즐겨찾기
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                      {favorites.length} / 6
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {favorites.length > 0 && (
                    <button
                      onClick={() => setIsDeleteAllModalOpen(true)}
                      className="p-2 md:p-2.5 rounded-xl md:rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 active:scale-90 shadow-sm"
                      title="전체 삭제"
                    >
                      <Trash2 className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsFavoritePanelOpen(false)}
                    className="p-2 md:p-2.5 rounded-xl md:rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all active:scale-90"
                  >
                    <X className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>

              {/* 패널 콘텐츠 */}
              <div className="overflow-y-auto h-[calc(100vh-81px)] md:h-[calc(100vh-97px)] p-5 md:p-7">
                {favorites.length > 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    {favorites.map((fav, index) => {
                      const weatherData = favoriteWeatherQueries[index]?.data;
                      const currentTemp = weatherData?.current?.temp;
                      const tempMax = weatherData?.current?.temp_max;
                      const tempMin = weatherData?.current?.temp_min;
                      const weatherIcon = weatherData?.current?.icon_code;
                      
                      return (
                        <FavoriteCard
                          key={fav.id}
                          favorite={fav}
                          currentTemp={currentTemp ? convertTemp(currentTemp) : undefined}
                          tempMax={tempMax ? convertTemp(tempMax) : undefined}
                          tempMin={tempMin ? convertTemp(tempMin) : undefined}
                          unit={unit}
                          weatherIcon={weatherIcon}
                          onRemove={() => handleRemoveFavorite(fav.id)}
                          onUpdateNickname={(newNickname) => handleUpdateNickname(fav.id, newNickname)}
                          onClick={() => {
                            setActiveCoords({ lat: fav.lat, lon: fav.lon });
                            setActiveLocationName(fav.nickname);
                            setIsFavoritePanelOpen(false);
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 md:py-28 px-4 md:px-6">
                    <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-full bg-linear-to-br from-[#70C1D3]/10 to-[#A8D5E0]/10 flex items-center justify-center">
                      <Star className="w-10 h-10 md:w-12 md:h-12" style={{ color: "#70C1D3" }} />
                    </div>
                    <p className="text-base md:text-lg font-bold text-slate-700 mb-1.5 md:mb-2">
                      즐겨찾기가 비어있어요
                    </p>
                    <p className="text-sm md:text-base text-slate-400 leading-relaxed">
                      위치 탭에서 자주 보는<br />지역을 즐겨찾기에 추가하세요
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* 전체 삭제 확인 모달 */}
        <ConfirmModal
          isOpen={isDeleteAllModalOpen}
          onClose={() => setIsDeleteAllModalOpen(false)}
          onConfirm={() => {
            clearAll();
            setIsFavoritePanelOpen(false);
            setIsDeleteAllModalOpen(false);
            setToast({
              isOpen: true,
              message: "모든 즐겨찾기가 삭제되었습니다",
              type: "info",
            });
          }}
          title="즐겨찾기 전체 삭제"
          message="모든 즐겨찾기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          confirmText="삭제"
          cancelText="취소"
        />

        {/* Toast 알림 */}
        <Toast
          isOpen={toast.isOpen}
          onClose={() => setToast({ ...toast, isOpen: false })}
          message={toast.message}
          type={toast.type}
        />
      </div>
    </div>
  );
};
