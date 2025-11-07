'use client';

import ActionButton from '@/components/ActionButton';
import { Place, PLACE_TYPE_STRING_MAP } from '@/lib/types/place';
import { formatDateRange, formatTimeRange } from '@/lib/utils';
import { useModal } from '@/providers/ModalProvider';
import { useToast } from '@/providers/ToastProvider';
import React from 'react';
import { getAssetPath } from '@/lib/utils';
import Image from 'next/image';

interface InfoCardProps {
  place: Place;
  mapUrl?: string | null;
  className?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ place, mapUrl, className = '' }) => {
  const { openDetailModal } = useModal();
  const { showToast } = useToast();

  const displayName = place.name || '未知地點';
  const displayAddress = place.address || place.address_description || '';
  const displayDate = formatDateRange(place.open_date, place.end_date);
  const displayTime = formatTimeRange(place.open_time, place.end_time);
  const displayContact = place.contact_phone || '';
  const isContactUrl = /^https?:\/\/\S+$/.test(displayContact);
  const displayNotes = place.notes || '';
  const displayTags = place.tags?.map(tag => tag.name) || [];

  const handleCopyText = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('已複製到剪貼板:', text);
        showToast('已複製聯絡資訊', 'success');
      })
      .catch(err => {
        console.error('複製失敗:', err);
        showToast('複製聯絡資訊失敗', 'error');
      });
  };

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
          {displayTags &&
            displayTags.map((item: string, idx: number) => (
              <div
                className="flex size-fit px-3 py-1 bg-[var(--gray-4)] text-[var(--gray-2)] text-sm rounded"
                key={idx}
              >
                {item}
              </div>
            ))}
        </div>

        <h3 className="text-lg font-bold text-[var(--gray-2)] mb-2">{displayName}</h3>

        <div className="flex items-start gap-2 text-[#3A3937] mb-1 leading-[20px]">
          <div className="text-[var(--gray-2)] font-medium text-nowrap">類型</div>
          <div className="flex-1">{PLACE_TYPE_STRING_MAP?.[place?.type] || '-'}</div>
        </div>

        {displayAddress && (
          <div className="flex items-start gap-2 text-[#3A3937] mb-1 leading-[20px] font-normal">
            <div className="text-[var(--gray-2)] text-nowrap">地址</div>
            <div className="flex-1">{displayAddress}</div>
          </div>
        )}

        {displayDate && (
          <div className="flex items-start gap-2 text-[#3A3937] mb-1 leading-[20px] font-normal">
            <div className="text-[var(--gray-2)] text-nowrap">日期</div>
            <div className="flex-1">{displayDate}</div>
          </div>
        )}

        {displayTime && (
          <div className="flex items-start gap-2 text-[#3A3937] mb-1 leading-[20px] font-normal">
            <div className="text-[var(--gray-2)] text-nowrap">時段</div>
            <div className="flex-1">{displayTime}</div>
          </div>
        )}

        {place.contact_phone === '-' ? (
          <div className="flex items-start gap-2 text-[#3A3937] mb-1 leading-[20px] font-normal">
            <div className="text-[var(--gray-2)] text-nowrap">聯絡</div>
            <div className="flex-1">{displayContact}</div>
          </div>
        ) : isContactUrl === false ? (
          <div className="flex gap-2 text-[#3A3937] mb-1 leading-[20px] items-center font-normal">
            <div className="text-[var(--gray-2)] text-nowrap">聯絡</div>
            <div
              className="flex gap-2 justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
              onClick={() => handleCopyText(place.contact_phone)}
              title="點擊複製聯絡資訊"
            >
              <div className="flex-1">{displayContact}</div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                <path
                  d="M18 7.66699C18 7.44814 17.9568 7.23149 17.873 7.0293C17.7893 6.82705 17.6665 6.64308 17.5117 6.48828C17.3569 6.33349 17.173 6.21073 16.9707 6.12695C16.7685 6.04323 16.5519 6 16.333 6H7.66699C7.22488 6 6.8009 6.17566 6.48828 6.48828C6.17566 6.8009 6 7.22488 6 7.66699V16.333C6 16.5519 6.04323 16.7685 6.12695 16.9707C6.21073 17.173 6.33349 17.3569 6.48828 17.5117C6.64308 17.6665 6.82705 17.7893 7.0293 17.873C7.23149 17.9568 7.44814 18 7.66699 18H16.333C16.5519 18 16.7685 17.9568 16.9707 17.873C17.1729 17.7893 17.3569 17.6665 17.5117 17.5117C17.6665 17.3569 17.7893 17.1729 17.873 16.9707C17.9568 16.7685 18 16.5519 18 16.333V7.66699ZM0 3C0 1.34772 1.34772 0 3 0H13C13.5623 0 14.0628 0.149771 14.4902 0.459961C14.896 0.754471 15.1695 1.14597 15.374 1.51367C15.6424 1.99627 15.4688 2.60555 14.9863 2.87402C14.5037 3.1424 13.8945 2.96883 13.626 2.48633C13.4886 2.23925 13.3866 2.13082 13.3154 2.0791C13.2659 2.04314 13.1876 2 13 2H3C2.45228 2 2 2.45228 2 3V12.999L2.00879 13.1309C2.02624 13.2611 2.06913 13.3876 2.13574 13.502C2.22456 13.6543 2.35256 13.78 2.50586 13.8672C2.98605 14.14 3.15466 14.7513 2.88184 15.2314C2.60896 15.7115 1.99771 15.8792 1.51758 15.6064C1.05722 15.3448 0.674765 14.9653 0.408203 14.5078C0.14166 14.0502 0.000512057 13.5305 0 13.001V3ZM20 16.333C20 16.8146 19.905 17.2914 19.7207 17.7363C19.5364 18.1812 19.2663 18.5853 18.9258 18.9258C18.5853 19.2663 18.1812 19.5364 17.7363 19.7207C17.2914 19.905 16.8146 20 16.333 20H7.66699C7.18544 20 6.70857 19.905 6.26367 19.7207C5.8188 19.5364 5.41471 19.2663 5.07422 18.9258C4.73373 18.5853 4.46358 18.1812 4.2793 17.7363C4.09501 17.2914 4 16.8146 4 16.333V7.66699C4 6.69445 4.38652 5.76191 5.07422 5.07422C5.76191 4.38652 6.69445 4 7.66699 4H16.333C16.8146 4 17.2914 4.09501 17.7363 4.2793C18.1812 4.46358 18.5853 4.73373 18.9258 5.07422C19.2663 5.41471 19.5364 5.8188 19.7207 6.26367C19.905 6.70857 20 7.18544 20 7.66699V16.333Z"
                  fill="#3A3937"
                />
              </svg>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 text-[#3A3937] mb-1 leading-[20px] items-center font-normal">
            <div className="text-[var(--gray-2)] text-nowrap">聯絡</div>
            <a
              href={displayContact}
              target="_blank"
              rel="noopener noreferrer"
              className="
                h-[36px] py-2 px-3
                min-w-[80px]
                text-sm
                bg-[var(--secondary-light)] text-[var(--secondary)]
                rounded-lg
                cursor-pointer
                flex items-center justify-center gap-1
                whitespace-nowrap
                transition-colors
              "
              title="點擊開啟連結"
            >
              <div style={{ marginBottom: '1px' }}>網站連結</div>
              <Image
                src={getAssetPath('/icon/secondary_up_right_arrow.svg')}
                alt=""
                width={20}
                height={20}
              />
            </a>
          </div>
        )}

        {displayNotes && (
          <div className="flex items-start gap-2 text-[#3A3937] mb-2 leading-[20px] font-normal">
            <div className="text-[var(--gray-2)]">備註</div>
            <div className="flex-1 whitespace-pre-wrap">{displayNotes}</div>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        {mapUrl && <ActionButton href={mapUrl}>導航</ActionButton>}
        <ActionButton
          variant="secondary"
          icon="/info.svg"
          onClick={() => openDetailModal(place.type, displayName, place)}
        >
          查看資訊
        </ActionButton>
      </div>
    </div>
  );
};

export default InfoCard;
