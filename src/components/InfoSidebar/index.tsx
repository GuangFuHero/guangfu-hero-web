'use client';

import { PLACE_CONFIG } from '@/components/ReactLeafletMap/place.config';
import { usePlaces } from '@/hooks/useMapData';
import { LayerType, UserPosition } from '@/types/map';
import { Place, PlaceCoordinates, PlaceCoordinatesType, PlaceType } from '@/types/place';
import { RefObject } from 'react';
import Legend from './Legend';
import Statistics from './Statistics';

interface InfoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeLayer: LayerType;
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

const getGoogleMapsUrl = (coordinates: PlaceCoordinates): string => {
  const center = getCenterCoordinates(coordinates);
  if (!center) return '';

  switch (coordinates.type) {
    case PlaceCoordinatesType.POINT:
      return `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`;

    case PlaceCoordinatesType.POLYGON:
    case PlaceCoordinatesType.LINE_STRING:
      const coordsString = coordinates.coordinates
        .map(coord => `${coord[1]},${coord[0]}`)
        .join('|');
      return `https://www.google.com/maps/dir/?api=1&waypoints=${coordsString}&travelmode=walking`;

    default:
      return `https://www.google.com/maps/search/?api=1&query=${center.lat},${center.lng}`;
  }
};

const getCoordinateTypeText = (coordinates: PlaceCoordinates): string => {
  switch (coordinates.type) {
    case PlaceCoordinatesType.POINT:
      return '地點';
    case PlaceCoordinatesType.POLYGON:
      return '區域';
    case PlaceCoordinatesType.LINE_STRING:
      return '路線';
    default:
      return '位置';
  }
};

export default function InfoSidebar({ isOpen, onClose, activeLayer, mapRef }: InfoSidebarProps) {
  const placesQuery = usePlaces();
  const placesData = placesQuery.data || {};

  const getPlaceDataByType = (type: PlaceType) => {
    return placesData[type] || [];
  };

  const handleItemClick = (coordinates: PlaceCoordinates, id: string) => {
    const center = getCenterCoordinates(coordinates);
    if (mapRef.current && center) {
      if (window.innerWidth <= 768) {
        onClose();
      }
      mapRef.current.flyTo([center.lat, center.lng], 15);
      mapRef.current.openPopup([center.lat, center.lng], id);
    }
  };

  const renderPlaceList = (placeType: PlaceType, gap = 3) => {
    const places = getPlaceDataByType(placeType);

    return (
      <div className={`space-y-${gap}`}>
        {places.map((place: Place, index: number) => {
          const coordinateType = getCoordinateTypeText(place.coordinates);
          const googleMapsUrl = getGoogleMapsUrl(place.coordinates);

          return (
            <div
              key={place.id || index}
              className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer border-b border-gray-200"
              onClick={() => place.coordinates && handleItemClick(place.coordinates, place.id)}
            >
              <div className="flex items-center gap-1">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">
                    {place.name || '未知地點'}
                  </h4>
                  <p className="text-sm text-gray-600 truncate">
                    {place.address || place.address_description || '未提供地址'}
                  </p>

                  <p className="text-xs text-blue-500 mt-1">
                    📍 {coordinateType}
                    {place.coordinates.type === PlaceCoordinatesType.POLYGON &&
                      ` (${place.coordinates.coordinates.length} 個點)`}
                    {place.coordinates.type === PlaceCoordinatesType.LINE_STRING &&
                      ` (${place.coordinates.coordinates.length} 個節點)`}
                  </p>

                  {place.sub_type && (
                    <p className="text-xs text-gray-500 mt-1">類型: {place.sub_type}</p>
                  )}
                  {place.contact_phone && (
                    <p className="text-xs text-gray-500">📞 {place.contact_phone}</p>
                  )}
                  {place.open_time && place.end_time && (
                    <p className="text-xs text-gray-500">
                      🕐 {place.open_time} - {place.end_time}
                    </p>
                  )}
                  {place.status && place.status !== 'active' && (
                    <p className="text-xs text-orange-600">狀態: {place.status}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  {place.coordinates && googleMapsUrl && (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                      title={
                        place.coordinates.type === PlaceCoordinatesType.POINT
                          ? '在 Google 地圖上查看'
                          : place.coordinates.type === PlaceCoordinatesType.POLYGON
                            ? '在 Google 地圖上查看區域'
                            : '在 Google 地圖上查看路線'
                      }
                      onClick={e => e.stopPropagation()}
                    >
                      {place.coordinates.type === PlaceCoordinatesType.POINT
                        ? '導航'
                        : place.coordinates.type === PlaceCoordinatesType.POLYGON
                          ? '查看區域'
                          : '查看路線'}
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

        return (
          <details key={config.type} className="border rounded-lg border-[#e5e7eb]" open>
            <summary className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
              <span className="font-semibold text-gray-700 flex items-center">
                <span className="mr-2" style={{ color: config.color }}>
                  {config.icon}
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
    const activeConfig = PLACE_CONFIG.find(config => config.type === activeLayer);

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
    <div className={`info-sidebar ${isOpen ? 'show' : ''}`}>
      <Legend />
      <Statistics />
      <div id="dynamicListContainer">{renderContent()}</div>
    </div>
  );
}
