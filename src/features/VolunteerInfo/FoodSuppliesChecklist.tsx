import React from 'react';
import ChecklistItem from '@/components/ChecklistItem';
import { ChecklistItemData } from '.';

interface FoodSuppliesChecklistProps {
  checkedItems: Record<string, boolean>;
  onCheckChange: (id: string) => void;
}

const foodSuppliesItems: ChecklistItemData[] = [
  {
    id: 'water',
    label: '飲用水',
    description: '足量！非常重要！',
  },
  {
    id: 'food_snacks',
    label: '簡易乾糧、零食',
    description: '避免低血糖',
  },
  {
    id: 'supplement',
    label: '鹽糖or沖泡錠 / 電解質補給品',
    description: '補充鹽分，鹽糖使用發放更佳',
  },
  {
    id: 'tableware',
    label: '環保餐具',
    description: '避免製造額外垃圾',
  },
];

const FoodSuppliesChecklist: React.FC<FoodSuppliesChecklistProps> = ({
  checkedItems,
  onCheckChange,
}) => {
  return (
    <div>
      <h4 className="font-bold text-base mb-3">四、食物與補給</h4>
      <div className="space-y-3">
        {foodSuppliesItems.map(item => (
          <ChecklistItem
            key={item.id}
            id={item.id}
            label={item.label}
            description={item.description}
            checked={checkedItems[item.id] || false}
            onChange={onCheckChange}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodSuppliesChecklist;
