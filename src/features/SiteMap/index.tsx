"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  getWaterRefillStations,
  getShowerStations,
  getRestrooms,
  getMedicalStations,
  getAccommodations,
} from "@/lib/api";
import {
  WaterRefillStations,
  ShowerStations,
  RestRooms,
  MedicalStation,
  Accommodations,
} from "@/lib/types";
import InfoCard from "@/components/InfoCard";
import DropdownSelect from "@/components/DropdownSelect";
import CategoryButton from "./CategoryButton";

type LocationCategory =
  | "all"
  | "water_refill_stations"
  | "shower_stations"
  | "restrooms"
  | "medical_stations"
  | "accommodations";
type ShowMode = "mapShow" | "listShow";

const CATEGORIES = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "water_refill_stations",
    name: "加水站",
  },
  {
    key: "shower_stations",
    name: "洗澡點",
  },
  {
    key: "restrooms",
    name: "廁所",
  },
  {
    key: "medical_stations",
    name: "醫療站",
  },
  {
    key: "accommodations",
    name: "住宿",
  },
];

const MAP_URL = "https://guangfu250923-map.pttapp.cc/map.html";
const MAP_HEIGHT = 422;

const getMapUrl = (station: {
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  location?: string;
}) => {
  if (station.coordinates) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${station.coordinates.lat},${station.coordinates.lng}`
    )}`;
  }

  if (station.location)
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      station.location
    )}`;

  return undefined;
};

export default function SiteMap() {
  const searchParams = useSearchParams();
  const [showMode, setShowMode] = useState<ShowMode>("mapShow");
  const [selectedCategory, setSelectedCategory] =
    useState<LocationCategory>("all");
  const [waterRefillStations, setWaterRefillStations] = useState<
    WaterRefillStations[]
  >([]);
  const [showerStations, setShowerStations] = useState<ShowerStations[]>([]);
  const [restRooms, setRestRooms] = useState<RestRooms[]>([]);
  const [medicalStations, setMedicalStations] = useState<MedicalStation[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodations[]>([]);
  const [allData, setAllData] = useState<
    (
      | WaterRefillStations
      | ShowerStations
      | RestRooms
      | MedicalStation
      | Accommodations
    )[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 快取，避免重複 API 呼叫
  const [dataCache, setDataCache] = useState<{
    water_refill_stations?: WaterRefillStations[];
    shower_stations?: ShowerStations[];
    restrooms?: RestRooms[];
    medical_stations?: MedicalStation[];
    accommodations?: Accommodations[];
    all?: any[];
  }>({});

  const [loadedCategories, setLoadedCategories] = useState<
    Set<LocationCategory>
  >(new Set());

  // 處理 URL 參數
  useEffect(() => {
    const view = searchParams.get("view");
    const category = searchParams.get("category");

    if (view === "list") {
      setShowMode("listShow");
      if (category === "accommodations") {
        setSelectedCategory("accommodations");
        fetchAccommodations();
      }
    }
  }, [searchParams]);

  // 每 5 分鐘清空快取
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("自動清空快取 - 5分鐘到期");
      setDataCache({});
      setLoadedCategories(new Set());
      if (showMode === "listShow") {
        if (selectedCategory === "all") {
          fetchAll();
        } else if (selectedCategory === "water_refill_stations") {
          fetchWaterRefillStations();
        } else if (selectedCategory === "shower_stations") {
          fetchShowerStations();
        } else if (selectedCategory === "restrooms") {
          fetchRestRooms();
        } else if (selectedCategory === "medical_stations") {
          fetchMedicalStations();
        } else if (selectedCategory === "accommodations") {
          fetchAccommodations();
        }
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [showMode, selectedCategory]);

  async function fetchWaterRefillStations() {
    // 快取
    if (
      loadedCategories.has("water_refill_stations") &&
      dataCache.water_refill_stations
    ) {
      setWaterRefillStations(dataCache.water_refill_stations);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getWaterRefillStations(50, 0);
      const filteredStations = response.member.filter(
        (station) => !!station.coordinates || !!station.location
      );
      setWaterRefillStations(filteredStations);

      // 存入快取
      setDataCache((prev) => ({
        ...prev,
        water_refill_stations: filteredStations,
      }));
      setLoadedCategories((prev) => new Set(prev).add("water_refill_stations"));
    } catch (err) {
      setError("載入失敗，請稍後再試");
      console.error("fetchWaterRefillStations error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchShowerStations() {
    if (
      loadedCategories.has("shower_stations") &&
      dataCache.shower_stations
    ) {
      setShowerStations(dataCache.shower_stations);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getShowerStations(50, 0);
      const filteredStations = response.member.filter(
        (station) => !!station.coordinates || !!station.location
      );
      setShowerStations(filteredStations);

      setDataCache((prev) => ({
        ...prev,
        shower_stations: filteredStations,
      }));
      setLoadedCategories((prev) => new Set(prev).add("shower_stations"));
    } catch (err) {
      setError("載入失敗，請稍後再試");
      console.error("fetchShowerStations error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRestRooms() {
    if (loadedCategories.has("restrooms") && dataCache.restrooms) {
      setRestRooms(dataCache.restrooms);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getRestrooms(50, 0);
      const filteredStations = response.member.filter(
        (station) => !!station.coordinates || !!station.location
      );
      setRestRooms(filteredStations);

      setDataCache((prev) => ({
        ...prev,
        restrooms: filteredStations,
      }));
      setLoadedCategories((prev) => new Set(prev).add("restrooms"));
    } catch (err) {
      setError("載入失敗，請稍後再試");
      console.error("fetchRestRooms error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMedicalStations() {
    if (
      loadedCategories.has("medical_stations") &&
      dataCache.medical_stations
    ) {
      setMedicalStations(dataCache.medical_stations);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getMedicalStations(50, 0);
      const filteredStations = response.member.filter(
        (station) => !!station.coordinates || !!station.location
      );
      setMedicalStations(filteredStations);

      setDataCache((prev) => ({
        ...prev,
        medical_stations: filteredStations,
      }));
      setLoadedCategories((prev) => new Set(prev).add("medical_stations"));
    } catch (err) {
      setError("載入失敗，請稍後再試");
      console.error("fetchMedicalStations error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAccommodations() {
    if (loadedCategories.has("accommodations") && dataCache.accommodations) {
      setAccommodations(dataCache.accommodations);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getAccommodations(50, 0);
      const filteredStations = response.member.filter(
        (station) => !!station.coordinates || !!station.location
      );
      setAccommodations(filteredStations);

      setDataCache((prev) => ({
        ...prev,
        accommodations: filteredStations,
      }));
      setLoadedCategories((prev) => new Set(prev).add("accommodations"));
    } catch (err) {
      setError("載入失敗，請稍後再試");
      console.error("fetchAccommodations error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAll() {
    if (loadedCategories.has("all") && dataCache.all) {
      setAllData(dataCache.all);
      if (dataCache.water_refill_stations)
        setWaterRefillStations(dataCache.water_refill_stations);
      if (dataCache.shower_stations)
        setShowerStations(dataCache.shower_stations);
      if (dataCache.restrooms) setRestRooms(dataCache.restrooms);
      if (dataCache.medical_stations)
        setMedicalStations(dataCache.medical_stations);
      if (dataCache.accommodations) setAccommodations(dataCache.accommodations);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const [
        responseWaterRefillStations,
        responseShowerStations,
        responseRestrooms,
        responseMedicalStations,
        responseAccommodations,
      ] = await Promise.all([
        getWaterRefillStations(50, 0),
        getShowerStations(50, 0),
        getRestrooms(50, 0),
        getMedicalStations(50, 0),
        getAccommodations(50, 0),
      ]);
      setWaterRefillStations(responseWaterRefillStations.member);
      setShowerStations(responseShowerStations.member);
      setRestRooms(responseRestrooms.member);
      setMedicalStations(responseMedicalStations.member);
      setAccommodations(responseAccommodations.member);

      const combined = [
        ...responseWaterRefillStations.member,
        ...responseShowerStations.member,
        ...responseRestrooms.member,
        ...responseMedicalStations.member,
        ...responseAccommodations.member,
      ];
      const filteredStations = combined.filter(
        (station) => !!station.coordinates || !!station.location
      );
      filteredStations.sort((a, b) => a.created_at - b.created_at);
      setAllData(filteredStations);

      setDataCache({
        all: filteredStations,
        water_refill_stations: responseWaterRefillStations.member,
        shower_stations: responseShowerStations.member,
        restrooms: responseRestrooms.member,
        medical_stations: responseMedicalStations.member,
        accommodations: responseAccommodations.member,
      });
      setLoadedCategories(
        new Set([
          "all",
          "water_refill_stations",
          "shower_stations",
          "restrooms",
          "medical_stations",
          "accommodations",
        ])
      );
    } catch (err) {
      setError("載入失敗，請稍後再試");
      console.error("fetchAll error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCategoryClick = async (categoryKey: LocationCategory) => {
    setSelectedCategory(categoryKey);
    if (categoryKey === "all") {
      await fetchAll();
    } else if (categoryKey === "water_refill_stations") {
      await fetchWaterRefillStations();
    } else if (categoryKey === "shower_stations") {
      await fetchShowerStations();
    } else if (categoryKey === "restrooms") {
      await fetchRestRooms();
    } else if (categoryKey === "medical_stations") {
      await fetchMedicalStations();
    } else if (categoryKey === "accommodations") {
      await fetchAccommodations();
    }
  };

  const handleModeChange = (value: ShowMode) => {
    setShowMode(value);

    // Lazy Loading
    if (value === "listShow" && !loadedCategories.has(selectedCategory)) {
      if (selectedCategory === "all") {
        fetchAll();
      } else if (selectedCategory === "water_refill_stations") {
        fetchWaterRefillStations();
      } else if (selectedCategory === "shower_stations") {
        fetchShowerStations();
      } else if (selectedCategory === "restrooms") {
        fetchRestRooms();
      } else if (selectedCategory === "medical_stations") {
        fetchMedicalStations();
      } else if (selectedCategory === "accommodations") {
        fetchAccommodations();
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoadedCategories((prev) => {
      const newSet = new Set(prev);
      newSet.delete(selectedCategory);
      return newSet;
    });
    handleCategoryClick(selectedCategory);
  };

  const options = [
    { label: "地圖顯示", value: "mapShow" },
    { label: "列表顯示", value: "listShow" },
  ];

  return (
    <div>
      <div className="flex my-3">
        <DropdownSelect
          value={showMode}
          onChange={handleModeChange as (value: string) => void}
          options={options}
        />
        {showMode === "listShow" && (
          <div className="ml-4 flex gap-2 overflow-y-scroll [scrollbar-width:none]">
            {CATEGORIES.map(({ key, name }) => (
              <CategoryButton
                key={key}
                onClick={() => handleCategoryClick(key as LocationCategory)}
                active={selectedCategory === key}
              >
                {name}
              </CategoryButton>
            ))}
          </div>
        )}
      </div>
      <div>
        {showMode === "mapShow" && (
          <iframe
            src={MAP_URL}
            title="地圖顯示"
            width="100%"
            height={MAP_HEIGHT}
            allow="geolocation"
            sandbox="
              allow-scripts
              allow-same-origin
            "
          />
        )}
        {showMode === "listShow" && (
          <div className="space-y-4">
            {loading && (
              <div className="text-center py-8 text-[var(--gray)]">
                載入中...
              </div>
            )}

            {error && (
              <div className="text-center py-8 space-y-3">
                <div className="text-red-500">{error}</div>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  重新載入
                </button>
              </div>
            )}

            {!loading && !error && selectedCategory === "all" && (
              <>
                {allData.length === 0 ? (
                  <div className="text-center py-8 text-[var(--gray)]">
                    此分類暫無資料
                  </div>
                ) : (
                  allData.map((station) => (
                    <InfoCard
                      key={station.id}
                      name={station.name}
                      address={station.location}
                      contact={station.phone}
                      hours={station.opening_hours || ""}
                      mapUrl={getMapUrl(station)}
                      fullData={station}
                    />
                  ))
                )}
              </>
            )}

            {!loading &&
              !error &&
              selectedCategory === "water_refill_stations" && (
                <>
                  {waterRefillStations.length === 0 ? (
                    <div className="text-center py-8 text-[var(--gray)]">
                      此分類暫無資料
                    </div>
                  ) : (
                    waterRefillStations.map((station) => (
                      <InfoCard
                        key={station.id}
                        name={station.name}
                        type={station.water_type}
                        address={station.location}
                        contact={station.phone}
                        hours={station.opening_hours || ""}
                        mapUrl={getMapUrl(station)}
                        fullData={station}
                      />
                    ))
                  )}
                </>
              )}

            {!loading && !error && selectedCategory === "shower_stations" && (
              <>
                {showerStations.length === 0 ? (
                  <div className="text-center py-8 text-[var(--gray)]">
                    此分類暫無資料
                  </div>
                ) : (
                  showerStations.map((station) => (
                    <InfoCard
                      key={station.id}
                      type={station.facility_type}
                      name={station.name}
                      address={station.location}
                      contact={station.phone}
                      hours={station.time_slots || ""}
                      mapUrl={getMapUrl(station)}
                      fullData={station}
                    />
                  ))
                )}
              </>
            )}

            {!loading && !error && selectedCategory === "restrooms" && (
              <>
                {restRooms.length === 0 ? (
                  <div className="text-center py-8 text-[var(--gray)]">
                    此分類暫無資料
                  </div>
                ) : (
                  restRooms.map((station) => (
                    <InfoCard
                      key={station.id}
                      type={station.facility_type}
                      name={station.name}
                      address={station.location}
                      contact={station.phone}
                      hours={station.opening_hours || ""}
                      mapUrl={getMapUrl(station)}
                      fullData={station}
                    />
                  ))
                )}
              </>
            )}

            {!loading && !error && selectedCategory === "medical_stations" && (
              <>
                {medicalStations.length === 0 ? (
                  <div className="text-center py-8 text-[var(--gray)]">
                    此分類暫無資料
                  </div>
                ) : (
                  medicalStations.map((station) => (
                    <InfoCard
                      key={station.id}
                      type={station.station_type}
                      name={station.name}
                      address={station.location}
                      contact={station.phone}
                      hours={station.operating_hours || ""}
                      mapUrl={getMapUrl(station)}
                      fullData={station}
                    />
                  ))
                )}
              </>
            )}

            {!loading && !error && selectedCategory === "accommodations" && (
              <>
                {accommodations.length === 0 ? (
                  <div className="text-center py-8 text-[var(--gray)]">
                    此分類暫無資料
                  </div>
                ) : (
                  accommodations.map((station) => (
                    <InfoCard
                      key={station.id}
                      name={station.name}
                      address={station.location}
                      contact={station.contact_info}
                      hours={station.available_period || ""}
                      mapUrl={getMapUrl(station)}
                      fullData={station}
                    />
                  ))
                )}
              </>
            )}
          </div>
        )}
      </div>
      <br />
    </div>
  );
}
