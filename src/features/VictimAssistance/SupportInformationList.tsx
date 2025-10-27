import { env } from '@/config/env';
import Button from '@/components/Button';
import { useToast } from '@/providers/ToastProvider';
import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import ReactGA from 'react-ga4';

type SupportInformationDataRow = {
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

  const handleTypeClick = (type: string) => {
    ReactGA.event(`輔助資訊_${type}`);
    setCurrentType(type);
  };

  useEffect(() => {
    async function fetchRepairData() {
      try {
        // fetch Google sheet at client side
        /*
        const sheetId = env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
        const gid = env.NEXT_PUBLIC_SUPPORT_INFORMATION_SHEET_GID;
        */
        const sheetId = '1FHW_TMy4ufBTxdAyy98gmOeSawI2m7AvU17_wW6W4rg';
        const gid = '1828376559';

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

        const supportInformationTypes: string[] = [
          '全部',
          '個人',
          '家戶',
          '團體',
          '農民/養殖戶',
          '商家與企業',
        ];
        const supportInformationData: SupportInformationData = [];
        dataLines.forEach(line => {
          //依序為：Tag、補助名稱、官方連結、補助對象、補助內容、最後期限、申請地點、地點地址、開放時間、電話及窗口、申請資料、資料來源
          const [
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
              console.log('重複的活動：');
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
        console.error('Failed to fetch house repair data:', error);
      }
    }

    fetchRepairData();
  }, []);

  type tag_type = '個人' | '家戶' | '團體' | '農民/養殖戶' | '商家與企業';
  const tagTypeCssList = {
    個人: { backgroundColor: '#3F51B2', color: '#FFFFFF' },
    家戶: { backgroundColor: '#9D28AC', color: '#FFFFFF' },
    團體: { backgroundColor: '#9C5D1D', color: '#FFFFFF' },
    '農民/養殖戶': { backgroundColor: '#009689', color: '#FFFFFF' },
    商家與企業: { backgroundColor: '#8BC255', color: '#FFFFFF' },
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
      <div className="flex gap-2 mb-3 sm:flex-wrap">
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

      <div className="space-y-4 mb-[80px] px-[16px] md:px-[32px]">
        {/* Info Cards */}
        {supportInformationData
          .filter(row => currentType === '全部' || row.type === currentType)
          .map(row => (
            <div
              className="mb-4 rounded-2xl"
              key={`${row.type}-${row.name}-${row.url}`}
              style={{ boxShadow: '0px 2px 10px 0px #0000001A' }}
            >
              <div className="px-4 pt-6 flex flex-col pr-1 bg-[var(--light-gray-background)]">
                {currentType === '全部' && (
                  <div
                    className={`flex size-fit px-3 py-1 text-[var(--gray-2)] mb-1 text-sm rounded`}
                    style={
                      tagTypeCssList[row.type as tag_type] ?? {
                        backgroundColor: '#fff',
                        color: '#000',
                      }
                    }
                  >
                    {row.type}
                  </div>
                )}
                <h3 className="flex items-center justify-between text-xl font-bold text-[var(--gray-2)] mb-2">
                  {row.name}

                  <a
                    className="flex gap-2 justify-between items-center cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                    href={row.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0 8C0 3.58172 3.58172 0 8 0H20C24.4183 0 28 3.58172 28 8V20C28 24.4183 24.4183 28 20 28H8C3.58172 28 0 24.4183 0 20V8Z"
                        fill="#3A3937"
                        fillOpacity="0.1"
                      />
                      <path
                        d="M19.8333 19.8333H8.16667V8.16667H14V6.5H8.16667C7.72464 6.5 7.30072 6.67559 6.98816 6.98816C6.67559 7.30072 6.5 7.72464 6.5 8.16667V19.8333C6.5 20.2754 6.67559 20.6993 6.98816 21.0118C7.30072 21.3244 7.72464 21.5 8.16667 21.5H19.8333C20.75 21.5 21.5 20.75 21.5 19.8333V14H19.8333V19.8333ZM15.6667 6.5V8.16667H18.6583L10.4667 16.3583L11.6417 17.5333L19.8333 9.34167V12.3333H21.5V6.5H15.6667Z"
                        fill="#3A3937"
                      />
                    </svg>
                  </a>
                </h3>

                <div className="text-[var(--black)] leading-[20px] items-center font-normal">
                  <div
                    className="flex justify-center items-center text-xs text-[var(--background)] bg-[var(--primary)] text-nowrap mb-2"
                    style={{ height: '20px', width: '60px', borderRadius: '4px' }}
                  >
                    輔助對象
                  </div>
                  <div className="font-bold flex-1 mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                    {row.target.replace(/^"|"$/g, '')}
                  </div>
                </div>
                <div className="text-[var(--black)] leading-[20px] items-center font-normal">
                  <div
                    className="flex justify-center items-center text-xs text-[var(--background)] bg-[var(--primary)] text-nowrap mb-2"
                    style={{ height: '20px', width: '60px', borderRadius: '4px' }}
                  >
                    輔助內容
                  </div>
                  <div className="font-bold flex-1 mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                    {row.support_detail.replace(/^"|"$/g, '')}
                  </div>
                </div>
                {row.deadline && (
                  <div className="text-[var(--black)] leading-[20px] items-center font-normal">
                    <div
                      className="flex justify-center items-center text-xs text-[var(--background)] bg-[var(--primary)] text-nowrap mb-2"
                      style={{ height: '20px', width: '60px', borderRadius: '4px' }}
                    >
                      申請期限
                    </div>
                    <div className="font-bold flex-1 mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                      {row.deadline.replace(/^"|"$/g, '')}
                    </div>
                  </div>
                )}
              </div>
              <div className="px-4 pt-4 pb-6 flex flex-col pr-1">
                <div className="text-[var(--black)] leading-[20px] items-center font-normal">
                  <div className="font-bold text-[var(--primary)] text-nowrap mb-2">聯絡資訊</div>
                  {row.apply_place && (
                    <div
                      className="flex gap-1 mb-4 items-center"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.99984 4.74167L14.1665 8.49167V15H12.4998V10H7.49984V15H5.83317V8.49167L9.99984 4.74167ZM9.99984 2.5L1.6665 10H4.1665V16.6667H9.1665V11.6667H10.8332V16.6667H15.8332V10H18.3332L9.99984 2.5Z"
                          fill="#838383"
                        />
                      </svg>
                      {row.apply_place.replace(/^"|"$/g, '')}
                    </div>
                  )}
                  {row.office_Hours && (
                    <div
                      className="flex gap-1 mb-4 items-center"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.66683 10.8346C6.2066 10.8346 5.8335 10.4616 5.8335 10.0013C5.8335 9.54105 6.2066 9.16797 6.66683 9.16797C7.12706 9.16797 7.50016 9.54105 7.50016 10.0013C7.50016 10.4616 7.12706 10.8346 6.66683 10.8346Z"
                          fill="#838383"
                        />
                        <path
                          d="M6.66683 14.1667C6.2066 14.1667 5.8335 13.7936 5.8335 13.3333C5.8335 12.8731 6.2066 12.5 6.66683 12.5C7.12706 12.5 7.50016 12.8731 7.50016 13.3333C7.50016 13.7936 7.12706 14.1667 6.66683 14.1667Z"
                          fill="#838383"
                        />
                        <path
                          d="M9.1665 13.3333C9.1665 13.7936 9.53959 14.1667 9.99984 14.1667C10.4601 14.1667 10.8332 13.7936 10.8332 13.3333C10.8332 12.8731 10.4601 12.5 9.99984 12.5C9.53959 12.5 9.1665 12.8731 9.1665 13.3333Z"
                          fill="#838383"
                        />
                        <path
                          d="M13.3333 14.1667C12.8731 14.1667 12.5 13.7936 12.5 13.3333C12.5 12.8731 12.8731 12.5 13.3333 12.5C13.7936 12.5 14.1667 12.8731 14.1667 13.3333C14.1667 13.7936 13.7936 14.1667 13.3333 14.1667Z"
                          fill="#838383"
                        />
                        <path
                          d="M9.1665 10.0013C9.1665 10.4616 9.53959 10.8346 9.99984 10.8346C10.4601 10.8346 10.8332 10.4616 10.8332 10.0013C10.8332 9.54105 10.4601 9.16797 9.99984 9.16797C9.53959 9.16797 9.1665 9.54105 9.1665 10.0013Z"
                          fill="#838383"
                        />
                        <path
                          d="M13.3333 10.8346C12.8731 10.8346 12.5 10.4616 12.5 10.0013C12.5 9.54105 12.8731 9.16797 13.3333 9.16797C13.7936 9.16797 14.1667 9.54105 14.1667 10.0013C14.1667 10.4616 13.7936 10.8346 13.3333 10.8346Z"
                          fill="#838383"
                        />
                        <path
                          d="M6.66683 5.83203C6.2066 5.83203 5.8335 6.20513 5.8335 6.66536C5.8335 7.1256 6.2066 7.4987 6.66683 7.4987H13.3335C13.7937 7.4987 14.1668 7.1256 14.1668 6.66536C14.1668 6.20513 13.7937 5.83203 13.3335 5.83203H6.66683Z"
                          fill="#838383"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5 2.5C3.61929 2.5 2.5 3.61929 2.5 5V15C2.5 16.3807 3.61929 17.5 5 17.5H15C16.3807 17.5 17.5 16.3807 17.5 15V5C17.5 3.61929 16.3807 2.5 15 2.5H5ZM15 4.16667H5C4.53977 4.16667 4.16667 4.53977 4.16667 5V15C4.16667 15.4602 4.53977 15.8333 5 15.8333H15C15.4602 15.8333 15.8333 15.4602 15.8333 15V5C15.8333 4.53977 15.4602 4.16667 15 4.16667Z"
                          fill="#838383"
                        />
                      </svg>
                      {row.office_Hours.replace(/^"|"$/g, '')}
                    </div>
                  )}
                  {row.apply_address && (
                    <div
                      className="flex gap-1 mb-4 items-center"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.0002 9.99935C10.4585 9.99935 10.8509 9.83615 11.1772 9.50977C11.5036 9.18338 11.6668 8.79102 11.6668 8.33268C11.6668 7.87435 11.5036 7.48199 11.1772 7.1556C10.8509 6.82921 10.4585 6.66602 10.0002 6.66602C9.54183 6.66602 9.14947 6.82921 8.82308 7.1556C8.49669 7.48199 8.3335 7.87435 8.3335 8.33268C8.3335 8.79102 8.49669 9.18338 8.82308 9.50977C9.14947 9.83615 9.54183 9.99935 10.0002 9.99935ZM10.0002 16.1243C11.6946 14.5688 12.9516 13.1556 13.771 11.8848C14.5904 10.6139 15.0002 9.48546 15.0002 8.49935C15.0002 6.98546 14.5175 5.74588 13.5522 4.7806C12.587 3.81532 11.4029 3.33268 10.0002 3.33268C8.59738 3.33268 7.41336 3.81532 6.44808 4.7806C5.4828 5.74588 5.00016 6.98546 5.00016 8.49935C5.00016 9.48546 5.40988 10.6139 6.22933 11.8848C7.04877 13.1556 8.30572 14.5688 10.0002 16.1243ZM10.0002 18.3327C7.76405 16.4299 6.09391 14.6625 4.98975 13.0306C3.88558 11.3987 3.3335 9.88824 3.3335 8.49935C3.3335 6.41602 4.00363 4.75629 5.34391 3.52018C6.68419 2.28407 8.23627 1.66602 10.0002 1.66602C11.7641 1.66602 13.3161 2.28407 14.6564 3.52018C15.9967 4.75629 16.6668 6.41602 16.6668 8.49935C16.6668 9.88824 16.1147 11.3987 15.0106 13.0306C13.9064 14.6625 12.2363 16.4299 10.0002 18.3327Z"
                          fill="#838383"
                        />
                      </svg>

                      <a
                        href={
                          'https://www.google.com/maps/search/?api=1&query=' + row.apply_address
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--secondary)]"
                        title="點擊開啟地址地圖資訊"
                      >
                        {row.apply_address.replace(/^"|"$/g, '')}
                      </a>
                    </div>
                  )}

                  {row.phone && (
                    <div
                      className="flex gap-1 mb-4 items-center"
                      style={{ whiteSpace: 'pre-wrap' }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.625 17.5C14.8889 17.5 13.1736 17.1215 11.4792 16.3646C9.78472 15.6076 8.24306 14.5347 6.85417 13.1458C5.46528 11.7569 4.39236 10.2153 3.63542 8.52083C2.87847 6.82639 2.5 5.11111 2.5 3.375C2.5 3.125 2.58333 2.91667 2.75 2.75C2.91667 2.58333 3.125 2.5 3.375 2.5H6.75C6.94444 2.5 7.11806 2.56597 7.27083 2.69792C7.42361 2.82986 7.51389 2.98611 7.54167 3.16667L8.08333 6.08333C8.11111 6.30556 8.10417 6.49306 8.0625 6.64583C8.02083 6.79861 7.94444 6.93056 7.83333 7.04167L5.8125 9.08333C6.09028 9.59722 6.42014 10.0938 6.80208 10.5729C7.18403 11.0521 7.60417 11.5139 8.0625 11.9583C8.49306 12.3889 8.94444 12.7882 9.41667 13.1562C9.88889 13.5243 10.3889 13.8611 10.9167 14.1667L12.875 12.2083C13 12.0833 13.1632 11.9896 13.3646 11.9271C13.566 11.8646 13.7639 11.8472 13.9583 11.875L16.8333 12.4583C17.0278 12.5139 17.1875 12.6146 17.3125 12.7604C17.4375 12.9062 17.5 13.0694 17.5 13.25V16.625C17.5 16.875 17.4167 17.0833 17.25 17.25C17.0833 17.4167 16.875 17.5 16.625 17.5ZM5.02083 7.5L6.39583 6.125L6.04167 4.16667H4.1875C4.25694 4.73611 4.35417 5.29861 4.47917 5.85417C4.60417 6.40972 4.78472 6.95833 5.02083 7.5ZM12.4792 14.9583C13.0208 15.1944 13.5729 15.3819 14.1354 15.5208C14.6979 15.6597 15.2639 15.75 15.8333 15.7917V13.9583L13.875 13.5625L12.4792 14.9583Z"
                          fill="#838383"
                        />
                      </svg>
                      {row.phone.replace(/^"|"$/g, '')}
                    </div>
                  )}
                </div>

                {row.apply_detail && (
                  <div className="text-[var(--black)] leading-[20px] items-center font-normal">
                    <div className="font-bold text-[var(--primary)] text-nowrap mb-2">申請方式</div>
                    <div className="flex-1 mb-4" style={{ whiteSpace: 'pre-wrap' }}>
                      {row.apply_detail.replace(/^"|"$/g, '')}
                    </div>
                  </div>
                )}

                {row.source && (
                  <div className="text-[var(--black)] leading-[20px] items-center font-normal ">
                    <div className="font-bold text-[var(--primary)] text-nowrap mb-2">資料來源</div>
                    <div className="flex gap-2">
                      {row.source
                        .replace(/^"|"$/g, '')
                        .split('\n') //支援多網址
                        .filter(url => url.trim() !== '') // 避免空字串
                        .map((url, index) => (
                          <a
                            key={index}
                            href={url}
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
                            title="點擊開啟輔助連結資訊"
                          >
                            開啟連結
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 11 11"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.16667 10.8333L0 9.66667L8 1.66667H0.833333V0H10.8333V10H9.16667V2.83333L1.16667 10.8333Z"
                                fill="#179BC6"
                              />
                            </svg>
                          </a>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
