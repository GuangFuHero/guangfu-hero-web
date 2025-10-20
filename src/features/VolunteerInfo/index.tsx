'use client';

import ActionButton from '@/components/ActionButton';
import Button from '@/components/Button';
import StepNumber from '@/components/StepNumber';
import PlaceList from '@/features/PlaceList';
import ClothingProtectionChecklist from '@/features/VolunteerInfo/ClothingProtectionChecklist';
import DisasterReliefToolsChecklist from '@/features/VolunteerInfo/DisasterReliefToolsChecklist';
import FoodSuppliesChecklist from '@/features/VolunteerInfo/FoodSuppliesChecklist';
import FootwearHandsChecklist from '@/features/VolunteerInfo/FootwearHandsChecklist';
import MedicalItemsChecklist from '@/features/VolunteerInfo/MedicalItemsChecklist';
import { PlaceType } from '@/lib/types/place';
import { getAssetPath } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import OtherEssentialChecklist from './OtherEssentialChecklistProps';

type InfoCategory = '行前必讀' | '交通資訊' | '住宿資訊';
type TransportMode = '大眾運輸' | '共乘資訊';

export interface ChecklistItemData {
  id: string;
  label: string;
  description?: string | string[];
  highlight?: boolean;
}

interface VolunteerInfoProps {
  initialCategory?: InfoCategory;
}

const VolunteerSteps = [
  { title: '確認資訊', text: '查詢災區天氣、交通、人力需求等，評估自身情況' },
  { title: '加入志工', text: '加入個人志工，如 Line 社群、本平台媒合、或至光復車站前接受調度' },
  { title: '行前準備', text: '確認交通資訊、裝備（下滑有裝備清單喔）' },
  { title: '出發光復', text: '切勿勉強赴災！建議訂好回程車票、聯絡嚮導' },
  { title: '進入災區', text: '抵達災區後，尋找聯絡人，帶你抵達受困區的地點' },
  { title: '若身體不適', text: '及早至就醫點就醫，災區內醫治不宜拖延至緊急時刻！' },
  { title: '替換衣物', text: '返家前，將髒污衣物裝進垃圾袋中隔離丟棄，替換成乾淨衣物離開災區' },
];

export default function VolunteerInfo({ initialCategory = '行前必讀' }: VolunteerInfoProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<InfoCategory>(initialCategory);
  const [selectedTransportMode, setSelectedTransportMode] = useState<TransportMode>('大眾運輸');

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (itemId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const categories: InfoCategory[] = ['行前必讀', '交通資訊', '住宿資訊'];

  const handleCategoryClick = (category: InfoCategory) => {
    if (category === '住宿資訊') {
      router.push('/volunteer/accommodations');
    } else if (category === '行前必讀') {
      router.push('/volunteer/preparation');
    } else if (category === '交通資訊') {
      router.push('/volunteer/transportation');
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div>
      {/* 按鈕列表 - 支援橫向滾動 */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-3 mb-6 min-w-max">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => handleCategoryClick(category)}
              active={selectedCategory === category}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* 內容區域 */}
      <div className="space-y-4">
        {selectedCategory === '行前必讀' && (
          <div className="space-y-4">
            {/* 如何加入志工 */}
            <div className="flex items-center gap-3 mb-4">
              <StepNumber number={1} />
              <h2 className="text-[var(--text-black)] font-semibold text-xl">如何加入志工</h2>
            </div>

            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-0 w-[2px] h-[88%] bg-[var(--primary-point)]"></div>

              {VolunteerSteps.map((step, index) => (
                <div key={index} className="relative flex items-start mb-5">
                  <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-[var(--primary-point)] border border-[var(--primary-point)]"></div>
                  <div className="flex flex-row gap-2 ml-6">
                    <div className="min-w-[80px] size-fit bg-[var(--light-primary)] text[var(--text-black)] px-3 py-1 rounded text-sm font-medium">
                      <span>{step.title}</span>
                    </div>
                    <p className="text-[var(--text-black)] text-sm mt-1 leading-snug">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 裝備清單 */}
            <div className="mt-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <StepNumber number={2} />
                  <h3 className="font-bold text-xl">裝備清單</h3>
                </div>
                <div className="bg-[var(--gray-background)] rounded-lg p-4  space-y-6">
                  <ClothingProtectionChecklist
                    checkedItems={checkedItems}
                    onCheckChange={handleCheckboxChange}
                  />
                </div>
                <div className="bg-[var(--gray-background)] rounded-lg p-4 space-y-6">
                  <FootwearHandsChecklist
                    checkedItems={checkedItems}
                    onCheckChange={handleCheckboxChange}
                  />
                </div>
                <div className="bg-[var(--gray-background)] rounded-lg p-4 space-y-6">
                  <MedicalItemsChecklist
                    checkedItems={checkedItems}
                    onCheckChange={handleCheckboxChange}
                  />
                </div>
                <div className="bg-[var(--gray-background)] rounded-lg p-4 space-y-6">
                  <FoodSuppliesChecklist
                    checkedItems={checkedItems}
                    onCheckChange={handleCheckboxChange}
                  />
                </div>
                <div className="bg-[var(--gray-background)] rounded-lg p-4 space-y-6">
                  <DisasterReliefToolsChecklist
                    checkedItems={checkedItems}
                    onCheckChange={handleCheckboxChange}
                  />
                </div>
                <div className="bg-[var(--gray-background)] rounded-lg p-4 space-y-6">
                  <OtherEssentialChecklist
                    checkedItems={checkedItems}
                    onCheckChange={handleCheckboxChange}
                  />
                </div>
              </div>
            </div>

            {/* 專才志工識別證與車輛識別卡 */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-3">
                <StepNumber number={3} />
                <h3 className="font-bold text-xl">識別證/卡</h3>
              </div>
              <div className="text-[var(--secondary)] mb-1 text-lg font-bold">使用原因</div>
              <div className="mb-4">
                讓大家一眼就能快速辨識，增加執行效率。
                <br />
                <br />
                <span className="text-[var(--primary)]">專業志工辨別證</span>
                表明專業能力，立馬和需求連結，成為災區即戰力！
                <br />
                <span className="text-[var(--primary)]">車輛辨識卡</span>
                表明物資內容，讓災區交通更順暢！
              </div>
              <div className="text-[var(--secondary)] mb-1 text-lg font-bold">使用說明</div>
              <div className="mb-4">
                1.點擊按鈕下載
                <br />
                2.將識別證掛胸前/背後,卡貼在車窗前
              </div>
              <Image
                src={getAssetPath('/volunteer_card-1.webp')}
                alt="車輛辨識卡1"
                width={400}
                height={300}
                className="w-full h-auto"
              />
              <a
                href="https://drive.google.com/drive/folders/1B9y7Rl56xpG0vjLrV37h0CqqUNrLHr_d?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="my-6 w-full inline-block text-white bg-[var(--primary)] hover:bg-[#e06d00] rounded-[12px] px-8 py-4 font-medium transition-colors text-center"
              >
                下載專才識別證
              </a>
              <Image
                src={getAssetPath('/car_card-4.webp')}
                alt="車輛辨識卡1"
                width={400}
                height={300}
                className="w-full h-auto"
              />
              <a
                href="https://drive.google.com/drive/folders/1uvZSz3l7M-CnEctqU3t5QhBF60nw0YHT?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="my-6 w-full inline-block text-white bg-[var(--primary)] hover:bg-[#e06d00] rounded-[12px] px-8 py-4 font-medium transition-colors text-center"
              >
                下載車輛識別卡
              </a>
            </div>

            {/* 注意事項 */}
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <StepNumber number={5} />
                <h3 className="font-bold text-xl">注意事項</h3>
              </div>
              <div className="bg-white border-2 border-[var(--secondary)] rounded-lg p-6 space-y-6">
                <p className="text-[var(--text-black)] leading-relaxed">
                  最後，請記得救災是一場馬拉松。請詳讀以下事項，做好體力與心理準備——先照顧自己，才能真正幫助他人。
                </p>

                <div className="space-y-4">
                  <div className="border-b border-[var(--gray-3)] pb-4">
                    <h4 className="font-bold text-lg mb-2 text-[var(--text-black)]">安全第一</h4>
                    <p className="text-[var(--gray-2)] leading-relaxed">
                      留意堰塞湖與潰堤風險，熟悉避難守則與撤離路線，遇到警報或洪水危險，務必立即撤離。
                    </p>
                  </div>

                  <div className="border-b border-[var(--gray-3)] pb-4">
                    <h4 className="font-bold text-lg mb-2 text-[var(--text-black)]">結伴同行</h4>
                    <p className="text-[var(--gray-2)] leading-relaxed">
                      避免單獨行動，與夥伴結伴，彼此照應更安全。
                    </p>
                  </div>

                  <div className="border-b border-[var(--gray-3)] pb-4">
                    <h4 className="font-bold text-lg mb-2 text-[var(--text-black)]">保持聯繫</h4>
                    <p className="text-[var(--gray-2)] leading-relaxed">
                      手機保持電量，攜帶行動電源，確保能通訊與定位。
                    </p>
                  </div>

                  <div className="border-b border-[var(--gray-3)] pb-4">
                    <h4 className="font-bold text-lg mb-2 text-[var(--text-black)]">補給防護</h4>
                    <p className="text-[var(--gray-2)] leading-relaxed">
                      隨時補水，戴帽子穿排汗衣，適時休息避免中暑與脫水。交通不便、物資有限，請自備足夠飲水與糧食。
                    </p>
                  </div>

                  <div className="border-b border-[var(--gray-3)] pb-4">
                    <h4 className="font-bold text-lg mb-2 text-[var(--text-black)]">身心調適</h4>
                    <p className="text-[var(--gray-2)] leading-relaxed">
                      身心調適：體力是最大資源，先顧好自己。若遇屍體或重災情要有心理準備，需要時務必求援。
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-2 text-[var(--text-black)]">交通安排</h4>
                    <p className="text-[var(--gray-2)] leading-relaxed">
                      勿開車進入光復，將道路留給救援及大型機具。事先購買回程車票，避免返程無座。
                      <br />
                      <a
                        href="https://sites.google.com/view/guangfu250923/%E6%88%91%E6%98%AF%E5%BF%97%E5%B7%A5/transport?authuser=0"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--secondary)] underline ml-1"
                      >
                        點此查看交通資訊
                      </a>
                      <br />
                      <br />
                      或<br />
                      <a
                        href="https://gobus.moushih.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--secondary)] underline ml-1"
                      >
                        點我前往GoBus遊覽車媒合平台
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 線上志工 */}
            <div>
              <div className="rounded-lg px-2 py-8 text-center space-y-2">
                <h3 className="font-bold text-xl text-[var(--text-black)]">
                  評估自己無法到第一線清淤超人
                </h3>
                <p className="mb-6">歡迎加入線上或到志工媒合當其他種類超人！</p>
                <a
                  href="https://sites.google.com/view/guangfu250923/%E6%88%91%E6%98%AF%E5%BF%97%E5%B7%A5/volunteers?authuser=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[var(--primary)] hover:bg-[#e06d00] text-white font-bold py-3 px-8 rounded-lg transition-colors"
                >
                  加入線上志工
                </a>
              </div>
            </div>
          </div>
        )}
        {selectedCategory === '交通資訊' && (
          <div className="space-y-6 mb-5">
            <div className="bg-[var(--gray-4)] rounded-lg p-5">
              <h2 className="text-xl font-bold text-center mb-3">
                請勿開車進入光復，
                <br />
                把路留給救災的重機！
              </h2>
              <div className="flex gap-4">
                <div className="flex flex-col w-1/2">
                  <div className="text-center bg-[var(--light-primary)] rounded py-1 px-2 font-bold mb-2">
                    南下路線
                  </div>
                  <div>請停在花蓮火車站，改搭區間車往光復。</div>
                </div>
                <div className="flex flex-col w-1/2">
                  <div className="text-center bg-[var(--light-primary)] rounded py-1 px-2 font-bold mb-2">
                    北上路線
                  </div>
                  <div>請停在鳳林火車站，改搭區間車往光復。</div>
                </div>
              </div>
            </div>

            <div className="flex p-[4px] mx-auto my-8 gap-3 rounded-lg border border-[var(--gray-3)] bg-[var(--gray-4)]">
              <button
                onClick={() => setSelectedTransportMode('大眾運輸')}
                className={`
                  flex-1 text-sm h-[36px] py-[8px] px-[25px]
                  rounded-lg border-0 cursor-pointer whitespace-nowrap
                  ${
                    selectedTransportMode === '大眾運輸'
                      ? `
                      bg-[var(--primary)] text-white
                    `
                      : `
                      bg-[var(--gray-4)] text-[var(--text-black)]
                    `
                  }
                `}
              >
                大眾運輸 / 接駁
              </button>
              <button
                onClick={() => setSelectedTransportMode('共乘資訊')}
                className={`
                  flex-1 text-sm h-[36px] py-[8px] px-[25px]
                  rounded-lg border-0 cursor-pointer whitespace-nowrap
                  ${
                    selectedTransportMode === '共乘資訊'
                      ? `
                      bg-[var(--primary)] text-white
                    `
                      : `
                      bg-[var(--gray-4)] text-[var(--text-black)]
                    `
                  }
                `}
              >
                共乘資訊
              </button>
            </div>

            {selectedTransportMode === '大眾運輸' && (
              <>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <StepNumber number={1} />
                    <h2 className="text-[var(--text-black)] font-semibold text-xl">
                      如何到花蓮：台鐵
                    </h2>
                  </div>
                  <div className="flex my-3">
                    <ActionButton
                      href={'https://www.railway.gov.tw/tra-tip-web/tip/tip001/tip112/gobytime'}
                      variant="secondary"
                      icon="/icon_arrow_outward.svg"
                    >
                      列車班次資訊
                    </ActionButton>
                  </div>
                  <div className="flex my-3">
                    <ActionButton
                      href={'https://www.railway.gov.tw/tra-tip-web/tip/tip001/tip121/query'}
                      variant="secondary"
                      icon="/icon_arrow_outward.svg"
                    >
                      前往訂票
                    </ActionButton>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <StepNumber number={2} />
                    <h2 className="text-[var(--text-black)] font-semibold text-xl">
                      如何從花蓮到災區
                    </h2>
                  </div>
                  <div className="mb-6">
                    <p className="rounded-lg bg-[var(--light-primary)] text-center py-1 text-md mb-2">
                      交通部觀光署接駁車
                    </p>
                    <div className="text-sm text-[var(--text-black)]  mb-2">
                      公路局每日調度專車：
                      <br />
                      07:00-10:00、16:00-20:00 每小時一班
                      <br />
                      <p className="text-sm text-[var(--gray-2)] mt-2">
                        *班次將依現場狀況調整，請隨時留意官方公告。
                      </p>
                      <div className="flex my-3">
                        <ActionButton
                          href={
                            'https://www.facebook.com/timefortaiwan101/posts/1240379071467098?rdid=rHjplZG0zRYAL8Dw#'
                          }
                          variant="secondary"
                          icon="/icon_arrow_outward.svg"
                        >
                          點此看官方公告
                        </ActionButton>
                      </div>
                    </div>
                    <Image
                      src={getAssetPath('/station_1.webp')}
                      alt="花蓮車站 A"
                      width={200}
                      height={300}
                      className="my-2 w-full h-auto"
                    />
                    <Image
                      src={getAssetPath('/station_2.webp')}
                      alt="花蓮車站 B"
                      width={200}
                      height={300}
                      className="my-2 w-full h-auto"
                    />
                    <p className="text-sm text-[var(--gray-2)] mt-2">
                      ※專車路線往返新城｜花蓮｜吉安｜壽豐｜玉里等站與志工住宿地點。
                      <br />
                      ※車站與專車皆有識別圖卡，方便快速找到搭乘位置。
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="rounded-lg bg-[var(--light-primary)] py-1 text-center text-md mb-2">
                      尋找小蜜蜂接駁
                    </p>
                    <div className="bg-[var(--gray-4)] rounded-lg p-4">
                      <div className="font-medium ">車站前臨時泊車點（無固定位置）</div>
                      <div className="text-[var(--gray-2)] my-2">
                        出車站後，跟著現場的招牌指引就能找到！救災需求千變萬化，泊車點也跟著滾動調整，因此無確切地址。
                      </div>
                      <div className="bg-white rounded-lg overflow-hidden border border-[var(--gray-3)]">
                        <Image
                          src={getAssetPath('/sign.webp')}
                          alt="sign"
                          width={200}
                          height={300}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="rounded-lg bg-[var(--light-primary)] py-1 text-center text-md mb-2">
                      其他社群資訊
                    </p>
                    <div className="bg-[var(--gray-4)] rounded-lg p-4 space-y-6">
                      <div className="flex gap-2">
                        <div className="basis-2/5 font-bold">
                          慈濟志工社群
                          <br />
                          <a
                            className="border-b text-[var(--secondary)]"
                            href="https://line.me/ti/g2/gNNwamqenP9lV5jJHFVvIC2SYJOWrPbwJNMLXA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            加入 LINE@
                          </a>
                        </div>
                        <p className="basis-3/5 text-[var(--gray-2)]">
                          由慈濟組織的志工社群，可依指示至記事本了解群內運作模式。
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div className="basis-2/5 font-bold">
                          動森島民
                          <br />
                          <a
                            className="border-b text-[var(--secondary)]"
                            href="https://line.me/ti/g2/RBQui9B01TU9u5fnru_3KCS9J4BuvZInmkO7DA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            加入 LINE@
                          </a>
                        </div>
                        <p className="basis-3/5 text-[var(--gray-2)]">
                          由當地居民自行組織，可依指示至記事本了解群內運作模式。
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div className="basis-2/5 font-bold">
                          花蓮救災-
                          <br />
                          <a
                            className="border-b text-[var(--secondary)]"
                            href="https://line.me/ti/g2/xFQQW0R_NpxuFQ2diepCNKrqzYne-lqMLolknQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            加入 LINE@
                          </a>
                        </div>
                        <p className="basis-3/5 text-[var(--gray-2)]">
                          由熱心超人組織，可依指示至記事本了解群內運作模式。
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <div className="basis-2/5 font-bold">
                          出發阿陶莫
                          <br />
                          <a
                            className="border-b text-[var(--secondary)]"
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://line.me/ti/g/kT5bXAtJ4U"
                          >
                            加入 LINE@
                          </a>
                        </div>
                        <p className="basis-3/5 text-[var(--gray-2)]">
                          由熱心超人組織，可依指示至記事本了解群內運作模式。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedTransportMode === '共乘資訊' && (
              <div className="space-y-4">
                <div>
                  <p className="rounded-lg bg-[var(--light-primary)] text-center py-1 text-md mb-2">
                    替代路線
                  </p>
                  <div className="bg-white overflow-hidden my-4">
                    <Image
                      src={getAssetPath('/alt_road.webp')}
                      alt="alt-road"
                      width={200}
                      height={300}
                      className="w-full h-auto"
                    />
                    <div className="text-md text-[var(--gray)] my-2 text-center">
                      資料來源：2025/09/26 花蓮縣政府公告
                    </div>
                  </div>
                </div>
                <div>
                  <p className="rounded-lg bg-[var(--light-primary)] text-center py-1 text-md mb-2">
                    遊覽車媒合
                  </p>
                  <Image
                    src={getAssetPath('/go_bus_banner.webp')}
                    alt="go-bus-banner"
                    width={335}
                    height={335}
                    className="w-full h-auto"
                  />
                  <h3 className="font-semibold mb-0 mt-3">關於 Gobus —— 讓愛心接送，更簡單。</h3>
                  <p>
                    召集人可以輕鬆發布車次、管理名單；志工則能一鍵報名、快速參加活動。讓每一次出發，都更有效率，也更有溫度。
                  </p>
                  <div className="flex my-3">
                    <ActionButton
                      href={'https://gobus.moushih.com/'}
                      variant="secondary"
                      icon="/icon_arrow_outward.svg"
                    >
                      遊覽車媒合去Gobus
                    </ActionButton>
                  </div>
                </div>
                <div>
                  <p className="rounded-lg bg-[var(--light-primary)] text-center py-1 text-md mb-2">
                    各區共乘資訊
                  </p>
                  <p className="m-2">加入共乘 Line 群組，可查看相關資訊</p>
                  <div className="flex my-3">
                    <ActionButton
                      href={
                        'https://line.me/ti/g2/gitK-a3bK9FWZPLET55pxfGo0CyDT1NenIt8mQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default'
                      }
                      variant="secondary"
                      icon="/icon_arrow_outward.svg"
                    >
                      光復救災 北區共乘
                    </ActionButton>
                  </div>
                  <div className="flex my-3">
                    <ActionButton
                      href={
                        'https://line.me/ti/g2/t15dvRs84e71Bv3W4GNKPlFcqycQFxaAeP3pRg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default'
                      }
                      variant="secondary"
                      icon="/icon_arrow_outward.svg"
                    >
                      光復救災 中區共乘
                    </ActionButton>
                  </div>
                  <div className="flex my-3">
                    <ActionButton
                      href={
                        'https://line.me/ti/g2/rSzI8t-udCwxDYITMl2WzdCyAnyjgATWkdg5Zw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default'
                      }
                      variant="secondary"
                      icon="/icon_arrow_outward.svg"
                    >
                      光復救災 南區共乘
                    </ActionButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {selectedCategory === '住宿資訊' && <PlaceList activeTab={PlaceType.ACCOMMODATION} />}
      </div>
    </div>
  );
}
