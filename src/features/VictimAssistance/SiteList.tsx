import { env } from '@/config/env';
import Button from '@/components/Button';
import { useToast } from '@/providers/ToastProvider';
import { useCallback, useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import ReactGA from 'react-ga4';
import { getAssetPath } from '@/lib/utils';
import Image from 'next/image';
import { useAllPlaces } from '@/hooks/useMapData';
import { PlaceTab } from '@/lib/types/map';
import { PLACE_CONFIG } from '@/features/MapContainer/ReactLeafletMap/place.config';
import { PLACE_TYPE_STRING_MAP, Place, PlaceType } from '@/lib/types/place';
import PlaceList from '../PlaceList';

type PlaceListData = {
  name: string;
  label: string;
  value: PlaceTab;
};

export default function SiteList() {
  //typeName: ACCOMMODATION,WATER_STATION... PlaceType.key
  //type: 全部,注水站,... PLACE_TYPE_STRING_MAP.value
  //value: PlaceType.value
  const [currentType, setCurrentType] = useState<PlaceListData>({
    name: 'all',
    label: '全部',
    value: 'all' as PlaceTab,
  });

  const allPlaceType = [
    {
      name: 'all',
      label: '全部',
      value: 'all' as PlaceTab,
    },
    {
      name: 'REPAIR_STATION',
      label: '維修站',
      value: '維修' as PlaceTab,
    },
    {
      name: 'MEDICAL_STATION',
      label: '醫療站',
      value: '醫療' as PlaceTab,
    },
    {
      name: 'ACCOMMODATION',
      label: '住宿點',
      value: '住宿' as PlaceTab,
    },
    {
      name: 'RESTROOM',
      label: '廁所',
      value: '廁所' as PlaceTab,
    },
    {
      name: 'SHOWER_STATION',
      label: '洗澡點',
      value: '洗澡' as PlaceTab,
    },
    /*
        ...Object.entries(PlaceType).map(([PlaceTypeName, type]) => {
      return {
        name: PlaceTypeName,
        label: PLACE_TYPE_STRING_MAP[type],
        value: type as PlaceTab,
      };
    }),
    */
  ];

  const handleTypeClick = (type: PlaceListData) => {
    ReactGA.event(`'光復站點'_${type.label}`);
    setCurrentType(type);
  };

  const handleFilterPlaces = useCallback(
    (place: Place) => {
      if (currentType.value === 'all') return true;
      return place?.type === currentType.value;
    },
    [currentType]
  );

  useEffect(() => {}, [currentType]);

  return (
    <>
      {/* type buttons */}
      <div className="flex gap-2 mb-3 sm:flex-wrap overflow-y-auto">
        {allPlaceType.map(type => (
          <Button
            key={type.label}
            onClick={() => handleTypeClick(type)}
            active={type.label === currentType.label}
            variant="sub"
          >
            {type.label}
          </Button>
        ))}
      </div>
      <div className="overflow-y-auto">
        {currentType.label === '' ? (
          <div className="overflow-y-auto">
            <div className="space-y-4 mb-[80px] px-[16px] md:px-[32px] ">
              <div className="text-center py-8 text-[var(--gray)]">請選擇站點分類</div>
            </div>
          </div>
        ) : currentType.label === '全部' ? (
          <PlaceList key={currentType.name} activeTab={currentType.value} />
        ) : (
          <PlaceList
            key={currentType.name}
            activeTab={currentType.value}
            onFilterPlaces={handleFilterPlaces}
          />
        )}
      </div>
    </>
  );
}
