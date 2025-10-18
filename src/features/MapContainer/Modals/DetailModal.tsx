'use client';

import ActionButton from '@/components/ActionButton';
import { formatDateRange, formatTimeRange, getGoogleMapsUrl } from '@/lib/utils';
import { useModal } from '@/providers/ModalProvider';
import { useMemo } from 'react';

const DetailModal = () => {
  const { isDetailModalOpen, detailData, closeModal, openReportModal } = useModal();

  const formattedData = useMemo(() => {
    if (!detailData?.fullData) return [];

    const place = detailData.fullData;
    const entries: Array<{ label: string; value: string; isLink?: boolean }> = [];

    if (place.address) {
      entries.push({
        label: '地址',
        value: place.address,
      });
    }

    const displayDate = formatDateRange(place.open_date, place.end_date);
    if (displayDate) {
      entries.push({
        label: '開放日期',
        value: displayDate,
      });
    }

    const displayTime = formatTimeRange(place.open_time, place.end_time);
    if (displayTime) {
      entries.push({
        label: '開放時段',
        value: displayTime,
      });
    }

    if (place.contact_phone && place.contact_phone !== '-') {
      entries.push({
        label: '聯絡',
        value: place.contact_phone,
      });
    }

    if (place.contact_name) {
      entries.push({
        label: '聯絡人',
        value: place.contact_name,
      });
    }

    if (place.website_url) {
      entries.push({
        label: '網站連結',
        value: place.website_url,
        isLink: true,
      });
    }

    if (place.info_sources && place.info_sources.length > 0) {
      entries.push({
        label: '資訊來源',
        value: place.info_sources.join('、'),
      });
    }

    if (place.notes) {
      entries.push({
        label: '備註',
        value: place.notes,
      });
    }

    if (place.tags && place.tags.length > 0) {
      entries.push({
        label: '標籤',
        value: place.tags.map(tag => tag.name).join('、'),
      });
    }

    if (place.resources && place.resources.length > 0) {
      entries.push({
        label: '資源',
        value: place.resources
          .map(resource => `${resource.name} (${resource?.amount || 0}${resource.unit})`)
          .join('、'),
      });
    }

    // if (place.created_at) {
    //   entries.push({
    //     label: '建立時間',
    //     value: dayjs.unix(place.created_at).format('YYYY-MM-DD HH:mm'),
    //   });
    // }

    // if (place.updated_at) {
    //   entries.push({
    //     label: '更新時間',
    //     value: dayjs.unix(place.updated_at).format('YYYY-MM-DD HH:mm'),
    //   });
    // }

    return entries;
  }, [detailData]);

  const handleReportClick = () => {
    if (detailData) {
      openReportModal(detailData.type || '定點', detailData.fullData.id, detailData.name);
    }
  };

  if (!isDetailModalOpen || !detailData) return null;

  const { name } = detailData;
  const googleMapsUrl = getGoogleMapsUrl(detailData?.fullData?.coordinates);

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 z-1000 backdrop-blur-sm bg-[var(--black-overlay)]"
        onClick={closeModal}
      />

      {/* Modal 內容 */}
      <div className="fixed inset-0 z-1001 flex items-end pointer-events-none">
        <div
          className="bg-white rounded-t-2xl w-full max-h-[85vh] animate-slide-up shadow-lg pointer-events-auto flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-start p-6 pb-4 flex-shrink-0">
            <h2 className="text-xl font-bold text-[var(--text-black)]">{name}</h2>
            <button
              onClick={closeModal}
              className="text-[var(--gray-2)] hover:text-[var(--gray)] text-xl cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-6 pb-6 space-y-4">
              {formattedData.length > 0 ? (
                formattedData.map(({ label, value, isLink }, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="text-[var(--gray-2)] min-w-[80px] shrink-0 whitespace-nowrap">
                      {label}
                    </div>
                    <div className="text-[var(--text-black)] flex-1 break-words overflow-wrap-anywhere">
                      {isLink ? (
                        <a
                          href={value}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#009688] underline break-all hover:text-[#00796b]"
                        >
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-[var(--gray)] py-8">無詳細資料</div>
              )}
            </div>
          </div>

          <div className="px-6 pb-6 flex-shrink-0">
            <div className="flex gap-3">
              {googleMapsUrl && (
                <ActionButton
                  href={googleMapsUrl}
                  variant="primary"
                  icon="/nav.svg"
                  className="flex-1"
                >
                  <p className="text-white">導航</p>
                </ActionButton>
              )}
              <button
                onClick={handleReportClick}
                className={`${googleMapsUrl ? 'flex-3' : 'w-full'} cursor-pointer bg-[var(--primary)] text-white rounded-lg font-normal text-[16px] leading-[20px] hover:bg-[#B55815] transition-colors`}
              >
                回報問題
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailModal;
