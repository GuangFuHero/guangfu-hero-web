'use client';

import {
  useAccommodations,
  useMedicalStations,
  useRestrooms,
  useShowerStations,
  useWaterStations,
} from '@/hooks/useMapData';
import { LayerType } from '@/types/map';
import Legend from './Legend';
import Statistics from './Statistics';

interface InfoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeLayer: LayerType;
  mapRef: React.RefObject<any>;
}

export default function InfoSidebar({
  isOpen,
  onClose,
  activeLayer,
  mapRef,
}: InfoSidebarProps) {
  const accommodationsQuery = useAccommodations();
  const waterStationsQuery = useWaterStations();
  const restroomsQuery = useRestrooms();
  const showerStationsQuery = useShowerStations();
  const medicalStationsQuery = useMedicalStations();

  const accommodationData = accommodationsQuery.data || [];
  const waterStationData = waterStationsQuery.data || [];
  const restroomData = restroomsQuery.data || [];
  const showerStationData = showerStationsQuery.data || [];
  const medicalStationData = medicalStationsQuery.data || [];
  const handleItemClick = (
    coordinates: { lat: number; lng: number },
    id: string
  ) => {
    if (mapRef.current && coordinates.lat && coordinates.lng) {
      if (window.innerWidth <= 768) {
        onClose();
      }
      mapRef.current.flyTo([coordinates.lat, coordinates.lng], 15, id);
      mapRef.current.openPopup([coordinates.lat, coordinates.lng], id);
    }
  };

  const renderAccommodationList = (gap = 3) => (
    <div className={`space-y-${gap}`}>
      {accommodationData.map((accommodation, index) => (
        <div
          key={index}
          className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          onClick={() =>
            accommodation.coordinates &&
            handleItemClick(accommodation.coordinates, accommodation.id)
          }
        >
          <div className="flex items-center gap-1">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 truncate">
                {accommodation.name || '未知住宿點'}
              </h4>
              <p className="text-sm text-gray-600 truncate">
                {accommodation.address || '未提供地址'}
              </p>
            </div>
            {accommodation.coordinates && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${accommodation.coordinates.lat},${accommodation.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                title="在 Google 地圖上查看"
                onClick={e => e.stopPropagation()}
              >
                導航
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderWaterStationList = (gap = 3) => (
    <div className={`space-y-${gap}`}>
      {waterStationData.map((station, index) => (
        <div
          key={index}
          className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          onClick={() =>
            station.coordinates &&
            handleItemClick(station.coordinates, station.id)
          }
        >
          <div className="flex items-center gap-1">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 truncate">
                {station.name}
              </h4>
              <p className="text-sm text-gray-600 truncate">
                {station.address || '未提供地址'}
              </p>
            </div>
            {station.coordinates && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${station.coordinates.lat},${station.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                title="在 Google 地圖上查看"
                onClick={e => e.stopPropagation()}
              >
                導航
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderRestroomList = (gap = 3) => (
    <div className={`space-y-${gap}`}>
      {restroomData.map((restroom, index) => (
        <div
          key={index}
          className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          onClick={() =>
            restroom.coordinates &&
            handleItemClick(restroom.coordinates, restroom.id)
          }
        >
          <div className="flex items-center gap-1">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 truncate">
                {restroom.name}
              </h4>
              <p className="text-sm text-gray-600 truncate">
                {restroom.address || '未提供地址'}
              </p>
            </div>
            {restroom.coordinates && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${restroom.coordinates.lat},${restroom.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                title="在 Google 地圖上查看"
                onClick={e => e.stopPropagation()}
              >
                導航
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderShowerStationList = (gap = 3) => (
    <div className={`space-y-${gap}`}>
      {showerStationData.map((station, index) => (
        <div
          key={index}
          className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          onClick={() =>
            station.coordinates &&
            handleItemClick(station.coordinates, station.id)
          }
        >
          <div className="flex items-center gap-1">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 truncate">
                {station.name}
              </h4>
              <p className="text-sm text-gray-600 truncate">
                {station.address || '未提供地址'}
              </p>
              {station.facility_type && (
                <p className="text-xs text-gray-500 mt-1">
                  類型: {station.facility_type}
                </p>
              )}
              {station.is_free !== undefined && (
                <p
                  className={`text-xs ${
                    station.is_free ? 'text-green-600' : 'text-orange-600'
                  }`}
                >
                  {station.is_free ? '免費' : '收費'}
                </p>
              )}
            </div>
            {station.coordinates && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${station.coordinates.lat},${station.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                title="在 Google 地圖上查看"
                onClick={e => e.stopPropagation()}
              >
                導航
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderMedicalStationList = (gap = 3) => (
    <div className={`space-y-${gap}`}>
      {medicalStationData.map((station, index) => (
        <div
          key={index}
          className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          onClick={() =>
            station.coordinates &&
            handleItemClick(station.coordinates, station.id)
          }
        >
          <div className="flex items-center gap-1">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-800 truncate">
                {station.name}
              </h4>
              <p className="text-sm text-gray-600 truncate">
                {station.detailed_address || '未提供地址'}
              </p>
            </div>
            {station.coordinates && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${station.coordinates.lat},${station.coordinates.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                title="在 Google 地圖上查看"
                onClick={e => e.stopPropagation()}
              >
                導航
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderAllSections = () => (
    <div className="space-y-4">
      {/* 住宿點 */}
      <details className="border rounded-lg border-[#e5e7eb]" open>
        <summary className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
          <span className="font-semibold text-gray-700 flex items-center">
            <span className="text-orange-600 mr-2">🏠</span>
            住宿點
            <span className="ml-2 text-sm text-gray-500">
              ({accommodationData.length})
            </span>
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
        <div>{renderAccommodationList(0)}</div>
      </details>

      {/* 加水站 */}
      <details className="border rounded-lg border-[#e5e7eb]" open>
        <summary className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
          <span className="font-semibold text-gray-700 flex items-center">
            <span className="text-blue-600 mr-2">💧</span>
            加水站
            <span className="ml-2 text-sm text-gray-500">
              ({waterStationData.length})
            </span>
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
        <div>{renderWaterStationList(0)}</div>
      </details>

      {/* 廁所 */}
      <details className="border rounded-lg border-[#e5e7eb]" open>
        <summary className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
          <span className="font-semibold text-gray-700 flex items-center">
            <span className="text-green-600 mr-2">🚻</span>
            廁所
            <span className="ml-2 text-sm text-gray-500">
              ({restroomData.length})
            </span>
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
        <div>{renderRestroomList(0)}</div>
      </details>

      {/* 洗澡點 */}
      <details className="border rounded-lg border-[#e5e7eb]" open>
        <summary className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
          <span className="font-semibold text-gray-700 flex items-center">
            <span className="text-yellow-600 mr-2">🚿</span>
            洗澡點
            <span className="ml-2 text-sm text-gray-500">
              ({showerStationData.length})
            </span>
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
        <div>{renderShowerStationList(0)}</div>
      </details>

      {/* 醫療站 */}
      <details className="border rounded-lg border-[#e5e7eb]" open>
        <summary className="p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 flex items-center justify-between list-none [&::-webkit-details-marker]:hidden">
          <span className="font-semibold text-gray-700 flex items-center">
            <span className="text-red-600 mr-2">🏥</span>
            醫療站
            <span className="ml-2 text-sm text-gray-500">
              ({medicalStationData.length})
            </span>
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
        <div>{renderMedicalStationList(0)}</div>
      </details>
    </div>
  );

  const renderContent = () => {
    switch (activeLayer) {
      case 'accommodation':
        return (
          <div>
            <h3 className="text-lg font-bold mb-3">住宿點列表</h3>
            {renderAccommodationList()}
          </div>
        );
      case 'waterStation':
        return (
          <div>
            <h3 className="text-lg font-bold mb-3">加水站列表</h3>
            {renderWaterStationList()}
          </div>
        );
      case 'restroom':
        return (
          <div>
            <h3 className="text-lg font-bold mb-3">廁所列表</h3>
            {renderRestroomList()}
          </div>
        );
      case 'showerStation':
        return (
          <div>
            <h3 className="text-lg font-bold mb-3">洗澡點列表</h3>
            {renderShowerStationList()}
          </div>
        );
      case 'medicalStation':
        return (
          <div>
            <h3 className="text-lg font-bold mb-3">醫療站列表</h3>
            {renderMedicalStationList()}
          </div>
        );
      case 'all':
      default:
        return (
          <div>
            <h3 className="text-lg font-bold mb-3">所有設施</h3>
            {renderAllSections()}
          </div>
        );
    }
  };

  return (
    <div className={`info-sidebar ${isOpen ? 'show' : ''}`}>
      <Legend />
      <Statistics />
      <div id="dynamicListContainer">{renderContent()}</div>
    </div>
  );
}
