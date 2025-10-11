'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import TabButton from '@/components/Tab';
import VictimAssistance from '@/features/VictimAssistance';
import VolunteerInfo from '@/features/VolunteerInfo';
import SiteMap from '@/features/SiteMap';

type Tab = '現場地圖' | '志工資訊' | '居民協助';
type TabKey = 'map' | 'volunteer' | 'victim';

const tabMapping: Record<TabKey, Tab> = {
  map: '現場地圖',
  volunteer: '志工資訊',
  victim: '居民協助',
};

const reverseTabMapping: Record<Tab, TabKey> = {
  現場地圖: 'map',
  志工資訊: 'volunteer',
  居民協助: 'victim',
};

function TabsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab') as TabKey | null;

  const [activeTab, setActiveTab] = useState<Tab>(
    tabParam && tabMapping[tabParam] ? tabMapping[tabParam] : '現場地圖'
  );

  const tabs: Tab[] = ['現場地圖', '志工資訊', '居民協助'];

  useEffect(() => {
    if (tabParam && tabMapping[tabParam]) {
      setActiveTab(tabMapping[tabParam]);
    }
  }, [tabParam]);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    const tabKey = reverseTabMapping[tab];
    router.push(`/?tab=${tabKey}`, { scroll: false });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex border-b-2 border-[var(--gray-3)]">
        {tabs.map(tab => (
          <TabButton key={tab} onClick={() => handleTabClick(tab)} active={activeTab === tab}>
            {tab}
          </TabButton>
        ))}
      </div>

      <div className="mt-3">
        {activeTab === '現場地圖' && <SiteMap />}
        {activeTab === '志工資訊' && <VolunteerInfo />}
        {activeTab === '居民協助' && <VictimAssistance />}
      </div>
    </div>
  );
}

export default function Tabs() {
  return (
    <Suspense
      fallback={<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">載入中...</div>}
    >
      <TabsContent />
    </Suspense>
  );
}
