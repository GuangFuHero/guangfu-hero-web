'use client';

import { useInfinitePlaces } from '@/hooks/useMapData';
import { PlaceTab } from '@/lib/types/map';
import { Place } from '@/lib/types/place';
import { useCallback, useEffect, useMemo } from 'react';
import InfoCard from './InfoCard';

interface PlaceListProps {
  activeTab: PlaceTab;
  className?: string;
}

const getMapUrl = (place: Place): string | undefined => {
  if (place.coordinates) {
    let lat: number, lng: number;

    switch (place.coordinates.type) {
      case 'Point':
        lat = place.coordinates.coordinates[1];
        lng = place.coordinates.coordinates[0];
        break;
      case 'Polygon':
        if (place.coordinates.coordinates.length === 0) return undefined;
        const sumLat = place.coordinates.coordinates.reduce((sum, point) => sum + point[1], 0);
        const sumLng = place.coordinates.coordinates.reduce((sum, point) => sum + point[0], 0);
        lat = sumLat / place.coordinates.coordinates.length;
        lng = sumLng / place.coordinates.coordinates.length;
        break;
      case 'LineString':
        if (place.coordinates.coordinates.length === 0) return undefined;
        const midIndex = Math.floor(place.coordinates.coordinates.length / 2);
        lat = place.coordinates.coordinates[midIndex][1];
        lng = place.coordinates.coordinates[midIndex][0];
        break;
      default:
        return undefined;
    }

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lng}`)}`;
  }

  return undefined;
};

const PlaceList: React.FC<PlaceListProps> = ({ activeTab, className = '' }) => {
  const listQuery = useInfinitePlaces(activeTab);

  const displayPlaces = useMemo(() => {
    if (!listQuery.data) return [];

    if (activeTab === 'all') {
      return Object.values(listQuery.data).flat();
    } else {
      return listQuery.data[activeTab] || [];
    }
  }, [listQuery.data, activeTab]);

  const handleScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 200) {
      listQuery.fetchNextPage();
    }
  }, [listQuery]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className={`space-y-4 mb-[80px] px-[16px] md:px-[32px] ${className}`}>
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
                <InfoCard key={place.id} place={place} mapUrl={getMapUrl(place)} className="mb-4" />
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
