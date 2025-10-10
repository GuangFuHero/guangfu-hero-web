import { useModal } from '@/providers/ModalProvider';
import { Restroom } from '@/types/restroom';
import { Marker, Popup } from 'react-leaflet';
import { restroomIcon } from './Icons';

interface RestroomMarkerProps {
  restroom: Restroom;
  isVisible: boolean;
}

const RestroomMarker = ({ restroom, isVisible }: RestroomMarkerProps) => {
  const { openReportModal } = useModal();

  if (!isVisible) return null;

  let lat: number, lng: number;
  if (restroom.coordinates) {
    lat = restroom.coordinates.lat;
    lng = restroom.coordinates.lng;
  } else {
    return null;
  }

  if (isNaN(lat) || isNaN(lng)) return null;

  return (
    <Marker
      position={[lat, lng]}
      icon={restroomIcon}
      // @ts-ignore - dataId is a custom property
      dataId={restroom.id}
    >
      <Popup>
        <div className="max-w-xs">
          <h3 className="font-bold text-lg mb-2">{restroom.name || '-'}</h3>
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-semibold">地址:</span>{' '}
              {restroom.address || '-'}
            </div>
            {restroom.facilities && (
              <div>
                <span className="font-semibold">設施:</span>{' '}
                {restroom.facilities}
              </div>
            )}
            {restroom.notes && (
              <div>
                <span className="font-semibold">備註:</span> {restroom.notes}
              </div>
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <button
              onClick={() =>
                openReportModal(
                  '廁所',
                  restroom.id || 'unknown',
                  restroom.name || '未知廁所'
                )
              }
              className="cursor-pointer w-full px-3 py-2 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600 transition-colors"
            >
              回報問題
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default RestroomMarker;
