import React from 'react';
import ChecklistItem from '@/components/ChecklistItem';
import { ChecklistItemData } from '.';

interface DisasterReliefToolsChecklistProps {
  checkedItems: Record<string, boolean>;
  onCheckChange: (id: string) => void;
}

const disasterReliefToolsItems: ChecklistItemData[] = [
  {
    id: 'hammer',
    label: '鐵鎚（比木鎚輕鬆很多）、香蕉鎚、樹鎚',
  },
  {
    id: 'pickaxe',
    label: '十字鎬、鋤頭',
    description: '破土',
  },
  {
    id: 'chisel',
    label: '耙子',
    description: '鬆土',
  },
  {
    id: 'shovel',
    label: '方鏟',
    description: '鏟土',
  },
  {
    id: 'basket',
    label: '鐵畚箕、小水桶、兩格籃',
    description: '裝土（不用太大，淤泥很重）',
  },
  {
    id: 'wheel_vehicle',
    label: '獨立輪車',
    description: '回程替換用',
  },
  {
    id: 'trash_bag',
    label: '垃圾袋',
    description: '建議穿過衣服回程換完裝袋丟棄，避免細菌感染。現場垃圾需要袋裝。',
  },
];

const DisasterReliefToolsChecklist: React.FC<DisasterReliefToolsChecklistProps> = ({
  checkedItems,
  onCheckChange,
}) => {
  return (
    <div>
      <h4 className="font-bold text-base mb-3">五、救災工具</h4>
      <div className="space-y-3">
        {disasterReliefToolsItems.map(item => (
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

export default DisasterReliefToolsChecklist;
