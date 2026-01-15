export interface FavoriteDistrict {
  id: string; // Format: "위도-경도" (소수점 4자리, 예: "37.5665-126.9780")
  nickname: string; // 사용자 지정 별칭
  lat: number;
  lon: number;
  addedAt: number; // Timestamp
}
