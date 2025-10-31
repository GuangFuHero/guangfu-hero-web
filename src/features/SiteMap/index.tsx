'use client';

import DropdownSelect from '@/components/DropdownSelect';
import PlaceList from '@/features/PlaceList';
import useMapCategoryDurationTracker from '@/hooks/useMapCategoryDurationTracker';
import { PlaceType } from '@/lib/types/place';
import { useTab } from '@/providers/TabProvider';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import TabDropdownSelect from '../MapContainer/TabDropdownSelect';

const MapContainer = dynamic(() => import('@/features/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen bg-transparent">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-300">載入地圖中...</p>
      </div>
    </div>
  ),
});

const ToastContainer = dynamic(() => import('@/features/MapContainer/ToastContainer'), {
  ssr: false,
});
const Modals = dynamic(() => import('@/features/MapContainer/Modals'), { ssr: false });

type ShowMode = 'mapShow' | 'listShow';

export default function SiteMap() {
  const searchParams = useSearchParams();
  const { activeTab, setActiveTab } = useTab();
  const [showMode, setShowMode] = useState<ShowMode>('mapShow');
  useMapCategoryDurationTracker(activeTab, showMode);

  useEffect(() => {
    const view = searchParams.get('view');
    const category = searchParams.get('category');

    if (view === 'list') {
      setShowMode('listShow');
      if (category && category !== 'all') {
        setActiveTab(category as PlaceType);
      }
    }
  }, [searchParams]);

  const handleModeChange = (value: ShowMode) => {
    setShowMode(value);
  };

  const options = [
    { label: '地圖顯示', value: 'mapShow' },
    { label: '列表顯示', value: 'listShow' },
  ];

  return (
    <>
      <div className="relative">
        <div
          className={
            showMode === 'listShow'
              ? 'p-4 flex flex-row items-center gap-2'
              : 'absolute z-850 top-4 left-4 flex flex-row items-center justify-center gap-2'
          }
        >
          <TabDropdownSelect />
          <DropdownSelect
            value={showMode}
            onChange={handleModeChange as (value: string) => void}
            options={options}
          />
        </div>
        {showMode === 'mapShow' && <MapContainer isFullScreenMap={false} />}

        {showMode === 'listShow' && <PlaceList activeTab={activeTab} />}
      </div>

      <ToastContainer />
      <Modals />
    </>
  );
}
