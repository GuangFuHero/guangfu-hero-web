'use client';

import { LayerType } from '@/types/map';
import { PLACE_TYPE_STRING_MAP, PlaceType } from '@/types/place';

const TABS = [{ id: 'all', label: '全部', type: 'all' as LayerType }].concat(
  Object.values(PlaceType).map(type => ({ id: type, label: PLACE_TYPE_STRING_MAP[type], type }))
);

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
            className={`map-control-btn ${activeLayer === tab.type ? 'active' : ''}`}
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
