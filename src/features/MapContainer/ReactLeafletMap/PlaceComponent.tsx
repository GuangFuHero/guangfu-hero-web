import ActionButton from '@/components/ActionButton';
import {
  LineStringCoordinates,
  Place,
  PlaceCoordinates,
  PlaceCoordinatesType,
  PlaceType,
  PointCoordinates,
  PolygonCoordinates,
} from '@/lib/types/place';
import { formatDateRange, formatTimeRange, getGoogleMapsUrl } from '@/lib/utils';
import { useModal } from '@/providers/ModalProvider';
import { useToast } from '@/providers/ToastProvider';
import { Marker, Polygon, Polyline, Popup, useMap } from 'react-leaflet';
import { getTabIcon } from './Icons';
import { PLACE_CONFIG } from './place.config';

interface PlaceComponentProps {
  place: Place;
  isVisible: boolean;
}

const DEFAULT_CONFIG = { icon: '📍', color: '#6b7280' };

const getPlaceIconConfig = (type: PlaceType | string) => {
  const config = PLACE_CONFIG.find(config => config.type === type);
  return config ? { icon: config.icon, color: config.color } : DEFAULT_CONFIG;
};

const isValidCoordinates = (coordinates: PlaceCoordinates, type: PlaceCoordinatesType): boolean => {
  if (!coordinates) return false;
  if (!coordinates?.coordinates || !Array.isArray(coordinates.coordinates)) {
    return false;
  }

  return coordinates.type === type;
};

const isPointCoordinates = (coordinates: PlaceCoordinates): coordinates is PointCoordinates => {
  return (
    isValidCoordinates(coordinates, PlaceCoordinatesType.POINT) &&
    !!coordinates &&
    coordinates?.coordinates.length === 2
  );
};

const isPolygonCoordinates = (coordinates: PlaceCoordinates): coordinates is PolygonCoordinates => {
  return (
    isValidCoordinates(coordinates, PlaceCoordinatesType.POLYGON) &&
    !!coordinates &&
    coordinates.coordinates.length > 0 &&
    !!coordinates &&
    coordinates.coordinates.every(coord => Array.isArray(coord) && coord.length === 2)
  );
};

const isLineStringCoordinates = (
  coordinates: PlaceCoordinates
): coordinates is LineStringCoordinates => {
  return (
    isValidCoordinates(coordinates, PlaceCoordinatesType.LINE_STRING) &&
    !!coordinates &&
    coordinates.coordinates.length >= 2
  );
};

const createPopupContent = (
  place: Place,
  onClosePopup: () => void,
  onCopyText: (text: string) => void,
  onDetailModalOpen: () => void
) => {
  const googleMapsUrl = getGoogleMapsUrl(place.coordinates);
  const displayDate = formatDateRange(place.open_date, place.end_date);
  const displayTime = formatTimeRange(place.open_time, place.end_time);

  return (
    <div className="min-w-[200px] max-w-[300px]">
      <div className="flex flex-row justify-between items-center gap-2">
        <h3 className="font-medium text-xl text-[#3A3937]">{place.name || '未知地點'}</h3>
        <button
          onClick={onClosePopup}
          className="text-[#838383] hover:text-gray-700 text-3xl cursor-pointer flex items-center justify-center mt-[-4px]"
        >
          &times;
        </button>
      </div>

      <div className="space-y-2 text-[16px] font-normal text-[#3A3937] gap-1 mt-2">
        {place.address && (
          <div className="flex items-start gap-2">
            <span className="text-[#838383] min-w-[80px] text-nowrap">地址</span>
            <span className="flex-1 ">{place.address}</span>
          </div>
        )}

        {displayDate && (
          <div className="flex items-start gap-2">
            <span className="text-[#838383] min-w-[80px] text-nowrap">開放日期</span>
            <span className="flex-1">{displayDate}</span>
          </div>
        )}

        {displayTime && (
          <div className="flex items-start gap-2">
            <span className="text-[#838383] min-w-[80px] text-nowrap">開放時段</span>
            <span className="flex-1">{displayTime}</span>
          </div>
        )}

        {place.contact_phone && (
          <div className="flex items-start gap-2">
            <span className="text-[#838383] min-w-[80px] text-nowrap">聯絡</span>
            {place.contact_phone !== '-' ? (
              <div
                className="flex gap-2 justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                onClick={() => onCopyText(place.contact_phone)}
                title="點擊複製聯絡資訊"
              >
                <span className="flex-1">{place.contact_phone}</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <path
                    d="M18 7.66699C18 7.44814 17.9568 7.23149 17.873 7.0293C17.7893 6.82705 17.6665 6.64308 17.5117 6.48828C17.3569 6.33349 17.173 6.21073 16.9707 6.12695C16.7685 6.04323 16.5519 6 16.333 6H7.66699C7.22488 6 6.8009 6.17566 6.48828 6.48828C6.17566 6.8009 6 7.22488 6 7.66699V16.333C6 16.5519 6.04323 16.7685 6.12695 16.9707C6.21073 17.173 6.33349 17.3569 6.48828 17.5117C6.64308 17.6665 6.82705 17.7893 7.0293 17.873C7.23149 17.9568 7.44814 18 7.66699 18H16.333C16.5519 18 16.7685 17.9568 16.9707 17.873C17.1729 17.7893 17.3569 17.6665 17.5117 17.5117C17.6665 17.3569 17.7893 17.1729 17.873 16.9707C17.9568 16.7685 18 16.5519 18 16.333V7.66699ZM0 3C0 1.34772 1.34772 0 3 0H13C13.5623 0 14.0628 0.149771 14.4902 0.459961C14.896 0.754471 15.1695 1.14597 15.374 1.51367C15.6424 1.99627 15.4688 2.60555 14.9863 2.87402C14.5037 3.1424 13.8945 2.96883 13.626 2.48633C13.4886 2.23925 13.3866 2.13082 13.3154 2.0791C13.2659 2.04314 13.1876 2 13 2H3C2.45228 2 2 2.45228 2 3V12.999L2.00879 13.1309C2.02624 13.2611 2.06913 13.3876 2.13574 13.502C2.22456 13.6543 2.35256 13.78 2.50586 13.8672C2.98605 14.14 3.15466 14.7513 2.88184 15.2314C2.60896 15.7115 1.99771 15.8792 1.51758 15.6064C1.05722 15.3448 0.674765 14.9653 0.408203 14.5078C0.14166 14.0502 0.000512057 13.5305 0 13.001V3ZM20 16.333C20 16.8146 19.905 17.2914 19.7207 17.7363C19.5364 18.1812 19.2663 18.5853 18.9258 18.9258C18.5853 19.2663 18.1812 19.5364 17.7363 19.7207C17.2914 19.905 16.8146 20 16.333 20H7.66699C7.18544 20 6.70857 19.905 6.26367 19.7207C5.8188 19.5364 5.41471 19.2663 5.07422 18.9258C4.73373 18.5853 4.46358 18.1812 4.2793 17.7363C4.09501 17.2914 4 16.8146 4 16.333V7.66699C4 6.69445 4.38652 5.76191 5.07422 5.07422C5.76191 4.38652 6.69445 4 7.66699 4H16.333C16.8146 4 17.2914 4.09501 17.7363 4.2793C18.1812 4.46358 18.5853 4.73373 18.9258 5.07422C19.2663 5.41471 19.5364 5.8188 19.7207 6.26367C19.905 6.70857 20 7.18544 20 7.66699V16.333Z"
                    fill="#3A3937"
                  />
                </svg>
              </div>
            ) : (
              <span className="flex-1">{place.contact_phone}</span>
            )}
          </div>
        )}

        {place.notes && (
          <div className="flex items-start gap-2 line-clamp-2">
            <span className="text-[#838383] min-w-[80px] text-nowrap">備註</span>
            <span className="flex-1">{place.notes}</span>
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 mt-2">
        {googleMapsUrl && (
          <ActionButton href={googleMapsUrl} variant="primary" icon="/nav.svg" className="flex-1">
            <p className="text-white">導航</p>
          </ActionButton>
        )}

        <ActionButton variant="secondary" icon="/info.svg" onClick={onDetailModalOpen}>
          查看資訊
        </ActionButton>

        <div className="flex-4" />
      </div>
    </div>
  );
};

const PlaceComponent = ({ place, isVisible }: PlaceComponentProps) => {
  const map = useMap();
  const { openDetailModal } = useModal();
  const { showToast } = useToast();
  if (!isVisible || !place.coordinates) return null;

  const handleCopyText = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('已複製到剪貼板:', text);
        showToast('已複製聯絡資訊', 'success');
      })
      .catch(err => {
        console.error('複製失敗:', err);
        showToast('複製聯絡資訊失敗', 'error');
      });
  };

  const handleClosePopup = () => {
    map.closePopup();
  };

  const handleDetailModalOpen = () => {
    openDetailModal(place.type, place?.name || '未知地點', place);
  };

  const iconConfig = getPlaceIconConfig(place.type);
  const icon = getTabIcon(iconConfig.icon, iconConfig.color);

  if (isPointCoordinates(place.coordinates)) {
    const [lng, lat] = place.coordinates.coordinates;

    return (
      <Marker position={[lat, lng]} icon={icon} dataId={place.id}>
        <Popup closeButton={false}>
          {createPopupContent(place, handleClosePopup, handleCopyText, handleDetailModalOpen)}
        </Popup>
      </Marker>
    );
  }

  if (isPolygonCoordinates(place.coordinates)) {
    const polygonPositions = place.coordinates.coordinates.map(
      ([lng, lat]) => [lat, lng] as [number, number]
    );

    return (
      <Polygon
        positions={polygonPositions}
        pathOptions={{
          color: iconConfig.color,
          fillColor: iconConfig.color,
          fillOpacity: 0.3,
          weight: 2,
        }}
      >
        <Popup>
          {createPopupContent(place, handleClosePopup, handleCopyText, handleDetailModalOpen)}
        </Popup>
      </Polygon>
    );
  }

  if (isLineStringCoordinates(place.coordinates)) {
    const coordinates = place.coordinates.coordinates;

    return (
      <Polyline
        positions={coordinates}
        pathOptions={{
          color: iconConfig.color,
          weight: 4,
          opacity: 0.8,
        }}
      >
        <Popup>
          {createPopupContent(place, handleClosePopup, handleCopyText, handleDetailModalOpen)}
        </Popup>
      </Polyline>
    );
  }

  return null;
};

export default PlaceComponent;
