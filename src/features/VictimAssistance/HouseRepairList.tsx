import { env } from '@/config/env';
import Button from '@/components/Button';
import { useToast } from '@/providers/ToastProvider';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Typography } from '@mui/material';
import ReactGA from 'react-ga4';
import { usePathname } from 'next/navigation';
import { getAssetPath } from '@/lib/utils';
import Image from 'next/image';
import ShareAction from '@/components/ShareAction';

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
              console.log('重複的聯絡人：');
              console.log(`${first} - ${second}`);
              console.log(
                `前一筆的電話: ${houseRepairData[indexFound].phone} || 新一筆的電話: ${third}`
              );
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
    }
  }, [houseRepairData, currentType, pathname]);

  return houseRepairTypes.length === 0 ? (
    fetchDataFail ? (
      <div className="text-center text-base/9 py-8 text-[var(--gray)] mb-[80vh]">
        載入資料失敗
        <br />
        您可以試著重新整理頁面
        <br />
        若此問題仍持續發生，煩請利用回報功能通知管理員
      </div>
    ) : (
      <div className="text-center py-8 text-[var(--gray)] mb-[80vh]">載入中...</div>
    )
  ) : (
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

      <div className="space-y-4 mb-[80px]">
        {/* Notation */}
        <Typography sx={{ marginBottom: 2 }}>資料來源：花蓮縣政府，由我們協助彙整整理。</Typography>

        {/* Info Cards */}
        {houseRepairData
          .filter(row => currentType === '全部' || row.type === currentType)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(row => (
            <div
              className="bg-white border-b border-[var(--gray-3)] px-1 py-3"
              key={`${row.type}-${row.name}-${row.contact}`}
            >
              {/*targer for scroll*/}
              <div id={`${row.repair_id}`} style={{ position: 'relative', top: '-80px' }}></div>
              <div className="flex flex-col pr-1">
                {currentType === '全部' && (
                  <div className="flex size-fit px-3 py-1 bg-[var(--gray-4)] text-[var(--gray-2)] mb-1 text-sm rounded">
                    {row.type}
                  </div>
                )}
                <div className="flex justify-between item-start text-lg font-bold text-[var(--gray-2)] mb-2">
                  {row.name}
                  <ShareAction key="share" shareId={row.repair_id}>
                    <button className="flex-shrink-0 cursor-pointer" aria-label="分享">
                      <Image src={getAssetPath('/share.svg')} alt="share" width={24} height={24} />
                    </button>
                  </ShareAction>
                </div>

                <div className="flex items-start gap-2 text-[var(--black)] mb-1 leading-[20px] font-normal">
                  <div className="text-[var(--gray-2)] text-nowrap">聯絡人</div>
                  <div className="flex-1">{row.contact}</div>
                </div>
                <div className="flex gap-2 text-[var(--black)] mb-1 leading-[20px] items-center font-normal">
                  <div className="text-[var(--gray-2)] text-nowrap">電話</div>
                  <div
                    className="flex gap-2 justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                    onClick={() => handleCopyText(row.phone)}
                    title="點擊複製聯絡資訊"
                  >
                    <div className="flex-1">{row.phone}</div>
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
              </div>
              <div className="flex gap-2"></div>
            </div>
          ))}
      </div>
    </>
  );
}
