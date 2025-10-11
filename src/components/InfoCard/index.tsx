'use client';

import React, { useEffect, useState } from 'react';
import ActionButton from '@/components/ActionButton';
import {
  Accommodations,
  RestRooms,
  Shelter,
  MedicalStation,
  MentalHealthResource,
  WaterRefillStations,
  ShowerStations,
} from '@/lib/types';
import DetailModal from './DetailModal';

export type DataType =
  | Shelter
  | MedicalStation
  | MentalHealthResource
  | WaterRefillStations
  | ShowerStations
  | RestRooms
  | Accommodations;

interface InfoCardProps {
  name: string;
  address?: string;
  type?: string;
  hours?: string;
  contact?: string;
  infoUrl?: string;
  mapUrl?: string;
  className?: string;
  tags?: string[];
  fullData?: DataType;
}

const InfoCard: React.FC<InfoCardProps> = ({
  name,
  address,
  type,
  hours,
  contact,
  mapUrl,
  className = '',
  tags,
  fullData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 處理 modal 打開時鎖定滾動
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <div
      className={`
      bg-white
      border-b border-[var(--gray-3)]
      px-1
      py-3
      ${className}
    `}
    >
      <div className="flex flex-col pr-1">
        <div className="flex flex-row gap-2 mb-1">
          {tags &&
            tags.map((item, idx) => (
              <div
                className="flex size-fit px-3 py-1 bg-[var(--gray-4)] text-[var(--gray-2)] text-sm rounded"
                key={idx}
              >
                {item}
              </div>
            ))}
        </div>
        <h3 className="text-xl font-bold text-[var(--text-black)] mb-1">{name}</h3>
        {address && (
          <div className="flex items-start gap-1 text-[var(--text-black)] mb-2">
            <span>{address}</span>
          </div>
        )}
        <div className="flex items-start gap-2 text-[var(--gray-2)]">
          <div className="text-[var(--text-black)] font-medium w-10">類型</div>
          <div className="w-[290px]">{type || '未提供'}</div>
        </div>
        <div className="flex items-start gap-2 text-[var(--gray-2)] mb-2">
          <div className="font-medium w-10">{hours ? '時段' : '資訊'}</div>
          <div className="w-[290px]">{hours ? hours : contact || '未提供'}</div>
        </div>
      </div>
      <div className="flex gap-2">
        {mapUrl && <ActionButton href={mapUrl}>導航</ActionButton>}
        {fullData && (
          <ActionButton variant="secondary" icon="/info.svg" onClick={() => setIsModalOpen(true)}>
            查看資訊
          </ActionButton>
        )}
        {contact && (
          <ActionButton variant="secondary" icon="/call.svg" href={`tel:${contact}`}>
            立即聯絡
          </ActionButton>
        )}
      </div>

      {/* 彈窗 */}
      {isModalOpen && (
        <DetailModal
          onClose={() => setIsModalOpen(false)}
          type={type}
          name={name}
          fullData={fullData}
        />
      )}
    </div>
  );
};

export default InfoCard;
