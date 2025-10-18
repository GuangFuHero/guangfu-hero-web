'use client';

import TabDropdownSelect from '@/features/MapContainer/TabDropdownSelect';
import dynamic from 'next/dynamic';

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
const Modals = dynamic(() => import('@/features/MapContainer/Modals'), { ssr: false });

const ToastContainer = dynamic(() => import('@/features/MapContainer/ToastContainer'), {
  ssr: false,
});

export default function FullscreenMapPage() {
  return (
    <div className="relative h-screen w-screen">
      <div className="absolute z-1000 top-4 left-4 flex flex-row items-center justify-center gap-2">
        <TabDropdownSelect />
      </div>
      <MapContainer isFullScreenMap={true} />;
      <ToastContainer />
      <Modals />
    </div>
  );
}
