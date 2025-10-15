import { GUANG_FU_STATION } from '@/features/MapContainer/constants';
import { Marker, Popup } from 'react-leaflet';
import { stationIcon } from './Icons';

export default function GuangFuStationMarker() {
  return (
    <Marker position={[GUANG_FU_STATION.lat, GUANG_FU_STATION.lng]} icon={stationIcon}>
      <Popup>
        <div className="p-2">
          <h3 className="font-bold text-lg whitespace-nowrap">{GUANG_FU_STATION.name}</h3>
          <p className="text-sm text-gray-600">主要下車點</p>
        </div>
      </Popup>
    </Marker>
  );
}
