import { PLACE_CONFIG } from '@/components/ReactLeafletMap/place.config';
import { usePlaces } from '@/hooks/useMapData';

export default function Statistics() {
  const placesQuery = usePlaces();
  const placesData = placesQuery.data || {};

  const totalCount = PLACE_CONFIG.reduce((total, config) => {
    return total + (placesData[config.type]?.length || 0);
  }, 0);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-3">統計資訊</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between border-b border-gray-200 pb-2 mb-2">
          <span className="font-medium">總設施數量：</span>
          <span className="font-bold text-blue-600">{totalCount}</span>
        </div>
        {PLACE_CONFIG.map(config => {
          const count = placesData[config.type]?.length || 0;
          return (
            <div key={config.type} className="flex justify-between">
              <span className="font-medium flex items-center">
                <span className="mr-2" style={{ color: config.color }}>
                  {config.icon}
                </span>
                {config.label}：
              </span>
              <span className="font-semibold">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
