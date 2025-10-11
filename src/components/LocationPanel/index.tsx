'use client';

import { UserPosition } from '@/types/map';
import { handleGoBack } from '@/utils/helpers';

interface LocationPanelProps {
  isFullScreenMap: boolean;
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

export default function LocationPanel({
  isFullScreenMap,
  geolocation,
  onLocationToggle,
}: LocationPanelProps) {
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
      {isFullScreenMap ? (
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
      ) : null}

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
          <circle cx="12" cy="12" r="9" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" strokeWidth="2" fill="currentColor" />
          <line x1="12" y1="1" x2="12" y2="6" strokeWidth="2" strokeLinecap="round" />
          <line x1="12" y1="18" x2="12" y2="23" strokeWidth="2" strokeLinecap="round" />
          <line x1="1" y1="12" x2="6" y2="12" strokeWidth="2" strokeLinecap="round" />
          <line x1="18" y1="12" x2="23" y2="12" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
