'use client';

import React, { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { DataType } from './index';
import ReportModal from './ReportModal';

interface DetailModalProps {
  onClose: () => void;
  type?: string;
  name: string;
  fullData: DataType | undefined;
}

const fieldLabels: Record<string, string> = {
  address: '地址',
  affiliated_organization: '所屬單位',
  capacity: '容量',
  contact_info: '聯絡資訊',
  contact_person: '聯絡人',
  created_at: '建立時間',
  daily_capacity: '每日可收納',
  detailed_address: '地址',
  emergency_support: '緊急支援',
  equipment: '設備',
  facilities: '設施',
  is_free: '是否免費',
  languages: '語言',
  link: '連結',
  location: '地點',
  medical_staff: '醫療人員',
  name: '名稱',
  note: '備註',
  notes: '備註',
  opening_hours: '開放時間',
  operating_hours: '營運時間',
  phone: '電話',
  service_format: '服務形式',
  service_hours: '服務時間',
  services: '提供服務',
  specialties: '專長',
  station_type: '類型',
  status: '狀態',
  target_audience: '服務對象',
  updated_at: '更新時間',
  waiting_time: '等候時間',
  website_url: '網站',
};

const excludeFields = ['id', 'coordinates'];
const timeFields = ['created_at', 'updated_at'];

const DetailModal = ({ onClose, type, name, fullData }: DetailModalProps) => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const getFormattedData = useCallback(() => {
    if (!fullData) return [];

    return Object.entries(fullData)
      .filter(([key, value]) => {
        if (excludeFields.includes(key)) return false;
        if (!fieldLabels[key]) return false;
        if (value === null || value === undefined || value === '') return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (Array.isArray(value) && value.every(item => item === 'string' || item === null))
          return false;
        if (value === 'string') return false;
        return true;
      })
      .map(([key, value]) => ({
        label: fieldLabels[key],
        value: timeFields.includes(key)
          ? dayjs.unix(Number(value)).format('YYYY-MM-DD HH:mm')
          : value,
      }));
  }, [fullData]);

  const formattedData = useMemo(() => getFormattedData(), [getFormattedData]);

  const handleReportClose = () => {
    setIsReportModalOpen(false);
    onClose();
  };

  return (
    <div>
      <div
        className="fixed inset-0 z-40 backdrop-blur-sm bg-[var(--black-overlay)]"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-end pointer-events-none">
        <div
          className="bg-white rounded-t-2xl w-full max-h-[85vh] overflow-y-auto animate-slide-up shadow-lg pointer-events-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start p-6 pb-4">
            <div className="px-3 py-1 bg-[var(--gray-4)] text-[var(--gray-2)] text-sm rounded">
              {type || '定點'}
            </div>
            <button
              onClick={onClose}
              className="text-[var(--gray-2)] hover:text-[var(--gray)] text-xl"
            >
              ✕
            </button>
          </div>

          <div className="px-6 pb-4">
            <h2 className="pb-2 border-b border-[var(--gray-3)] text-xl font-bold text-[var(--text-black)]">
              {name}
            </h2>
          </div>

          <div className="px-6 pb-6 space-y-4">
            {formattedData.length > 0 ? (
              formattedData.map(({ label, value }, index) => (
                <div key={index} className="flex gap-3">
                  <div className="text-[text-[var(--text-black)]] min-w-[80px] shrink-0 whitespace-nowrap">
                    {label}
                  </div>
                  <div className="text-[var(--gray-2)] flex-1 break-words overflow-wrap-anywhere">
                    {Array.isArray(value) ? (
                      value.join('、')
                    ) : typeof value === 'boolean' ? (
                      value ? (
                        '是'
                      ) : (
                        '否'
                      )
                    ) : typeof value === 'object' && value !== null ? (
                      JSON.stringify(value, null, 2)
                    ) : label === '連結' || label === '網站' ? (
                      <a
                        href={String(value)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#009688] underline break-all"
                      >
                        {String(value)}
                      </a>
                    ) : (
                      String(value) || '未提供'
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[var(--gray)]">無詳細資料</div>
            )}
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full bg-[var(--primary)] text-white py-3 rounded-lg font-medium hover:bg-[#B55815] transition-colors"
            >
              回報問題
            </button>
          </div>
        </div>
      </div>

      {isReportModalOpen && fullData && (
        <ReportModal
          isOpen={isReportModalOpen}
          onClose={handleReportClose}
          locationType={type || '定點'}
          locationName={name}
          locationId={fullData.id}
        />
      )}
    </div>
  );
};

export default DetailModal;
