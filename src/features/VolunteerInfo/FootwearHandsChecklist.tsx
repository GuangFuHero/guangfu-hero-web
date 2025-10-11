import React from 'react';
import ChecklistItem from '@/components/ChecklistItem';
import { ChecklistItemData } from '.';

interface FootwearHandsChecklistProps {
  checkedItems: Record<string, boolean>;
  onCheckChange: (id: string) => void;
}

const footwearHandsItems: ChecklistItemData[] = [
  {
    id: 'rain_boots',
    label: '長筒雨鞋',
    description: '避免被淤泥吸住或進水。綁帶佳，無綁帶者建議高度至小腿度以上。必穿厚襪子保護雙腳！',
  },
  {
    id: 'work_shoes',
    label: '鐵鞋墊',
    description: '防刺傷！可至五金行採購',
  },
  {
    id: 'shoe_insoles',
    label: '鞋墊',
    description: '增加舒適度，需走很遠的路（無鞋墊可以衛生棉取代）',
  },
  {
    id: 'gloves',
    label: '防滑手套、輸胎手套',
    description: '保護更佳，可至好市多採購',
  },
  {
    id: 'rubber_gloves',
    label: '乳膠手套（內層）',
  },
];

const FootwearHandsChecklist: React.FC<FootwearHandsChecklistProps> = ({
  checkedItems,
  onCheckChange,
}) => {
  return (
    <div>
      <h4 className="font-bold text-base mb-3">二、鞋具與手部</h4>
      <div className="space-y-3">
        {footwearHandsItems.map(item => (
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

export default FootwearHandsChecklist;
