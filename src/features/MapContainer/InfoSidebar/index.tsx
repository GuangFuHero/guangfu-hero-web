'use client';

import { PLACE_CONFIG } from '@/features/MapContainer/ReactLeafletMap/place.config';
import { useAllPlaces } from '@/hooks/useMapData';
import { UserPosition } from '@/lib/types/map';
import { Place, PlaceCoordinates, PlaceCoordinatesType, PlaceType } from '@/lib/types/place';
import { formatDateRange, getGoogleMapsUrl } from '@/lib/utils';
import { useTab } from '@/providers/TabProvider';
import { RefObject } from 'react';
import Legend from './Legend';
import InfoSidebarButton from './button';

interface InfoSidebarProps {
  isOpen: boolean;
  isFullScreenMap: boolean;
  onToggleSidebarOpen: () => void;
  mapRef: RefObject<{
    getMap: () => L.Map | null;
    flyTo: (latlng: [number, number], zoom?: number | undefined) => void;
    openPopup: (latlng: [number, number], dataId: string) => void;
    updateUserLocation: (position: UserPosition, isVisible: boolean) => void;
  } | null>;
}

const getCenterCoordinates = (
  coordinates: PlaceCoordinates
): { lat: number; lng: number } | null => {
  if (!coordinates) return null;

  switch (coordinates.type) {
    case PlaceCoordinatesType.POINT:
      return { lat: coordinates.coordinates[1], lng: coordinates.coordinates[0] };

    case PlaceCoordinatesType.POLYGON:
      if (coordinates.coordinates.length === 0) return null;
      const sumLat = coordinates.coordinates.reduce((sum, point) => sum + point[1], 0);
      const sumLng = coordinates.coordinates.reduce((sum, point) => sum + point[0], 0);
      return {
        lat: sumLat / coordinates.coordinates.length,
        lng: sumLng / coordinates.coordinates.length,
      };

    case PlaceCoordinatesType.LINE_STRING:
      if (coordinates.coordinates.length === 0) return null;
      const midIndex = Math.floor(coordinates.coordinates.length / 2);
      return {
        lat: coordinates.coordinates[midIndex][1],
        lng: coordinates.coordinates[midIndex][0],
      };

    default:
      return null;
  }
};

const renderOpeningHours = (openDate?: string, endDate?: string) => {
  const displayDate = formatDateRange(openDate, endDate);

  if (!displayDate) {
    return null;
  }

  return <p className="text-xs font-medium">🕐 {displayDate}</p>;
};

export default function InfoSidebar({
  isOpen,
  isFullScreenMap,
  onToggleSidebarOpen,
  mapRef,
}: InfoSidebarProps) {
  const { activeTab } = useTab();
  const placesQuery = useAllPlaces();
  const placesData = placesQuery.data || {};

  const getPlaceDataByType = (type: PlaceType) => {
    return placesData[type] || [];
  };

  const handleItemClick = (coordinates: PlaceCoordinates, id: string) => {
    const center = getCenterCoordinates(coordinates);
    if (mapRef.current && center) {
      if (window.innerWidth <= 768) onToggleSidebarOpen();
      mapRef.current.flyTo([center.lat, center.lng], 15);
      mapRef.current.openPopup([center.lat, center.lng], id);
    }
  };

  const renderPlaceList = (placeType: PlaceType, gap = 3) => {
    const places = getPlaceDataByType(placeType);

    return (
      <div className={`space-y-${gap}`}>
        {places.map((place: Place, index: number) => {
          const googleMapsUrl = getGoogleMapsUrl(place.coordinates);

          return (
            <div
              key={place.id || index}
              className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer border-b border-gray-200"
              onClick={() => place.coordinates && handleItemClick(place.coordinates, place.id)}
            >
              <div className="flex items-center gap-1">
                <div className="flex-1 min-w-0 gap-1">
                  <h4 className="font-semibold text-gray-800 truncate ">
                    {place.name || '未知地點'}
                  </h4>
                  <p className="text-sm text-gray-600 truncate font-medium">
                    {place.address || place.address_description || '未提供地址'}
                  </p>

                  {place.coordinates ? (
                    <p className="text-xs mt-1 font-medium">
                      {place.coordinates.type === PlaceCoordinatesType.POLYGON &&
                        ` (${place.coordinates.coordinates.length} 個點)`}
                      {place.coordinates.type === PlaceCoordinatesType.LINE_STRING &&
                        ` (${place.coordinates.coordinates.length} 個節點)`}
                    </p>
                  ) : null}

                  {place.sub_type && <p className="text-xs mt-1 font-medium">{place.sub_type}</p>}
                  {place.contact_phone && (
                    <p className="text-xs font-medium">📞 {place.contact_phone}</p>
                  )}
                  {renderOpeningHours(place.open_date, place.end_date)}
                </div>

                <div className="flex flex-col gap-1 font-medium">
                  {place.coordinates && googleMapsUrl && (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                      title={
                        place.coordinates.type === PlaceCoordinatesType.POINT
                          ? '在 Google 地圖上查看'
                          : '在 Google 地圖上查看路線'
                      }
                      onClick={e => e.stopPropagation()}
                    >
                      {place.coordinates.type === PlaceCoordinatesType.POINT ? '導航' : '查看路線'}
                    </a>
                  )}

                  {place.website_url && (
                    <a
                      href={place.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-800 hover:underline text-sm font-medium"
                      title="資料來源"
                      onClick={e => e.stopPropagation()}
                    >
                      資料來源
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderAllSections = () => (
    <div className="space-y-4">
      {PLACE_CONFIG.map(config => {
        const places = getPlaceDataByType(config.type);

        if (places.length === 0) return null;

        return (
          <details key={config.type} className="border rounded-lg border-[#e5e7eb]" open>
            <summary className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
              <span className="font-semibold text-gray-700 flex items-center">
                <span
                  className="mr-2"
                  style={{
                    backgroundColor: config.color,
                    width: '25px',
                    height: '25px',
                    padding: '5px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {config.icon()}
                </span>
                {config.label}
                <span className="ml-2 text-sm text-gray-500">({places.length})</span>
              </span>
              <svg
                className="w-5 h-5 transform transition-transform details-arrow"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </summary>
            <div>{renderPlaceList(config.type, 0)}</div>
          </details>
        );
      })}
    </div>
  );

  const renderContent = () => {
    const activeConfig = PLACE_CONFIG.find(config => config.type === activeTab);

    if (activeConfig) {
      return (
        <div>
          <h3 className="text-lg font-bold mb-3">{activeConfig.label}列表</h3>
          {renderPlaceList(activeConfig.type)}
        </div>
      );
    }

    return (
      <div>
        <h3 className="text-lg font-bold mb-3">所有設施</h3>
        {renderAllSections()}
      </div>
    );
  };

  return (
    <>
      <InfoSidebarButton
        isFullScreenMap={isFullScreenMap}
        onToggleSidebarOpen={onToggleSidebarOpen}
        isSidebarOpen={isOpen}
      />
      <div className={`info-sidebar ${isOpen ? 'show' : ''}`}>
        <Legend />
        <div id="dynamicListContainer">{renderContent()}</div>
      </div>
    </>
  );
}
