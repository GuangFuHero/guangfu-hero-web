import React from 'react';
import ChecklistItem from '@/components/ChecklistItem';
import { ChecklistItemData } from '.';

interface ClothingProtectionChecklistProps {
  checkedItems: Record<string, boolean>;
  onCheckChange: (id: string) => void;
}

const clothingProtectionItems: ChecklistItemData[] = [
  {
    id: 'clothes',
    label: '長袖、長褲',
    description: [
      '較佳 — 快乾透氣材質（如聚酯纖維、運動布料）、深色耐髒（如舊衣或工作服）',
      '避免 — 牛仔褲、厚棉衣物、白色/淺色衣物',
    ],
  },
  {
    id: 'shoes',
    label: '厚襪子',
    description: '避免雨鞋磨破腳',
  },
  {
    id: 'hat',
    label: '帽子',
  },
  {
    id: 'mask',
    label: '口罩',
    description: '外科手術口罩，需有衛服部字號、字號不能有「壹」',
  },
  {
    id: 'protection',
    label: '防蚊液',
    description: '建議可防小黑蚊，如曼秀雷敦綠色款，含有派卡瑞丁成分者',
  },
  {
    id: 'spare',
    label: '乾淨衣物、鞋子',
    description: '回程替換用',
  },
];

const ClothingProtectionChecklist: React.FC<ClothingProtectionChecklistProps> = ({
  checkedItems,
  onCheckChange,
}) => {
  return (
    <div>
      <h4 className="font-bold text-base mb-3">一、衣物與防護</h4>
      <div className="space-y-3">
        {clothingProtectionItems.map(item => (
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

export default ClothingProtectionChecklist;
