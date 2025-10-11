import { useModal } from '@/providers/ModalProvider';
import { ShowerStation } from '@/types/showerStation';
import { Marker, Popup } from 'react-leaflet';
import { showerStationIcon } from './Icons';

interface ShowerStationMarkerProps {
  shower: ShowerStation;
  isVisible: boolean;
}

const ShowerStationMarker = ({ shower, isVisible }: ShowerStationMarkerProps) => {
  const { openReportModal } = useModal();
  if (!isVisible) return null;

  let lat: number, lng: number;
  if (shower.coordinates) {
    lat = shower.coordinates.lat;
    lng = shower.coordinates.lng;
  } else {
    return null;
  }

  if (isNaN(lat) || isNaN(lng)) return null;

  return (
    <Marker position={[lat, lng]} icon={showerStationIcon} dataId={shower.id}>
      <Popup>
        <div className="max-w-xs">
          <h3 className="font-bold text-lg mb-2">{shower.name || '-'}</h3>
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-semibold">地址:</span> {shower.address || '-'}
            </div>
            {shower.time_slots && (
              <div>
                <span className="font-semibold">時段:</span> {shower.time_slots}
              </div>
            )}
            {shower.pricing && (
              <div>
                <span className="font-semibold">費用:</span> {shower.pricing}
              </div>
            )}
            {shower.notes && (
              <div>
                <span className="font-semibold">備註:</span> {shower.notes}
              </div>
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <button
              onClick={() =>
                openReportModal('洗澡點', shower.id || 'unknown', shower.name || '未知洗澡點')
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

export default ShowerStationMarker;
