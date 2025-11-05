import { env } from '@/config/env';
import Button from '@/components/Button';
import { useToast } from '@/providers/ToastProvider';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Stack, Typography } from '@mui/material';
import ReactGA from 'react-ga4';
import { getAssetPath } from '@/lib/utils';
import Image from 'next/image';

type SupportInformationDataRow = {
  support_id: string;
  type: string;
  name: string;
  url: string;
  target: string;
  support_detail: string;
  deadline: string;
  apply_place: string;
  apply_address: string;
  office_Hours: string;
  phone: string;
  apply_detail: string;
  source: string;
};
type SupportInformationData = SupportInformationDataRow[];

export default function SupportInformationList() {
  const [fetchDataFail, setFetchDataFail] = useState<boolean>(false);
  const [supportInformationTypes, setSupportInformationTypes] = useState<string[]>([]);
  const [supportInformationData, setSupportInformationData] = useState<SupportInformationData>([]);
  const [currentType, setCurrentType] = useState<string>('全部');
  const { showToast } = useToast();
  const pathname = usePathname();

  const handleTypeClick = (type: string) => {
    ReactGA.event(`補助資訊_${type}`);
    setCurrentType(type);
  };

  const handleShare = async (id?: string) => {
    if (typeof window === 'undefined') return;

    // 建構完整 URL
    const baseUrl = window.location.origin;
    const shareUrl = id
      ? `${baseUrl}${pathname}#${id}` // ✅ 加上 #id
      : `${baseUrl}${pathname}`;

    // 根據路徑決定標題
    const getTitle = () => {
      if (pathname.startsWith('/map')) return '光復超人 - 現場地圖';
      if (pathname.startsWith('/volunteer')) return '光復超人 - 志工資訊';
      if (pathname.startsWith('/victim')) return '光復超人 - 居民協助';
      return '光復超人';
    };

    const title = getTitle();

    // 檢查是否支援 Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: shareUrl,
        });
      } catch (error) {
        // 如果使用者取消分享或發生錯誤=複製功能
        if (!(error instanceof Error && error.name === 'AbortError')) {
          await fallbackToCopy(shareUrl);
        }
      }
    } else {
      // 不支援 Web Share API,直接使用複製功能
      await fallbackToCopy(shareUrl);
    }
  };

  const fallbackToCopy = async (url: string) => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      console.warn('Clipboard API 不可用 - 需要 HTTPS 或 localhost 環境');
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      // 複製成功,顯示 Toast
      showToast('複製連結成功', 'success');
    } catch (error) {
      console.error('複製失敗:', error);
    }
  };

  useEffect(() => {
    async function fetchSupportData() {
      try {
        // fetch Google sheet at client side
        const sheetId = env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
        const gid = env.NEXT_PUBLIC_SUPPORT_INFORMATION_SHEET_GID;

        if (!sheetId) {
          throw new Error('NEXT_PUBLIC_GOOGLE_SHEET_ID not configured');
        } else if (!gid) {
          throw new Error('NEXT_PUBLIC_SUPPORT_INFORMATION_SHEET_GID not configured');
        }

        const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
        const response = await fetch(csvUrl);
        const csvText = await response.text();

        // check if the return text is HTML (unexpected)
        if (csvText.includes('<!DOCTYPE') || csvText.includes('<html')) {
          throw new Error('Google Sheets not accessible');
        }
        const dataLines = csvText.split('\r\n');

        let supportInformationTypes: string[] = [
          '全部',
          '一般個人',
          '一般家戶',
          '弱勢扶助',
          '農民/養殖戶',
          '商家與企業',
          '外縣市補助',
        ];
        supportInformationTypes = supportInformationTypes.filter(
          type => type === '全部' || csvText.includes(type)
        );
        const supportInformationData: SupportInformationData = [];
        dataLines.forEach(line => {
          //依序為：ID、Tag、補助名稱、官方連結、補助對象、補助內容、最後期限、申請地點、地點地址、開放時間、電話及窗口、申請資料、資料來源
          const [
            support_id,
            type,
            name,
            url,
            target,
            support_detail,
            deadline,
            apply_place,
            apply_address,
            office_Hours,
            phone,
            apply_detail,
            source,
          ] = line.split(',');

          //避開標題列和空欄位
          if (!type || type == 'Tag') {
            return;
          } else {
            if (!currentType) return;
            if (type !== currentType && currentType != '全部') return;

            //確認資料是否重複
            const indexFound = supportInformationData.findIndex(row => {
              return row.type === type && row.name === name.trim() && row.url === url.trim();
            });

            if (indexFound === -1) {
              supportInformationData.push({
                support_id: support_id.trim(),
                type: type.trim(),
                name: name.trim(),
                url: url.trim(),
                target: target.trim(),
                support_detail: support_detail.trim(),
                deadline: deadline.trim(),
                apply_place: apply_place.trim(),
                apply_address: apply_address.trim(),
                office_Hours: office_Hours.trim(),
                phone: phone.trim(),
                apply_detail: apply_detail.trim(),
                source: source.trim(),
              });
            } else {
              console.log('重複的補助資訊：');
              console.log(`${type} - ${name}`);
              console.log(
                `前一筆的電話: ${supportInformationData[indexFound].phone} || 新一筆的電話: ${phone}`
              );
            }
          }
        });

        setSupportInformationTypes(supportInformationTypes);
        setSupportInformationData(supportInformationData);
      } catch (error) {
        setFetchDataFail(true);
        console.error('Failed to fetch support information data:', error);
      }
    }

    fetchSupportData();
  }, [currentType]);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || supportInformationData.length === 0) return; // ← 要等資料準備好

    const id = hash.substring(1);
    const el = document.getElementById(id);
    if (el) {
      // 加一點點延遲，確保 DOM 已經繪製完成
      setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [supportInformationData, currentType, pathname]);

  type tag_type =
    | '一般個人'
    | '一般家戶'
    | '弱勢扶助'
    | '農民/養殖戶'
    | '商家與企業'
    | '外縣市補助';
  const tagTypeCssList = {
    一般個人: { backgroundColor: '#3F51B2', color: '#FFFFFF' },
    一般家戶: { backgroundColor: '#9D28AC', color: '#FFFFFF' },
    弱勢扶助: { backgroundColor: '#607D8A', color: '#FFFFFF' },
    '農民/養殖戶': { backgroundColor: '#009689', color: '#FFFFFF' },
    商家與企業: { backgroundColor: '#8BC255', color: '#FFFFFF' },
    外縣市補助: { backgroundColor: '#9C5D1D', color: '#FFFFFF' },
  };

  return supportInformationTypes.length === 0 ? (
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
      <div className="flex gap-2 mb-3 sm:flex-wrap overflow-y-auto">
        {supportInformationTypes.map(type => (
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

      <Stack
        justifyContent="center"
        alignItems="center"
        p="10px"
        className="text-[var(--gray)] border-t border-b border-dashed border-[var(--gray-3)]"
      >
        <div>
          <span>若您想提出修正建議，請</span>
          <span className="cursor-pointer text-[var(--secondary)] underline">
            <a
              target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSd5HQsSMoStkgiaC-q3bHRaLVVGNKdETWIgZVoYEsyzE486ew/viewform?usp=dialog"
            >
              點此
            </a>
          </span>
          <span>填寫表單</span>
        </div>
      </Stack>

      <div className="space-y-4">
        {/* Info Cards */}
        {supportInformationData
          .filter(row => currentType === '全部' || row.type === currentType)
          .map(row => (
            <div
              className="mb-4 rounded-2xl border border-[var(--gray-3)]"
              key={`${row.type}-${row.name}-${row.url}`}
              style={{ boxShadow: '0px 2px 10px 0px #0000001A' }}
            >
              {/*targer for scroll*/}
              <div id={`${row.support_id}`} style={{ position: 'relative', top: '-80px' }}></div>
              {/*upper part of the card*/}
              <Stack gap="8px" p="20px" className="bg-[var(--light-gray-background)] rounded-t-2xl">
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <div
                    className={`flex size-fit px-3 py-1 text-[var(--gray-2)] rounded`}
                    style={
                      tagTypeCssList[row.type as tag_type] ?? {
                        backgroundColor: '#fff',
                        color: '#000',
                      }
                    }
                  >
                    <Typography fontSize={14} fontWeight={500}>
                      {row.type}
                    </Typography>
                  </div>
                  <button
                    className="flex-shrink-0 cursor-pointer"
                    aria-label="分享"
                    onClick={() => handleShare(row.support_id)}
                  >
                    <Image
                      src={getAssetPath('/icon/card_gray_share_icon.svg')}
                      alt="分享"
                      width={28}
                      height={28}
                    />
                  </button>
                </Stack>

                <div>
                  <Typography fontSize={20} fontWeight={500}>
                    {row.name}
                  </Typography>
                </div>

                {[
                  { name: '補助對象', information: row.target },
                  { name: '補助內容', information: row.support_detail },
                  { name: '申請期限', information: row.deadline },
                ].map(
                  ({ name, information }) =>
                    information && (
                      <div
                        key={name}
                        className="text-[var(--black)] leading-[20px] items-center font-normal"
                      >
                        <div className="text-[var(--primary)] text-nowrap mb-2">
                          <Typography fontSize={16} fontWeight={600}>
                            {name}
                          </Typography>
                        </div>
                        <div className="flex-1 whitespace-pre-wrap">
                          <Typography fontSize={16} fontWeight={400}>
                            {information.replace(/^"|"$/g, '')}
                          </Typography>
                        </div>
                      </div>
                    )
                )}
                {row.url && (
                  <a
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                          size-fit h-[36px] py-2 px-3 my-2
                          min-w-[80px]
                          text-[var(--secondary)]
                          rounded-lg
                          cursor-pointer
                          flex items-center justify-center gap-1
                          whitespace-nowrap
                          transition-colors
                        "
                    title="點擊開啟官方連結"
                    style={{ backgroundColor: '#179BC61A' }}
                  >
                    <Typography fontSize={16} fontWeight={400}>
                      官方網站
                    </Typography>
                    <Image
                      src={getAssetPath('/icon/secondary_up_right_arrow.svg')}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </a>
                )}
              </Stack>

              {/*lower part of the card*/}
              <Stack gap="8px" p="20px">
                <div className="text-[var(--black)] leading-[20px] items-center font-normal">
                  <div className="text-[var(--primary)] text-nowrap mb-2">
                    <Typography fontSize={16} fontWeight={600}>
                      聯絡資訊
                    </Typography>
                  </div>
                  <div className="flex flex-col gap-1">
                    {row.apply_place && (
                      <div className="flex gap-1 items-center whitespace-pre-wrap">
                        <Image
                          src={getAssetPath('/icon/house_icon.svg')}
                          alt=""
                          width={20}
                          height={20}
                        />
                        <Typography fontSize={16} fontWeight={400}>
                          {row.apply_place.replace(/^"|"$/g, '')}
                        </Typography>
                      </div>
                    )}
                    {row.office_Hours && (
                      <div className="flex gap-1 items-center whitespace-pre-wrap">
                        <Image
                          src={getAssetPath('/icon/calendar_icon.svg')}
                          alt=""
                          width={20}
                          height={20}
                        />
                        <Typography fontSize={16} fontWeight={400}>
                          {row.office_Hours.replace(/^"|"$/g, '')}
                        </Typography>
                      </div>
                    )}
                    {row.apply_address && (
                      <div className="flex gap-1 items-center whitespace-pre-wrap">
                        <Image
                          src={getAssetPath('/icon/map_point_icon.svg')}
                          alt=""
                          width={20}
                          height={20}
                        />
                        <a
                          href={
                            'https://www.google.com/maps/search/?api=1&query=' + row.apply_address
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--secondary)]"
                          title="點擊開啟地址地圖資訊"
                        >
                          <Typography fontSize={16} fontWeight={400}>
                            {row.apply_address.replace(/^"|"$/g, '')}
                          </Typography>
                        </a>
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
                            className="flex gap-1 items-center whitespace-pre-wrap"
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
                          </div>
                        ))}

                    {/* dash-line */}
                    {row.apply_detail && (
                      <div
                        className="border-b border-dashed border-[var(--gray-3)]"
                        style={{ height: '10px', marginBottom: '2px' }}
                      ></div>
                    )}
                  </div>
                </div>

                {row.apply_detail && (
                  <div className="text-[var(--black)] leading-[20px] items-center font-normal">
                    <div className="text-[var(--primary)] text-nowrap mb-2">
                      <Typography fontSize={16} fontWeight={600}>
                        申請方式
                      </Typography>
                    </div>
                    <div className="flex-1 whitespace-pre-wrap">
                      {row.apply_detail
                        .replace(/^"|"$/g, '')
                        .split(/(\n)/) // 保留換行
                        .map((part, index) => {
                          // 偵測https開頭至換行符號結束，轉換成<a>標籤的按鈕，並將其餘文字轉為span和br
                          const urlMatch = part.match(/https?:\/\/[^\s]+/g);
                          if (urlMatch) {
                            return urlMatch.map((url, i) => (
                              <a
                                key={`${index}-${i}`}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="
                                size-fit h-[36px] py-2 px-3 my-2
                                min-w-[80px]
                                text-[var(--secondary)]
                                rounded-lg
                                cursor-pointer
                                flex items-center justify-center gap-1
                                whitespace-nowrap
                                transition-colors
                              "
                                title="點擊開啟補助連結資訊"
                                style={{ backgroundColor: '#179BC61A' }}
                              >
                                <Typography fontSize={16} fontWeight={400}>
                                  連結
                                </Typography>
                                <Image
                                  src={getAssetPath('/icon/secondary_up_right_arrow.svg')}
                                  alt=""
                                  width={20}
                                  height={20}
                                />
                              </a>
                            ));
                          } else if (part === '\n') {
                            return '';
                          } else {
                            return (
                              <Typography key={index} fontSize={16} fontWeight={400}>
                                {part}
                              </Typography>
                            );
                          }
                        })}
                    </div>
                  </div>
                )}
              </Stack>
            </div>
          ))}
      </div>
    </>
  );
}
