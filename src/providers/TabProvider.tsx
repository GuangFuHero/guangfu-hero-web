'use client';

import { PlaceTab } from '@/lib/types/map';
import { createContext, ReactNode, useContext, useState } from 'react';

interface TabContextType {
  activeTab: PlaceTab;
  setActiveTab: (tab: PlaceTab) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const useTab = () => {
  const context = useContext(TabContext);
  if (context === undefined) {
    throw new Error('useTab must be used within a TabProvider');
  }
  return context;
};

interface TabProviderProps {
  children: ReactNode;
  defaultTab?: PlaceTab;
}

export function TabProvider({ children, defaultTab = 'all' }: TabProviderProps) {
  const [activeTab, setActiveTab] = useState<PlaceTab>(defaultTab);

  return <TabContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabContext.Provider>;
}
