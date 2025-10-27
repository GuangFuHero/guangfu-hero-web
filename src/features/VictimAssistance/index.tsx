'use client';

import Button from '@/components/Button';
import { Place, PlaceType } from '@/lib/types/place';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import PlaceList from '../PlaceList';
import HouseRepairList from './HouseRepairList';
import SupportInformationList from './SupportInformationList';

type Category = '庇護所' | '醫療站' | '心理資源' | '居家修復' | '補助資訊';
type ServiceFormat = '全部' | '實體' | '線上' | '電話' | '多種';

const CATEGORY_TO_PLACE_TYPE: Record<Category, PlaceType | null> = {
  庇護所: PlaceType.SHELTER,
  醫療站: PlaceType.MEDICAL_STATION,
  心理資源: PlaceType.MENTAL_HEALTH_RESOURCE,
  居家修復: null,
  補助資訊: null,
};

const CATEGORY_TO_ROUTE: Record<Category, string> = {
  庇護所: '/victim/shelter',
  醫療站: '/victim/medical',
  心理資源: '/victim/mental-health',
  居家修復: '/victim/house-repair',
  補助資訊: '/victim/support-information',
};

interface VictimAssistanceProps {
  initialCategory?: Category;
}

export default function VictimAssistance({ initialCategory = '庇護所' }: VictimAssistanceProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [selectedServiceFormat, setSelectedServiceFormat] = useState<ServiceFormat>('全部');

  const categories: Category[] = ['庇護所', '醫療站', '心理資源', '居家修復', '補助資訊'];
  const serviceFormats: ServiceFormat[] = ['全部', '實體', '線上', '電話', '多種'];

  const handleFilterPlaces = useCallback(
    (place: Place) => {
      if (selectedCategory !== '心理資源') return true;
      if (selectedServiceFormat === '全部') return true;
      return place?.sub_type === selectedServiceFormat;
    },
    [selectedCategory, selectedServiceFormat]
  );

  const handleCategoryClick = (category: Category) => {
    // 設置選中的分類
    setSelectedCategory(category);

    // 導航到對應的路由
    const route = CATEGORY_TO_ROUTE[category];
    router.push(route);
  };

  let category_content;
  if (CATEGORY_TO_PLACE_TYPE[selectedCategory] !== null) {
    category_content = (
      <PlaceList
        activeTab={CATEGORY_TO_PLACE_TYPE[selectedCategory]}
        onFilterPlaces={handleFilterPlaces}
      />
    );
  } else if (selectedCategory === '居家修復') {
    category_content = <HouseRepairList />;
  } else if (selectedCategory === '補助資訊') {
    category_content = <SupportInformationList />;
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        {categories.map(category => (
          <Button
            key={category}
            onClick={() => handleCategoryClick(category)}
            active={selectedCategory === category}
          >
            {category}
          </Button>
        ))}
      </div>

      {selectedCategory === '心理資源' && (
        <div className="flex gap-2 mb-3">
          {serviceFormats.map(format => (
            <Button
              key={format}
              onClick={() => setSelectedServiceFormat(format)}
              active={selectedServiceFormat === format}
              variant="sub"
            >
              {format}
            </Button>
          ))}
        </div>
      )}

      <div className="space-y-4">{category_content}</div>
    </div>
  );
}
