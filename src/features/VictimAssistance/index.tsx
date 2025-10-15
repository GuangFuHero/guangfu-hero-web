'use client';

import Button from '@/components/Button';
import { PlaceType } from '@/lib/types/place';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PlaceList from '../PlaceList';

type Category = '庇護所' | '醫療站' | '心理資源';
type ServiceFormat = '全部' | '實體' | '線上' | '電話' | '多種';

const CATEGORY_TO_PLACE_TYPE: Record<Category, PlaceType> = {
  庇護所: PlaceType.SHELTER,
  醫療站: PlaceType.MEDICAL_STATION,
  心理資源: PlaceType.MENTAL_HEALTH_RESOURCE,
};

const CATEGORY_TO_ROUTE: Record<Category, string> = {
  庇護所: '/victim/shelter',
  醫療站: '/victim/medical',
  心理資源: '/victim/mental-health',
};

interface VictimAssistanceProps {
  initialCategory?: Category;
}

export default function VictimAssistance({ initialCategory = '庇護所' }: VictimAssistanceProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [selectedServiceFormat, setSelectedServiceFormat] = useState<ServiceFormat>('全部');

  const categories: Category[] = ['庇護所', '醫療站', '心理資源'];
  const serviceFormats: ServiceFormat[] = ['全部', '實體', '線上', '電話', '多種'];

  const handleCategoryClick = (category: Category) => {
    // 設置選中的分類
    setSelectedCategory(category);

    // 導航到對應的路由
    const route = CATEGORY_TO_ROUTE[category];
    router.push(route);
  };

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

      <div className="space-y-4">
        <PlaceList activeTab={CATEGORY_TO_PLACE_TYPE[selectedCategory]} />
      </div>
    </div>
  );
}
