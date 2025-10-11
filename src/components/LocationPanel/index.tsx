'use client';

import { UserPosition } from '@/types/map';
import { handleGoBack } from '@/utils/helpers';

interface LocationPanelProps {
  geolocation: {
    userPosition: UserPosition | null;
    hasLocationPermission: boolean;
    isLocationVisible: boolean;
    isWatchingPosition: boolean;
    requestUserLocation: () => Promise<UserPosition | null>;
    startWatchingPosition: (showConfirm?: boolean) => Promise<void>;
    stopWatchingPosition: () => void;
    setIsLocationVisible: (visible: boolean) => void;
  };
  onLocationToggle: () => void;
}

export default function LocationPanel({ geolocation, onLocationToggle }: LocationPanelProps) {
  const handleLocationButtonPress = async () => {
    if (!geolocation.hasLocationPermission || !geolocation.userPosition) {
      onLocationToggle();
      return;
    }

    if (geolocation.isWatchingPosition) {
      geolocation.stopWatchingPosition();
    } else {
      if (!geolocation.isLocationVisible) {
        geolocation.setIsLocationVisible(true);
      }
      await geolocation.startWatchingPosition(true);
    }
  };

  const handleButtonPress = (callback: () => void) => {
    let pressTimer: NodeJS.Timeout | null = null;
    let isLongPress = false;

    const startPress = () => {
      isLongPress = false;
      pressTimer = setTimeout(() => {
        isLongPress = true;
        handleLocationButtonPress();
      }, 800);
    };

    const endPress = () => {
      if (pressTimer) clearTimeout(pressTimer);
      if (!isLongPress) {
        callback();
      }
    };

    return { startPress, endPress };
  };

  const locationButtonClass = `
    location-btn
    ${geolocation.hasLocationPermission ? 'has-location' : ''}
    ${geolocation.isLocationVisible ? 'active' : ''}
    ${geolocation.isWatchingPosition ? 'tracking' : ''}
  `;

  const { startPress, endPress } = handleButtonPress(onLocationToggle);

  return (
    <div className="location-panel">
      <button className="go-back-btn" onClick={handleGoBack} title="返回">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>

      <button
        className={locationButtonClass}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        onTouchStart={(e) => {
          e.preventDefault();
          startPress();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          endPress();
        }}
        title={
          geolocation.isWatchingPosition
            ? '停止追蹤位置（長按）'
            : geolocation.hasLocationPermission
            ? '定位（長按追蹤）'
            : '定位'
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
  );
}
