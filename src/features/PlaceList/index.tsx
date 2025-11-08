'use client';

import { useInfinitePlaces } from '@/hooks/useMapData';
import { PlaceTab } from '@/lib/types/map';
import { Place } from '@/lib/types/place';
import { getGoogleMapsUrl, throttle } from '@/lib/utils';
import { useEffect, useMemo } from 'react';
import InfoCard from './InfoCard';

interface PlaceListProps {
  activeTab: PlaceTab;
  onFilterPlaces?: (place: Place) => boolean;
  className?: string;
}

const PlaceList: React.FC<PlaceListProps> = ({ activeTab, className = '', onFilterPlaces }) => {
  const listQuery = useInfinitePlaces(activeTab);

  const displayPlaces = useMemo(() => {
    if (!listQuery.data) return [];

    let displayPlaces: Place[] = [];

    if (activeTab === 'all') displayPlaces = listQuery.flatData;
    else displayPlaces = listQuery.data[activeTab] || [];

    return !!onFilterPlaces ? displayPlaces.filter(onFilterPlaces) : displayPlaces;
  }, [listQuery.data, activeTab, onFilterPlaces]);

  const handleScroll = throttle(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
      listQuery.fetchNextPage();
    }
  }, 500);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className={`space-y-4 mb-[80px] ${className}`}>
      {listQuery.isLoading && (
        <div className="text-center py-8 text-[var(--gray)] mb-[80vh]">載入中...</div>
      )}

      {listQuery.error && (
        <div className="text-center py-8 text-red-500">獲取數據失敗，請稍後重試。</div>
      )}
      {!listQuery.isLoading && !listQuery.error && (
        <>
          {displayPlaces.length === 0 ? (
            <div className="text-center py-8 text-[var(--gray)]">此分類暫無資料</div>
          ) : (
            <>
              {displayPlaces.map((place: Place) => (
                <InfoCard
                  key={place.id}
                  place={place}
                  mapUrl={getGoogleMapsUrl(place.coordinates)}
                  className="mb-4"
                />
              ))}

              {'isFetchingNextPage' in listQuery && listQuery.isFetchingNextPage && (
                <div className="text-center py-4 text-gray-500">
                  <div className="animate-pulse">載入更多...</div>
                </div>
              )}

              <div className="text-center py-2 text-sm text-gray-500">
                已顯示 {displayPlaces.length} 個地點
                {'hasNextPage' in listQuery && !listQuery.hasNextPage && ' (已載入全部)'}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PlaceList;
