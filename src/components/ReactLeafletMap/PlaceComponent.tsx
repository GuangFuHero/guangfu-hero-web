import { useModal } from '@/providers/ModalProvider';
import {
  LineStringCoordinates,
  Place,
  PLACE_TYPE_STRING_MAP,
  PlaceCoordinates,
  PlaceCoordinatesType,
  PlaceType,
  PointCoordinates,
  PolygonCoordinates,
} from '@/types/place';
import dayjs from 'dayjs';
import { Marker, Polygon, Polyline, Popup } from 'react-leaflet';
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

const getPlaceTypeName = (type: PlaceType | string): string => {
  if (Object.values(PlaceType).includes(type as PlaceType)) {
    return PLACE_TYPE_STRING_MAP[type as PlaceType];
  }
  return type;
};

const isValidCoordinates = (coordinates: PlaceCoordinates, type: PlaceCoordinatesType): boolean => {
  if (!coordinates?.coordinates || !Array.isArray(coordinates.coordinates)) {
    return false;
  }

  return coordinates.type === type;
};

const isPointCoordinates = (coordinates: PlaceCoordinates): coordinates is PointCoordinates => {
  return (
    isValidCoordinates(coordinates, PlaceCoordinatesType.POINT) &&
    coordinates.coordinates.length === 2
  );
};

const isPolygonCoordinates = (coordinates: PlaceCoordinates): coordinates is PolygonCoordinates => {
  return (
    isValidCoordinates(coordinates, PlaceCoordinatesType.POLYGON) &&
    coordinates.coordinates.length > 0 &&
    coordinates.coordinates.every(coord => Array.isArray(coord) && coord.length === 2)
  );
};

const isLineStringCoordinates = (
  coordinates: PlaceCoordinates
): coordinates is LineStringCoordinates => {
  return (
    isValidCoordinates(coordinates, PlaceCoordinatesType.LINE_STRING) &&
    coordinates.coordinates.length >= 2
  );
};

const renderOpeningHours = (openTime?: string, endTime?: string) => {
  const isOpenTimeValid = openTime && dayjs(openTime).isValid();
  const isEndTimeValid = endTime && dayjs(endTime).isValid();

  if (!isOpenTimeValid && !isEndTimeValid) {
    return null;
  }

  return (
    <div>
      <span className="font-semibold">開放時間:</span>{' '}
      {isOpenTimeValid ? dayjs(openTime).format('YYYY-MM-DD HH:mm') : ''}
      {isOpenTimeValid && isEndTimeValid ? ' - ' : ''}
      {isEndTimeValid ? dayjs(endTime).format('YYYY-MM-DD HH:mm') : ''}
    </div>
  );
};

const createPopupContent = (
  place: Place,
  openReportModal: (type: string, id: string, name: string) => void
) => {
  const typeName = getPlaceTypeName(place.type);
  return (
    <div className="max-w-xs">
      <h3 className="font-bold text-lg mb-2">{place.name || '-'}</h3>
      <div className="space-y-1 text-sm">
        <div>
          <span className="font-semibold">類型:</span> {typeName}
        </div>
        <div>
          <span className="font-semibold">地址:</span> {place.address || '-'}
        </div>
        {place.address_description && (
          <div>
            <span className="font-semibold">地址描述:</span> {place.address_description}
          </div>
        )}
        {place.contact_phone && (
          <div>
            <span className="font-semibold">聯絡電話:</span> {place.contact_phone}
          </div>
        )}
        {renderOpeningHours(place.open_time, place.end_time)}
        {place.website_url && (
          <div>
            <span className="font-semibold">網站:</span>
            <a
              href={place.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline ml-1"
            >
              連結
            </a>
          </div>
        )}
        {place.resources && place.resources.length > 0 && (
          <div>
            <span className="font-semibold">資源:</span>
            <ul className="mt-1 ml-4">
              {place.resources.map((resource, index) => (
                <li key={index} className="text-xs">
                  • {resource.name}: {resource.count} {resource.unit}
                </li>
              ))}
            </ul>
          </div>
        )}
        {place.notes && (
          <div>
            <span className="font-semibold">備註:</span> {place.notes}
          </div>
        )}
        {place.tags && place.tags.length > 0 && (
          <div>
            <span className="font-semibold">標籤:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {place.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      {place?.id ? (
        <div className="mt-3 pt-2 border-t border-gray-200">
          <button
            onClick={() => {
              openReportModal(typeName, place.id, place.name || `未知的${typeName}`);
            }}
            className="cursor-pointer w-full px-3 py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition-colors"
          >
            回報問題
          </button>
        </div>
      ) : null}
    </div>
  );
};

const PlaceComponent = ({ place, isVisible }: PlaceComponentProps) => {
  const { openReportModal } = useModal();

  if (!isVisible || !place.coordinates) return null;

  const iconConfig = getPlaceIconConfig(place.type);
  const icon = getTabIcon(iconConfig.icon, iconConfig.color);

  if (isPointCoordinates(place.coordinates)) {
    const [lng, lat] = place.coordinates.coordinates;

    return (
      <Marker position={[lat, lng]} icon={icon} dataId={place.id}>
        <Popup>{createPopupContent(place, openReportModal)}</Popup>
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
        <Popup>{createPopupContent(place, openReportModal)}</Popup>
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
        <Popup>{createPopupContent(place, openReportModal)}</Popup>
      </Polyline>
    );
  }

  return null;
};

export default PlaceComponent;
