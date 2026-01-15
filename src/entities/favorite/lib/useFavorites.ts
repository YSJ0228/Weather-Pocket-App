import { useState, useEffect } from "react";
import type { FavoriteDistrict } from "../model/types";

const STORAGE_KEY = "weather-pocket-favorites";
const MAX_FAVORITES = 6;

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteDistrict[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse favorites from localStorage", e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (
    _districtId: string,
    lat: number,
    lon: number,
    defaultNickname: string
  ) => {
    // 좌표를 소수점 4자리로 반올림하여 ID와 일치하도록 함
    const roundedLat = Number(lat.toFixed(4));
    const roundedLon = Number(lon.toFixed(4));
    const normalizedId = `${roundedLat}-${roundedLon}`;

    if (favorites.some((f) => f.id === normalizedId)) {
      throw new Error("이미 즐겨찾기에 추가된 지역입니다.");
    }

    if (favorites.length >= MAX_FAVORITES) {
      throw new Error(
        `최대 ${MAX_FAVORITES}개까지만 즐겨찾기에 추가할 수 있습니다.`
      );
    }

    const newFavorite: FavoriteDistrict = {
      id: normalizedId,
      nickname: defaultNickname,
      lat: roundedLat,
      lon: roundedLon,
      addedAt: Date.now(),
    };

    setFavorites((prev) => [newFavorite, ...prev]);
  };

  const removeFavorite = (districtId: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== districtId));
  };

  const updateNickname = (districtId: string, newNickname: string) => {
    setFavorites((prev) =>
      prev.map((f) =>
        f.id === districtId ? { ...f, nickname: newNickname } : f
      )
    );
  };

  const isFavorite = (districtIdOrLat: string | number, lon?: number) => {
    // 좌표로 전달된 경우 (lat, lon)
    if (typeof districtIdOrLat === "number" && lon !== undefined) {
      const roundedLat = Number(districtIdOrLat.toFixed(4));
      const roundedLon = Number(lon.toFixed(4));
      const normalizedId = `${roundedLat}-${roundedLon}`;
      return favorites.some((f) => f.id === normalizedId);
    }
    // ID로 전달된 경우
    return favorites.some((f) => f.id === districtIdOrLat);
  };

  const clearAll = () => {
    setFavorites([]);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    updateNickname,
    isFavorite,
    clearAll,
    isFull: favorites.length >= MAX_FAVORITES,
  };
};
