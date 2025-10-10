import { useModal } from '@/providers/ModalProvider';
import { Accommodation } from '@/types/accommodation';
import { Marker, Popup } from 'react-leaflet';
import { accommodationIcon } from './Icons';

interface AccommodationMarkerProps {
  accommodation: Accommodation;
  isVisible: boolean;
}

const AccommodationMarker = ({ accommodation, isVisible }: AccommodationMarkerProps) => {
  const { openReportModal } = useModal();
  if (!isVisible || !accommodation.coordinates?.lat || !accommodation.coordinates?.lng) {
    return null;
  }

  const { lat, lng } = accommodation.coordinates;

  return (
    <Marker position={[lat, lng]} icon={accommodationIcon} dataId={accommodation.id}>
      <Popup>
        <div className="max-w-xs">
          <h3 className="font-bold text-lg mb-2">{accommodation?.name || '-'}</h3>
          <div className="space-y-1 text-sm">
            <div>
              <span className="font-semibold">地址:</span> {accommodation?.address || '未提供'}
            </div>
            <div>
              <span className="font-semibold">聯絡:</span> {accommodation?.contact_info || '未提供'}
            </div>
            {accommodation?.pricing && (
              <div>
                <span className="font-semibold">費用:</span> {accommodation.pricing || '-'}
              </div>
            )}
            {accommodation?.notes && (
              <div>
                <span className="font-semibold">備註:</span> {accommodation.notes}
              </div>
            )}
          </div>
          <div className="mt-3 pt-2 border-t border-gray-200">
            <button
              onClick={() => {
                if (accommodation?.id) {
                  openReportModal('住宿點', accommodation.id, accommodation?.name || '未知住宿點');
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
export default AccommodationMarker;
