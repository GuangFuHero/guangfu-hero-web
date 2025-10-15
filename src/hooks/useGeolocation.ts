'use client';

import { UserPosition } from '@/lib/types/map';
import { useModal } from '@/providers/ModalProvider';
import { useToast } from '@/providers/ToastProvider';
import { useCallback, useEffect, useState } from 'react';

export const useGeolocation = (onPositionUpdate?: (position: UserPosition) => void) => {
  const [userPosition, setUserPosition] = useState<UserPosition | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [isWatchingPosition, setIsWatchingPosition] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const { showConfirm } = useModal();
  const { showToast } = useToast();

  const requestUserLocation = useCallback((): Promise<UserPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('您的瀏覽器不支援定位功能'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserPosition(newPosition);
          setHasLocationPermission(true);
          onPositionUpdate?.(newPosition);
          resolve(newPosition);
        },
        error => {
          setHasLocationPermission(false);
          let message = '無法獲取您的位置';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = '定位權限被拒絕，請檢查瀏覽器設置並允許位置訪問';
              break;
            case error.POSITION_UNAVAILABLE:
              message = '位置資訊無法使用，請確保GPS已開啟';
              break;
            case error.TIMEOUT:
              message = '定位請求超時，請重試';
              break;
            default:
              message = `定位錯誤 (代碼: ${error.code}): ${error.message}`;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000,
        }
      );
    });
  }, []);

  const startWatchingPosition = useCallback(
    async (shouldShowConfirm = false) => {
      if (!navigator.geolocation || isWatchingPosition) return;

      if (shouldShowConfirm) {
        const confirmed = await showConfirm(
          '位置追蹤確認',
          '是否開啟實時位置追蹤？這將持續更新您在地圖上的位置。'
        );

        if (!confirmed) {
          showToast('已取消位置追蹤', 'info');
          return;
        }
      }

      try {
        const id = navigator.geolocation.watchPosition(
          position => {
            const newPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserPosition(newPosition);
            // 直接通過回調更新地圖
            onPositionUpdate?.(newPosition);
          },
          error => {
            console.error('位置追蹤錯誤:', error);
            stopWatchingPosition();
            showToast('位置追蹤失敗', 'error');
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000,
          }
        );

        setWatchId(id);
        setIsWatchingPosition(true);
        showToast('已開啟實時位置追蹤', 'success');
      } catch (error) {
        console.error('位置追蹤啟動失敗:', error);
        showToast('位置追蹤啟動失敗', 'error');
      }
    },
    [isWatchingPosition, onPositionUpdate]
  );

  const stopWatchingPosition = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsWatchingPosition(false);
      showToast('已停止位置追蹤', 'info');
    }
  }, [watchId]);

  const initLocationPermission = useCallback(async () => {
    if (window && window?.sessionStorage) {
      const denied = window.sessionStorage.getItem('locationPermissionRequestDenied');
      if (denied) return;
    }
    if (!navigator.geolocation) {
      showToast('您的瀏覽器不支援定位功能', 'warning');
      return;
    }

    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({
          name: 'geolocation',
        });
        if (permission.state === 'denied') {
          showToast('地理位置權限已被拒絕，請在瀏覽器設置中允許位置訪問', 'warning');
          return;
        }
      } catch (error) {
        console.log('無法檢查權限狀態:', error);
      }
    }

    const confirmed = await showConfirm(
      '位置權限請求',
      '此網站想要取得您的位置資訊並開啟實時位置追蹤，是否允許？\n這將幫助您在地圖上看到自己的位置並保持更新。'
    );

    if (!confirmed) {
      showToast('已取消位置權限請求', 'info');
      if (window && window?.sessionStorage) {
        window.sessionStorage.setItem('locationPermissionRequestDenied', 'true');
      }
      return;
    }

    showToast('正在獲取位置權限...', 'info');
    try {
      await requestUserLocation();
      showToast('已獲得定位權限，正在啟動位置追蹤...', 'success');
      // 延遲一秒後開始位置追蹤，不再顯示確認對話框
      setTimeout(() => startWatchingPosition(false), 1000);
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      }
    }
  }, [requestUserLocation, startWatchingPosition, showConfirm]);

  useEffect(() => {
    return () => {
      if (isWatchingPosition) {
        stopWatchingPosition();
      }
    };
  }, [isWatchingPosition, stopWatchingPosition]);

  return {
    userPosition,
    hasLocationPermission,
    isWatchingPosition,
    requestUserLocation,
    startWatchingPosition,
    stopWatchingPosition,
    initLocationPermission,
  };
};
