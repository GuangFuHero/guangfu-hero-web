import { env } from '@/config/env';
import Button from '@/components/Button';
import { useToast } from '@/providers/ToastProvider';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import ReactGA from 'react-ga4';
import { usePathname } from 'next/navigation';
import { getAssetPath } from '@/lib/utils';
import Image from 'next/image';
import ShareAction from '@/components/ShareAction';
import BottomSheet from '@/components/BottomSheet';

type HouseRepairDataRow = {
  repair_id: string;
  name: string;
  type: string;
  contact: string;
  phone: string;
};
type HouseRepairData = HouseRepairDataRow[];

export default function HouseRepairList() {
  const { showToast } = useToast();

  const [fetchDataFail, setFetchDataFail] = useState<boolean>(false);
  const [houseRepairTypes, setHouseRepairTypes] = useState<string[]>([]);
  const [houseRepairData, setHouseRepairData] = useState<HouseRepairData>([]);
  const [currentType, setCurrentType] = useState<string>('全部');
  const [isDetailCardOpen, setIsDetailCardOpen] = useState(false);
  const [selectedRepairId, setSelectedRepairId] = useState<string | null>(null);
  const pathname = usePathname();

  const handleTypeClick = (type: string) => {
    ReactGA.event(`居家修繕_${type}`);
    setCurrentType(type);
  };

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

  useEffect(() => {
    async function fetchRepairData() {
      try {
        // fetch Google sheet at client side
        const sheetId = env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
        const gid = env.NEXT_PUBLIC_HOUSE_REPAIR_SHEET_GID;

        if (!sheetId) {
          throw new Error('NEXT_PUBLIC_GOOGLE_SHEET_ID not configured');
        } else if (!gid) {
          throw new Error('NEXT_PUBLIC_HOUSE_REPAIR_SHEET_GID not configured');
        }

        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
        const response = await fetch(csvUrl);
        const csvText = await response.text();

        // check if the return text is HTML (unexpected)
        if (csvText.includes('<!DOCTYPE') || csvText.includes('<html')) {
          throw new Error('Google Sheets not accessible');
        }

        const dataLines = csvText.trim().split('\r\n');

        const houseRepairTypes: string[] = ['全部'];
        const houseRepairData: HouseRepairData = [];
        let currentType: string = '';
        dataLines.forEach(line => {
          const [repair_id, first, second, third] = line.split(',');
          if (!first) return;
          if (second === '' && third === '') {
            // type row
            currentType = first.trim();
            houseRepairTypes.push(currentType);
          } else if (second && third) {
            if (!currentType) return;
            if (first === '廠商名稱') return;

            // data row
            const indexFound = houseRepairData.findIndex(row => {
              return (
                row.type === currentType &&
                row.name === first.trim() &&
                row.contact === second.trim()
              );
            });

            if (indexFound === -1) {
              // not found
              houseRepairData.push({
                repair_id: repair_id.trim(),
                name: first.trim(),
                type: currentType,
                contact: second.trim(),
                phone: third.trim(),
              });
            } else {
              // found
              // console.log('重複的聯絡人：');
              // console.log(`${first} - ${second}`);
              // console.log(
              //   `前一筆的電話: ${houseRepairData[indexFound].phone} || 新一筆的電話: ${third}`
              // );
            }
          }
        });

        setHouseRepairTypes(houseRepairTypes);
        setHouseRepairData(houseRepairData);
      } catch (error) {
        setFetchDataFail(true);
        console.error('Failed to fetch house repair data:', error);
      }
    }

    fetchRepairData();
  }, [currentType]);

  useLayoutEffect(() => {
    const hash = window.location.hash;
    if (!hash || houseRepairData.length === 0) return; // ← 要等資料準備好

    const id = hash.substring(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSelectedRepairId(id);
      setIsDetailCardOpen(true);
    }
  }, [houseRepairData, currentType, pathname]);

  if (houseRepairTypes.length === 0) {
    if (fetchDataFail) {
      return (
        <div className="text-center text-base/9 py-8 text-[var(--gray)] mb-[80vh]">
          載入資料失敗
          <br />
          您可以試著重新整理頁面
          <br />
          若此問題仍持續發生，煩請利用回報功能通知管理員
        </div>
      );
    }

    return <div className="text-center py-8 text-[var(--gray)] mb-[80vh]">載入中...</div>;
  }

  return (
    <>
      {/* type buttons */}
      <div className="flex gap-2 mb-3 sm:flex-wrap">
        {houseRepairTypes.map(type => (
          <Button
            key={type}
            onClick={() => handleTypeClick(type)}
            active={type === currentType}
            variant="sub"
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="mb-[80px]">
        {/* Notation */}
        <Typography
          sx={{ marginBottom: 2 }}
          fontSize={16}
          fontWeight={400}
          className="mb-4 text-[var(--gray-2)]"
        >
          資料來自花蓮縣政府及網站團隊蒐集彙整
        </Typography>

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {houseRepairData
            .filter(row => currentType === '全部' || row.type === currentType)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(row => (
              <div
                className="rounded-2xl border border-[var(--gray-3)]"
                key={`${row.type}-${row.name}-${row.contact}`}
                style={{ boxShadow: '0px 2px 10px 0px #0000001A' }}
              >
                {/*targer for scroll*/}
                <div id={`${row.repair_id}`} style={{ position: 'relative', top: '-80px' }}></div>

                <Stack gap="10px" p="20px" className="rounded-2xl">
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <div className="flex size-fit px-2 py-1 text-[var(--primary)] bg-[var(--warning-background)] rounded">
                      <Typography fontSize={14} fontWeight={500}>
                        {row.type}
                      </Typography>
                    </div>

                    <ShareAction key="share" shareId={row.repair_id}>
                      <button className="cursor-pointer" aria-label="分享">
                        <Image
                          src={getAssetPath('/icon/card_gray_share_icon.svg')}
                          alt="share"
                          width={24}
                          height={24}
                          className="transition-all duration-200 hover:[filter:invert(60%)_sepia(80%)_saturate(6000%)_hue-rotate(10deg)_brightness(100%)_contrast(95%)]"
                        />
                      </button>
                    </ShareAction>
                  </Stack>

                  <div>
                    <Typography fontSize={20} fontWeight={500}>
                      {row.name}
                    </Typography>
                  </div>
                  <div className="flex flex-col gap-2">
                    {row.contact && (
                      <div className="flex gap-2 items-center whitespace-pre-wrap">
                        <Image
                          src={getAssetPath('/icon/people_icon.svg')}
                          alt=""
                          width={20}
                          height={20}
                        />
                        <Typography fontSize={16} fontWeight={400}>
                          {row.contact.replace(/^"|"$/g, '')}
                        </Typography>
                      </div>
                    )}

                    {row.phone &&
                      row.phone
                        .replace(/^"|"$/g, '')
                        .split('\n') // 支援換行填寫多個電話
                        .filter(phone_number => phone_number.trim() !== '')
                        .map(phone_number => (
                          <div
                            key={phone_number}
                            className="flex gap-2 items-center whitespace-pre-wrap cursor-pointer"
                            onClick={() => handleCopyText(row.phone)}
                            title="點擊複製聯絡資訊"
                          >
                            <Image
                              src={getAssetPath('/icon/call_icon.svg')}
                              alt=""
                              width={20}
                              height={20}
                            />
                            <Typography fontSize={16} fontWeight={400}>
                              {phone_number}
                            </Typography>
                            <div className="me-1">
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
                        ))}
                  </div>
                </Stack>
              </div>
            ))}
        </div>
        {/* Footer */}
        <div className="text-gray-500 text-sm">
          發現資訊不正確嗎？請回報給我們，我們會盡快修正。
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSd5HQsSMoStkgiaC-q3bHRaLVVGNKdETWIgZVoYEsyzE486ew/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#179BC6] hover:underline ml-1"
          >
            回報問題
          </a>
        </div>
      </div>

      {/* BottomSheet：顯示底部彈跳選單 居家修繕頁暫不顯示*/}
      <BottomSheet open={isDetailCardOpen} onClose={() => setIsDetailCardOpen(false)}>
        {(() => {
          const selectedData = houseRepairData.find(data => data.repair_id === selectedRepairId);
          if (!selectedData) return null;

          return (
            <div className="pb-6">
              {/* Header: Tags and Close Button */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2 flex-wrap">
                  <div
                    className="px-3 py-1 rounded text-sm font-medium"
                    style={{
                      backgroundColor: '#FFF4E5',
                      color: '#FF9800',
                    }}
                  >
                    {selectedData.type}
                  </div>
                  {/* Add more tags if needed based on data */}
                </div>
                <button
                  onClick={() => setIsDetailCardOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Image
                    src={getAssetPath('/icon/close_icon.svg')}
                    alt="Close"
                    width={24}
                    height={24}
                    // Fallback if icon not found, though usually we should use the one from design or material ui
                    onError={e => {
                      e.currentTarget.style.display = 'none';
                      // Show text X as fallback
                      const span = document.createElement('span');
                      span.innerText = '✕';
                      span.className = 'text-2xl leading-none';
                      e.currentTarget.parentElement?.appendChild(span);
                    }}
                  />
                </button>
              </div>

              {/* Title */}
              <Typography
                fontSize={24}
                fontWeight={700}
                className="sticky top-0 mb-4 text-[#3A3937]"
              >
                {selectedData.name}
              </Typography>

              <hr className="border-gray-200 mb-6" />

              {/* Details List */}
              <div className="space-y-4 mb-6">
                {/* Contact */}
                {selectedData.contact && (
                  <div className="grid grid-cols-[80px_1fr] gap-4">
                    <div className="text-gray-500">聯絡人</div>
                    <div className="whitespace-pre-wrap">
                      {selectedData.contact.replace(/^"|"$/g, '')}
                    </div>
                  </div>
                )}

                {/* Phone */}
                {selectedData.phone && (
                  <div className="grid grid-cols-[80px_1fr] gap-4">
                    <div className="text-gray-500">電話</div>
                    <div className="whitespace-pre-wrap">
                      {selectedData.phone.replace(/^"|"$/g, '')}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="text-gray-500 text-sm">
                發現資訊不正確嗎？請回報給我們，我們會盡快修正。
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSd5HQsSMoStkgiaC-q3bHRaLVVGNKdETWIgZVoYEsyzE486ew/viewform?usp=dialog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#179BC6] hover:underline ml-1"
                >
                  回報問題
                </a>
              </div>
            </div>
          );
        })()}
      </BottomSheet>
    </>
  );
}
