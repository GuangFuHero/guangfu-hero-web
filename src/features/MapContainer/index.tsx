'use client';
import { useGeolocation } from '@/hooks/useGeolocation';
import { UserPosition } from '@/lib/types/map';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import FullscreenButton from './FullscreenButton';
import './map.css';
import ReactLeafletMap from './ReactLeafletMap';

const LocationButton = dynamic(() => import('./LocationButton'), { ssr: false });
const InfoSidebar = dynamic(() => import('./InfoSidebar'), { ssr: false });

export default function MapContainer({ isFullScreenMap = true }: { isFullScreenMap?: boolean }) {
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mapRef = useRef<{
    getMap: () => L.Map | null;
    flyTo: (latlng: [number, number], zoom?: number | undefined) => void;
    openPopup: (latlng: [number, number], dataId: string) => void;
    updateUserLocation: (position: UserPosition) => void;
  }>(null);

  const handlePositionUpdate = useCallback((position: UserPosition) => {
    if (mapRef.current?.updateUserLocation) {
      mapRef.current.updateUserLocation(position);
      mapRef.current.flyTo([position.lat, position.lng], 15);
    }
  }, []);

  const geolocationRef = useRef<typeof geolocation | null>(null);
  const geolocation = useGeolocation(handlePositionUpdate);

  useEffect(() => {
    const timer = setTimeout(geolocation.initLocationPermission, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    geolocationRef.current = geolocation;
  }, [geolocation]);

  useEffect(() => {
    if (mapRef.current?.updateUserLocation && geolocation.userPosition) {
      mapRef.current.updateUserLocation(geolocation.userPosition);
    }
  }, [geolocation.userPosition]);

  const handleToggleSidebarOpen = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, [setIsSidebarOpen]);

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false);
  }, [setIsSidebarOpen]);

  const handleToggleFullScreen = useCallback(() => {
    if (isFullScreenMap) router.push('/map');
    else router.push('/full-screen-map');
  }, [isFullScreenMap, router]);

  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 map-zoom-control-offset ${
        isFullScreenMap ? 'h-[100svh] w-[100svw]' : 'h-[100%] w-[100%]'
      }`}
    >
      <ReactLeafletMap
        ref={mapRef}
        isFullScreenMap={isFullScreenMap}
        onSidebarClose={handleSidebarClose}
        userPosition={geolocation.userPosition}
      />

      <FullscreenButton
        isFullScreenMap={isFullScreenMap}
        onToggleFullScreen={handleToggleFullScreen}
      />

      <LocationButton
        geolocation={geolocation}
        isFullScreenMap={isFullScreenMap}
        onLocationToggle={geolocation.requestUserLocation}
      />

      <InfoSidebar
        mapRef={mapRef}
        isOpen={isSidebarOpen}
        isFullScreenMap={isFullScreenMap}
        onToggleSidebarOpen={handleToggleSidebarOpen}
      />
    </div>
  );
}
