'use client';

import { LayerType } from '@/types/map';

const TABS = [
  { id: 'all', label: '全部', type: 'all' as LayerType },
  { id: 'waterStation', label: '加水站', type: 'waterStation' as LayerType },
  { id: 'restroom', label: '廁所', type: 'restroom' as LayerType },
  {
    id: 'showerStation',
    label: '洗澡點',
    type: 'showerStation' as LayerType,
  },
  {
    id: 'medicalStation',
    label: '醫療站',
    type: 'medicalStation' as LayerType,
  },
  { id: 'accommodation', label: '住宿', type: 'accommodation' as LayerType },
];

interface BottomTabsProps {
  activeLayer: LayerType;
  onLayerChange: (layerType: LayerType) => void;
  onToggleInfo: () => void;
  isSidebarOpen: boolean;
}

export default function BottomTabs({
  activeLayer,
  onLayerChange,
  onToggleInfo,
  isSidebarOpen,
}: BottomTabsProps) {
  return (
    <div className="bottom-tabs-panel">
      <div className="control-buttons">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`map-control-btn ${
              activeLayer === tab.type ? 'active' : ''
            }`}
            onClick={() => onLayerChange(tab.type)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <button className="btn btn-primary text-sm" onClick={onToggleInfo}>
        {isSidebarOpen ? '關閉' : '更多'}
      </button>
    </div>
  );
}
