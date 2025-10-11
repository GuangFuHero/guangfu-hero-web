import { useModal } from '@/providers/ModalProvider';
import { MedicalStation } from '@/types/medicalStation';
import { Marker, Popup } from 'react-leaflet';
import { medicalStationIcon } from './Icons';

interface MedicalStationMarkerProps {
  medical: MedicalStation;
  isVisible: boolean;
}

const MedicalStationMarker = ({ medical, isVisible }: MedicalStationMarkerProps) => {
  const { openReportModal } = useModal();
  if (!isVisible) return null;

  let lat: number, lng: number;
  if (medical.coordinates) {
    lat = medical.coordinates.lat;
    lng = medical.coordinates.lng;
  } else {
    return null;
  }

  if (isNaN(lat) || isNaN(lng)) return null;

  return (
    <Marker position={[lat, lng]} icon={medicalStationIcon} dataId={medical.id}>
      <Popup>
        <div className="max-w-xs">
          <h3 className="font-bold text-lg mb-2">{medical.name || '-'}</h3>
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-semibold">地址:</span> {medical.detailed_address || '-'}
            </div>
            {(medical.services || []).length > 0 && (
              <div>
                <span className="font-semibold">服務項目:</span>{' '}
                {(medical.services || []).join(', ')}
              </div>
            )}
            {medical.phone && (
              <div>
                <span className="font-semibold">聯絡:</span> {medical.phone}
              </div>
            )}
            {medical.notes && (
              <div>
                <span className="font-semibold">備註:</span> {medical.notes}
              </div>
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <button
              onClick={() =>
                openReportModal('醫療站', medical.id || 'unknown', medical.name || '未知醫療站')
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

export default MedicalStationMarker;
