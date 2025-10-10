'use client';
import { useGeolocation } from '@/hooks/useGeolocation';
import { ModalProvider } from '@/providers/ModalProvider';
import { Providers } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { LayerType, UserPosition } from '@/types/map';
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactLeafletMap from '../ReactLeafletMap';
import './map.css';

const LocationPanel = dynamic(() => import('../LocationPanel'), { ssr: false });
const BottomTabs = dynamic(() => import('../BottomTabs'), { ssr: false });
const InfoSidebar = dynamic(() => import('../InfoSidebar'), { ssr: false });
const Modals = dynamic(() => import('../Modals'), { ssr: false });
const ToastContainer = dynamic(() => import('@/components/ToastContainer'), {
  ssr: false,
});

function MapContainer({ isFullScreenMap = true }: { isFullScreenMap?: boolean }) {
  const [activeLayer, setActiveLayer] = useState<LayerType>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mapRef = useRef<{
    getMap: () => L.Map | null;
    flyTo: (latlng: [number, number], zoom?: number | undefined) => void;
    openPopup: (latlng: [number, number], dataId: string) => void;
    updateUserLocation: (position: UserPosition, isVisible: boolean) => void;
  }>(null);

  const handlePositionUpdate = useCallback((position: UserPosition) => {
    if (mapRef.current?.updateUserLocation) {
      const isVisible = geolocationRef.current?.isLocationVisible || false;
      mapRef.current.updateUserLocation(position, isVisible);
    }
  }, []);

  const geolocationRef = useRef<typeof geolocation | null>(null);
  const geolocation = useGeolocation(handlePositionUpdate);

  useEffect(() => {
    if (!isFullScreenMap) return;
    const timer = setTimeout(geolocation.initLocationPermission, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    geolocationRef.current = geolocation;
  }, [geolocation]);

  useEffect(() => {
    if (mapRef.current?.updateUserLocation && geolocation.userPosition) {
      mapRef.current.updateUserLocation(geolocation.userPosition, geolocation.isLocationVisible);
    }
  }, [geolocation.isLocationVisible, geolocation.userPosition]);

  const handleLayerChange = (layerType: LayerType) => {
    setActiveLayer(layerType);
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, [setIsSidebarOpen]);

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, [setIsSidebarOpen]);

  return (
    <div className="relative h-[100%] w-[100%] overflow-hidden">
      {/* 地圖容器 */}
      <ReactLeafletMap
        ref={mapRef}
        activeLayer={activeLayer}
        onSidebarClose={handleSidebarClose}
        userPosition={geolocation.userPosition}
        isUserLocationVisible={geolocation.isLocationVisible}
      />

      {/* 定位按鈕面板 */}
      {isFullScreenMap ? (
        <LocationPanel
          geolocation={geolocation}
          onLocationToggle={() => {
            if (!geolocation.hasLocationPermission || !geolocation.userPosition) {
              geolocation
                .requestUserLocation()
                .then(() => geolocation.setIsLocationVisible(true))
                .catch(console.error);
            } else {
              geolocation.setIsLocationVisible(!geolocation.isLocationVisible);
            }
          }}
        />
      ) : null}

      {/* 底部分頁面板 */}
      <BottomTabs
        activeLayer={activeLayer}
        onLayerChange={handleLayerChange}
        isSidebarOpen={isSidebarOpen}
        onToggleInfo={toggleSidebar}
      />

      {/* 資訊側邊欄 */}
      <InfoSidebar
        mapRef={mapRef}
        activeLayer={activeLayer}
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
      />

      {/* 模態框組件 */}
      <Modals userPosition={geolocation.userPosition} />

      {/* Toast 通知 */}
      <ToastContainer />
    </div>
  );
}

export default function ({ isFullScreenMap = true }: { isFullScreenMap?: boolean }) {
  return (
    <Providers>
      <ToastProvider>
        <ModalProvider>
          <MapContainer isFullScreenMap={isFullScreenMap} />
        </ModalProvider>
      </ToastProvider>
    </Providers>
  );
}
