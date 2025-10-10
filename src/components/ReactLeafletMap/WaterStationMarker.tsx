import { useModal } from '@/providers/ModalProvider';
import { WaterStation } from '@/types/waterStation';
import { Marker, Popup } from 'react-leaflet';
import { waterStationIcon } from './Icons';

interface WaterStationMarkerProps {
  station: WaterStation;
  isVisible: boolean;
}

const WaterStationMarker = ({ station, isVisible }: WaterStationMarkerProps) => {
  const { openReportModal } = useModal();
  if (!isVisible) return null;

  let lat: number, lng: number;
  if (station.coordinates) {
    lat = station.coordinates.lat;
    lng = station.coordinates.lng;
  } else {
    return null;
  }

  if (isNaN(lat) || isNaN(lng)) return null;

  return (
    <Marker position={[lat, lng]} icon={waterStationIcon} dataId={station.id}>
      <Popup>
        <div className="max-w-xs">
          <h3 className="font-bold text-lg mb-2">{station.name || '-'}</h3>
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-semibold">地址:</span> {station.address || '-'}
            </div>
            {station.opening_hours && (
              <div>
                <span className="font-semibold">開放時間:</span> {station.opening_hours}
              </div>
            )}
            {station.notes && (
              <div>
                <span className="font-semibold">備註:</span> {station.notes}
              </div>
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <button
              onClick={() => {
                if (!!station?.id) {
                  openReportModal('加水站', station.id, station.name || '未知加水站');
                }
              }}
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

export default WaterStationMarker;
