'use client';

import Button from '@/components/Button';
import { Place, PlaceType } from '@/lib/types/place';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import PlaceList from '../PlaceList';
import HouseRepairList from './HouseRepairList';
import SupportInformationList from './SupportInformationList';
import SiteList from './SiteList';
import Link from 'next/link';
import BottomSheet from '@/components/BottomSheet';
import SearchCardLink from '@/app/_home/components/SearchCardLink';
import { searchCards } from '@/constants/searchCards';
import '@/app/_home/home.css';

type Category = '心理資源' | '居家修繕' | '補助貸款' | '光復站點' | '庇護所' | '醫療站';
type ServiceFormat = '全部' | '實體' | '線上' | '電話' | '多種';

const CATEGORY_TO_PLACE_TYPE: Record<Category, PlaceType | null> = {
  庇護所: PlaceType.SHELTER,
  醫療站: PlaceType.MEDICAL_STATION,
  心理資源: PlaceType.MENTAL_HEALTH_RESOURCE,
  居家修繕: null,
  補助貸款: null,
  光復站點: null,
};

const CATEGORY_TO_ROUTE: Record<Category, string> = {
  庇護所: '/victim/shelter',
  醫療站: '/victim/medical',
  心理資源: '/victim/mental-health',
  居家修繕: '/victim/house-repair',
  補助貸款: '/victim/support-information',
  光復站點: '/victim/site',
};

interface VictimAssistanceProps {
  initialCategory?: Category;
}

export default function VictimAssistance({ initialCategory = '補助貸款' }: VictimAssistanceProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [selectedServiceFormat, setSelectedServiceFormat] = useState<ServiceFormat>('全部');
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const categories: Category[] = ['補助貸款', '居家修繕', '心理資源', '光復站點'];
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
        category={selectedCategory}
      />
    );
  } else if (selectedCategory === '居家修繕') {
    category_content = <HouseRepairList />;
  } else if (selectedCategory === '補助貸款') {
    category_content = <SupportInformationList />;
  } else if (selectedCategory === '光復站點') {
    category_content = <SiteList />;
  }

  return (
    <div>
      {/* 頂部區塊：左右對齊 */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsBottomSheetOpen(true)}
          className="flex items-center gap-2 text-black hover:text-[var(--primary)] font-medium text-2xl hover:opacity-80 transition-opacity cursor-pointer"
        >
          <span>{selectedCategory}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-transform"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <Link
          href="/"
          className="text-[var(--gray)] hover:text-[var(--primary)] transition-colors text-base"
        >
          回首頁
        </Link>
      </div>

      {selectedCategory === '心理資源' && (
        <div className="flex gap-2 mb-3 overflow-y-auto">
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

      {/* BottomSheet：顯示搜尋卡片選單 */}
      <BottomSheet
        open={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
        title="選擇類別"
      >
        <div className="searchBoxs grid grid-cols-2 gap-3">
          {searchCards.map(({ href, title, subtitle, Icon }) => (
            <SearchCardLink
              className="boxLink"
              key={title}
              href={href}
              gaLabel={title}
              onClick={() => setIsBottomSheetOpen(false)}
            >
              <h3 className="sticky top-0">{title}</h3>
              <small>{subtitle}</small>
              <Icon />
            </SearchCardLink>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}
