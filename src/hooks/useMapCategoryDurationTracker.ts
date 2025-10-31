import { PLACE_TYPE_STRING_MAP, PlaceType } from '@/lib/types/place';
import { debounce } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useRef } from 'react';
import ReactGA from 'react-ga4';

const DISPLAY_MODE = {
  mapShow: '地圖',
  listShow: '列表',
};

const handleRecordGAEvent = debounce(
  (category: PlaceType | 'all', displayMode: 'mapShow' | 'listShow', startTime: number) => {
    const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
    if (durationSeconds < 10) return;

    ReactGA.event('分類互動時間', {
      分類: category === 'all' ? '全部' : PLACE_TYPE_STRING_MAP[category],
      顯示模式: DISPLAY_MODE[displayMode],
      開始互動時間: dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'),
      結束互動時間: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      停留時間: `${durationSeconds}秒`,
    });
  },
  1000
);

function useMapCategoryDurationTracker(
  activeCategory: PlaceType | 'all',
  displayMode: 'mapShow' | 'listShow'
) {
  const prevCategory = useRef<PlaceType | 'all'>(activeCategory);
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    if (prevCategory.current !== activeCategory) {
      handleRecordGAEvent(prevCategory.current, displayMode, startTime.current);
      startTime.current = Date.now();
    }
    prevCategory.current = activeCategory;
  }, [activeCategory]);

  useEffect(() => {
    return () => {
      handleRecordGAEvent(prevCategory.current, displayMode, startTime.current);
    };
  }, []);
}

export default useMapCategoryDurationTracker;
