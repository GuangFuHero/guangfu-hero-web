import React from 'react';
import ChecklistItem from '@/components/ChecklistItem';
import { ChecklistItemData } from '.';

interface OtherEssentialChecklistProps {
  checkedItems: Record<string, boolean>;
  onCheckChange: (id: string) => void;
}

const otherEssentialItems: ChecklistItemData[] = [
  {
    id: 'charger',
    label: '行動電源/手機充電器',
  },
  {
    id: 'waterproof_bag',
    label: '透明防水袋',
    description: '放置個人錢財，目前都是暫放屋主家中',
  },
  {
    id: 'zipper_bag',
    label: '夾鏈袋',
    description: '可保護手機，避免粉塵進入充電孔或手機內部',
  },
  {
    id: 'small_canvas',
    label: '小帆布',
  },
  {
    id: 'plastic_bag',
    label: '大塑膠袋或米袋',
    description: '放置背包或收納',
  },
  {
    id: 'headlights',
    label: '頭燈（夜間照明）',
  },
  {
    id: 'baihua_oil',
    label: '百花油',
    description: '太陽照射，氣味濃郁，很多人受不了',
  },
  {
    id: 'nails',
    label: '記得剪指甲',
    description: '避免藏污或斷裂',
  },
  {
    id: 'id_card',
    label: '專才志工識別證（往下滑可下載）',
    description: '快速辨識你的專業能力，立馬派遣工作，成為災區即戰力',
  },
];

const OtherEssentialChecklist: React.FC<OtherEssentialChecklistProps> = ({
  checkedItems,
  onCheckChange,
}) => {
  return (
    <div>
      <h4 className="font-bold text-base mb-3">六、其他必備物品</h4>
      <div className="space-y-3">
        {otherEssentialItems.map(item => (
          <ChecklistItem
            key={item.id}
            id={item.id}
            label={item.label}
            description={item.description}
            checked={checkedItems[item.id] || false}
            onChange={onCheckChange}
            highlight={item.highlight}
          />
        ))}
      </div>
    </div>
  );
};

export default OtherEssentialChecklist;
