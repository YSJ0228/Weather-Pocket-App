import { useState, useMemo, useEffect } from "react";

export const useDistrictSearch = (query: string) => {
  const [allDistricts, setAllDistricts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Load data only when needed (dynamic import)
  useEffect(() => {
    if (allDistricts.length > 0) return;

    setIsLoading(true);
    // Path is relative to the file or absolute
    import("../../../shared/assets/korea_districts.json")
      .then((module) => {
        setAllDistricts(module.default);
      })
      .catch((err) => console.error("Failed to load districts", err))
      .finally(() => setIsLoading(false));
  }, [allDistricts.length]);

  // 2. Filter logic with basic memoization
  const filteredDistricts = useMemo(() => {
    if (!query.trim() || allDistricts.length === 0) return [];

    const searchLower = query.toLowerCase().replace(/\s+/g, "");

    return allDistricts
      .filter((district) => {
        const districtClean = district.replace(/-/g, "").toLowerCase();
        return districtClean.includes(searchLower);
      })
      .slice(0, 100); // Limit results for performance
  }, [query, allDistricts]);

  return {
    districts: filteredDistricts,
    isLoading,
    totalCount: filteredDistricts.length,
  };
};

/**
 * Utility to parse the hierarchical district string
 */
export const parseDistrict = (district: string) => {
  const [province, city, village] = district.split("-");
  return {
    province: province || "",
    city: city || "",
    village: village || "",
    displayName: village || city || province,
  };
};
