import React from 'react';
import ChecklistItem from '@/components/ChecklistItem';
import { ChecklistItemData } from '.';

interface MedicalItemsChecklistProps {
  checkedItems: Record<string, boolean>;
  onCheckChange: (id: string) => void;
}

const medicalItems: ChecklistItemData[] = [
  {
    id: 'personal_medications',
    label: '個人常用藥',
    description: '感冒藥、止痛藥、止瀉藥',
  },
  {
    id: 'alcohol',
    label: '酒精（消毒用）',
    description: '防刺傷！可至五金行採購',
  },
  {
    id: 'first_aid_kit',
    label: '急救包',
    description:
      '止血帶、三角巾、彈性繃帶、大小紗布、大小棉棒、防水OK繃、優碘、沖洗用生理食鹽水、抗生素藥膏',
  },
];

const MedicalItemsChecklist: React.FC<MedicalItemsChecklistProps> = ({
  checkedItems,
  onCheckChange,
}) => {
  return (
    <div>
      <h4 className="font-bold text-base mb-3">三、醫療與藥品</h4>
      <div className="space-y-3">
        {medicalItems.map(item => (
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

export default MedicalItemsChecklist;
