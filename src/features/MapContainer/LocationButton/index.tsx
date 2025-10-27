'use client';

import { UserPosition } from '@/lib/types/map';

interface LocationButtonProps {
  isFullScreenMap: boolean;
  geolocation: {
    userPosition: UserPosition | null;
    hasLocationPermission: boolean;
    isWatchingPosition: boolean;
    requestUserLocation: () => Promise<UserPosition | null>;
    startWatchingPosition: (showConfirm?: boolean) => Promise<void>;
    stopWatchingPosition: () => void;
  };
  onLocationToggle: () => void;
}

export default function LocationButton({
  isFullScreenMap,
  geolocation,
  onLocationToggle,
}: LocationButtonProps) {
  const handleLocationButtonPress = async () => {
    if (!geolocation.hasLocationPermission || !geolocation.userPosition) {
      onLocationToggle();
      return;
    }

    if (geolocation.isWatchingPosition) {
      geolocation.stopWatchingPosition();
    } else {
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
    ${geolocation.hasLocationPermission && !geolocation.isWatchingPosition ? 'active' : ''}
    ${geolocation.isWatchingPosition ? 'tracking' : ''}
  `;

  const { startPress, endPress } = handleButtonPress(onLocationToggle);

  return (
    <div className="location-panel-bottom">
      <button
        className={locationButtonClass}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={endPress}
        onTouchStart={e => {
          e.preventDefault();
          startPress();
        }}
        onTouchEnd={e => {
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
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.5 0.5L0.5 6.775V7.59167L6.2 9.8L8.4 15.5H9.21667L15.5 0.5Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </div>
  );
}
