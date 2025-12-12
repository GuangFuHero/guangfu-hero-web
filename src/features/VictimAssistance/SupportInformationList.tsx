import { env } from '@/config/env';
import Button from '@/components/Button';
import { useToast } from '@/providers/ToastProvider';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Stack, Typography } from '@mui/material';
import ReactGA from 'react-ga4';
import { getAssetPath } from '@/lib/utils';
import Image from 'next/image';
import ShareAction from '@/components/ShareAction';
import BottomSheet from '@/components/BottomSheet';

type SupportInformationDataRow = {
  support_id: string; // ID
  type: string; // Tag
  name: string; // 補助名稱
  url: string; // 官方連結
  max_money: string; // 最高補助
  apply_status: string; // 申請狀態
  support_unit: string; // 輔助單位
  deadline: string; // 最後期限(申請期限)
  target: string; // 補助對象
  support_detail: string; // 補助內容
  apply_detail: string; // 申請方法
  apply_form_text: string; // 申請書連結文字
  apply_form_url: string; // 申請書連結
  online_apply_text: string; // 線上申請連結文字
  online_apply_url: string; // 線上申請連結
  contact_data: string; // 聯絡資訊
  apply_place: string; // 申請地點
  apply_address: string; // 地點地址
  office_hours: string; // 開放時間
  phone: string; // 電話及窗口
  source: string; // 資料來源
};
type SupportInformationData = SupportInformationDataRow[];

const applyStatusMap: Record<string, { label: string; color: string }> = {
  open: { label: '開放申請中', color: '#009689' },
  stop: { label: '已截止', color: '#D34746' },
  no_need: { label: '已造冊/無需申請', color: '#3A3937' },
};

export default function SupportInformationList() {
  const [fetchDataFail, setFetchDataFail] = useState<boolean>(false);
  const [supportInformationTypes, setSupportInformationTypes] = useState<string[]>([]);
  const [supportInformationData, setSupportInformationData] = useState<SupportInformationData>([]);
  const [currentType, setCurrentType] = useState<string>('全部');
  const [isDetailCardOpen, setIsDetailCardOpen] = useState(false);
  const [selectedSupportId, setSelectedSupportId] = useState<string | null>(null);

  const handleTypeClick = (type: string) => {
    ReactGA.event(`補助貸款_${type}`);
    setCurrentType(type);
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
          '農業/養殖業',
          '商家/企業',
          '生活扶助',
          '返鄉補助',
        ];
        supportInformationTypes = supportInformationTypes.filter(
          type => type === '全部' || csvText.includes(type)
        );
        const supportInformationData: SupportInformationData = [];
        dataLines.forEach(line => {
          //--依序為：ID、Tag、補助名稱、官方連結、補助對象、補助內容、最後期限、申請地點、地點地址、開放時間、電話及窗口、申請資料、資料來源--
          /*依序為：
           */

          const [
            support_id,
            type,
            name,
            url,
            max_money,
            apply_status,
            support_unit,
            deadline,
            target,
            support_detail,
            apply_detail,
            apply_form_text,
            apply_form_url,
            online_apply_text,
            online_apply_url,
            contact_data,
            apply_place,
            apply_address,
            office_hours,
            phone,
            source,
          ] = line.split(',');

          //避開標題列和空欄位
          if (!support_id || support_id == 'ID') {
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
                url:
                  url
                    ?.replace(/^"+|"+$/g, '')
                    .split(/\s+/)
                    .find(u => u.startsWith('http'))
                    ?.replace(/^"+|"+$/g, '') || url.trim(),
                max_money: max_money.trim(),
                apply_status: apply_status.trim(),
                support_unit: support_unit.trim(),
                deadline: deadline.trim(),
                target: target.trim(),
                support_detail: support_detail.trim(),
                apply_detail: apply_detail.trim(),
                apply_form_text: apply_form_text.trim(),
                apply_form_url: apply_form_url.trim(),
                online_apply_text: online_apply_text.trim(),
                online_apply_url: online_apply_url.trim(),
                contact_data: contact_data.trim(),
                apply_place: apply_place.trim(),
                apply_address: apply_address.trim(),
                office_hours: office_hours.trim(),
                phone: phone.trim(),
                source: source.trim(),
              });
            } else {
              console.log('重複的補助貸款：');
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

  useLayoutEffect(() => {
    const hash = window.location.hash;
    if (!hash || supportInformationData.length === 0) return; // ← 要等資料準備好

    const id = hash.substring(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setSelectedSupportId(id);
      setIsDetailCardOpen(true);
    }
  }, [supportInformationData, currentType]);

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
      <div className="flex gap-2 mb-4 sm:flex-wrap overflow-y-auto">
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

      <div>
        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 mb-4">
          {supportInformationData
            .filter(row => currentType === '全部' || row.type === currentType)
            .map(row => (
              <div
                className="rounded-2xl border border-[var(--gray-3)] cursor-pointer"
                key={`${row.type}-${row.name}-${row.url}`}
                style={{ boxShadow: '0px 2px 10px 0px #0000001A' }}
              >
                {/*targer for scroll*/}
                <div id={`${row.support_id}`} style={{ position: 'relative', top: '-80px' }}></div>
                <Stack gap="10px" p="20px" className="rounded-2xl">
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <div className="flex size-fit px-2 py-1 text-[var(--primary)] bg-[var(--warning-background)] rounded">
                      <Typography fontSize={14} fontWeight={500}>
                        {row.type}
                      </Typography>
                    </div>

                    <ShareAction key="share" shareId={row.support_id}>
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

                  <div className="flex gap-4 mb-2">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center">
                        <Image
                          src={getAssetPath('/icon/money_icon.svg')}
                          alt=""
                          width={24}
                          height={24}
                          className="opacity-50"
                        />
                        <Typography
                          fontSize={16}
                          fontWeight={500}
                          className="mb-4 text-[var(--gray-2)]"
                        >
                          最高補助
                        </Typography>
                      </div>
                      <div className="font-medium text-[var(--black)]">{row.max_money}</div>
                    </div>
                    <div className="w-[1px] bg-gray-200"></div>
                    <div className="flex-1">
                      <div className="mb-2 flex items-center">
                        <Image
                          src={getAssetPath('/icon/status_calendar_icon.svg')}
                          alt=""
                          width={24}
                          height={24}
                          className="opacity-50"
                        />
                        <div className="ms-1">
                          <Typography
                            fontSize={16}
                            fontWeight={500}
                            className="mb-4 text-[var(--gray-2)]"
                          >
                            申請狀態
                          </Typography>
                        </div>
                      </div>
                      <div
                        className="font-medium"
                        style={{ color: applyStatusMap[row.apply_status]?.color }}
                      >
                        {applyStatusMap[row.apply_status]?.label || row.apply_status}
                      </div>
                    </div>
                  </div>

                  <button
                    className="cursor-pointer text-[var(--secondary)] bg-[#179BC61A] rounded-lg h-[36px]"
                    onClick={() => {
                      setSelectedSupportId(row.support_id);
                      setIsDetailCardOpen(true);
                    }}
                  >
                    查看詳情
                  </button>
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

        {/* BottomSheet：顯示底部彈跳選單 */}
        <BottomSheet
          open={isDetailCardOpen}
          onClose={() => setIsDetailCardOpen(false)}
          contentMaxHeight="95vh"
        >
          {(() => {
            const selectedData = supportInformationData.find(
              data => data.support_id === selectedSupportId
            );
            if (!selectedData) return null;

            return (
              <div className="pb-6">
                {/* Header: Tags and Close Button */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2 flex-wrap">
                    <div className="flex size-fit px-2 py-1 text-[var(--primary)] bg-[var(--warning-background)] rounded">
                      {selectedData.type}
                    </div>
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
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                        const span = document.createElement('span');
                        span.innerText = '✕';
                        span.className = 'text-2xl leading-none';
                        e.currentTarget.parentElement?.appendChild(span);
                      }}
                    />
                  </button>
                </div>

                {/* Title */}
                <div className="sticky top-0 z-10 bg-white pt-2 pb-3 mb-4">
                  <Typography fontSize={20} fontWeight={600} className="text-[var(--black)]">
                    {selectedData.name}
                  </Typography>
                </div>

                {/* Max Money and Status */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center">
                      <Image
                        src={getAssetPath('/icon/money_icon.svg')}
                        alt=""
                        width={24}
                        height={24}
                        className="opacity-50"
                      />
                      <Typography
                        fontSize={16}
                        fontWeight={500}
                        className="mb-4 text-[var(--gray-2)]"
                      >
                        最高補助
                      </Typography>
                    </div>
                    <div className="font-medium text-[var(--black)]">{selectedData.max_money}</div>
                  </div>
                  <div className="w-[1px] bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center">
                      <Image
                        src={getAssetPath('/icon/status_calendar_icon.svg')}
                        alt=""
                        width={24}
                        height={24}
                        className="opacity-50"
                      />
                      <div className="ms-1">
                        <Typography
                          fontSize={16}
                          fontWeight={500}
                          className="mb-4 text-[var(--gray-2)]"
                        >
                          申請狀態
                        </Typography>
                      </div>
                    </div>
                    <div
                      className="font-medium"
                      style={{ color: applyStatusMap[selectedData.apply_status]?.color }}
                    >
                      {applyStatusMap[selectedData.apply_status]?.label ||
                        selectedData.apply_status}
                    </div>
                  </div>
                </div>

                <hr className="border-gray-200 mb-6" />

                {/* Details List */}
                <div className="mb-6">
                  {/* Support Unit */}
                  {selectedData.support_unit && (
                    <div className="border-b border-gray-200 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
                      <div className="font-bold text-[#3A3937] mb-2">補助單位</div>
                      <div className="text-[#3A3937] whitespace-pre-wrap">
                        {selectedData.support_unit.replace(/^"|"$/g, '')}
                      </div>
                    </div>
                  )}

                  {/* Deadline */}
                  {selectedData.deadline && (
                    <div className="border-b border-gray-200 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
                      <div className="font-bold text-[#3A3937] mb-2">申請期限</div>
                      <div className="text-[#3A3937] whitespace-pre-wrap">
                        {selectedData.deadline.replace(/^"|"$/g, '')}
                      </div>
                    </div>
                  )}

                  {/* Target */}
                  {selectedData.target && (
                    <div className="border-b border-gray-200 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
                      <div className="font-bold text-[#3A3937] mb-2">補助對象</div>
                      <div className="text-[#3A3937] whitespace-pre-wrap">
                        {selectedData.target.replace(/^"|"$/g, '')}
                      </div>
                    </div>
                  )}

                  {/* Support Detail */}
                  {selectedData.support_detail && (
                    <div className="border-b border-gray-200 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
                      <div className="font-bold text-[#3A3937] mb-2">補助內容</div>
                      <div className="text-[#3A3937] whitespace-pre-wrap">
                        {selectedData.support_detail.replace(/^"|"$/g, '')}
                      </div>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="border-b border-gray-200 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
                    <div className="font-bold text-[#3A3937] mb-2">申請方式</div>
                    <div className="text-[#3A3937] space-y-1">
                      {selectedData.apply_detail && (
                        <div className="mt-4">
                          <div className="whitespace-pre-wrap">
                            {selectedData.apply_detail.replace(/^"|"$/g, '')}
                          </div>
                        </div>
                      )}
                    </div>

                    {selectedData.apply_form_text && selectedData.apply_form_url && (
                      <div className="mt-4 mb-4 cursor-pointer">
                        <a
                          className="whitespace-pre-wrap text-[var(--secondary)]"
                          href={selectedData.apply_form_url.replace(/^"|"$/g, '')}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selectedData.apply_form_text.replace(/^"|"$/g, '')}
                        </a>
                      </div>
                    )}

                    {selectedData.online_apply_text && selectedData.online_apply_url && (
                      <div className="mt-4 mb-4 cursor-pointer">
                        <a
                          className="whitespace-pre-wrap text-[var(--secondary)]"
                          href={selectedData.online_apply_url.replace(/^"|"$/g, '')}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selectedData.online_apply_text.replace(/^"|"$/g, '')}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="border-b border-gray-200 pb-3 mb-3 last:border-0 last:pb-0 last:mb-0">
                    <div className="font-bold text-[#3A3937] mb-2">聯絡資訊</div>
                    <div className="text-[#3A3937] space-y-1">
                      {selectedData.contact_data && (
                        <div className="mt-4">
                          <div className="whitespace-pre-wrap">
                            {selectedData.contact_data.replace(/^"|"$/g, '')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Button */}
                {selectedData.url && (
                  <a
                    href={selectedData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-[36px] block w-full bg-[#179BC6] py-3 rounded-lg hover:bg-[#148aa3] transition-colors mb-4 flex items-center justify-center gap-2"
                  >
                    <Typography fontSize={16} fontWeight={400} className="text-white text-center">
                      查看官方公告
                    </Typography>
                    <Image
                      src={getAssetPath('/icon/secondary_up_right_arrow.svg')}
                      alt=""
                      width={20}
                      height={20}
                      className="brightness-0 invert"
                    />
                  </a>
                )}

                {/* Report Issue */}
                <div className="text-gray-500 text-sm">
                  發現資訊不正確嗎？請回報給我們，我們會盡快修正。
                  <span>
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSd5HQsSMoStkgiaC-q3bHRaLVVGNKdETWIgZVoYEsyzE486ew/viewform?usp=dialog"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#179BC6] hover:underline ml-1"
                    >
                      回報問題
                    </a>
                  </span>
                </div>
              </div>
            );
          })()}
        </BottomSheet>
      </div>
    </>
  );
}
