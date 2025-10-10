"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/Button";
import ClothingProtectionChecklist from "@/features/VolunteerInfo/ClothingProtectionChecklist";
import FootwearHandsChecklist from "@/features/VolunteerInfo/FootwearHandsChecklist";
import MedicalItemsChecklist from "@/features/VolunteerInfo/MedicalItemsChecklist";
import FoodSuppliesChecklist from "@/features/VolunteerInfo/FoodSuppliesChecklist";
import DisasterReliefToolsChecklist from "@/features/VolunteerInfo/DisasterReliefToolsChecklist";
import OtherEssentialChecklist from "./OtherEssentialChecklistProps";
import { getAssetPath } from "@/lib/utils";
import StepNumber from "@/components/StepNumber";

type InfoCategory = "行前必讀" | "交通資訊" | "住宿資訊";
type TransportMode = "大眾運輸" | "共乘資訊";

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
  { title: "確認資訊", text: "查詢災區天氣、交通、人力需求等，評估自身情況" },
  { title: "加入志工", text: "加入個人志工，如 Line 社群、本平台媒合、或至光復車站前接受調度" },
  { title: "行前準備", text: "確認交通資訊、裝備（下滑有裝備清單喔）" },
  { title: "出發光復", text: "切勿勉強赴災！建議訂好回程車票、聯絡嚮導" },
  { title: "進入災區", text: "抵達災區後，尋找聯絡人，帶你抵達受困區的地點" },
  { title: "若身體不適", text: "及早至就醫點就醫，災區內醫治不宜拖延至緊急時刻！"},
  { title: "替換衣物", text: "返家前，將髒污衣物裝進垃圾袋中隔離丟棄，替換成乾淨衣物離開災區" },
];

export default function VolunteerInfo({
  initialCategory = "行前必讀",
}: VolunteerInfoProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState<InfoCategory>(initialCategory);
  const [selectedTransportMode, setSelectedTransportMode] =
    useState<TransportMode>("大眾運輸");

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleCheckboxChange = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const categories: InfoCategory[] = ["行前必讀", "交通資訊", "住宿資訊"];

  const handleCategoryClick = (category: InfoCategory) => {
    if (category === "住宿資訊") {
      router.push("/map?view=list&category=accommodations");
    } else if (category === "行前必讀") {
      router.push("/volunteer/preparation");
    } else if (category === "交通資訊") {
      router.push("/volunteer/transportation");
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <div>
      {/* 按鈕列表 - 支援橫向滾動 */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-3 mb-6 min-w-max">
          {categories.map((category) => (
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
        {selectedCategory === "行前必讀" && (
          <div className="space-y-4">
            {/* 如何加入志工 */}
            <div className="flex items-center gap-3 mb-4">
              <StepNumber number={1} />
              <h2 className="text-[var(--text-black)] font-semibold text-xl">
                如何加入志工
              </h2>
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
              <div className="text-[var(--secondary)] mb-1 text-lg font-bold">
                使用原因
              </div>
              <div className="mb-4">
                讓大家一眼就能快速辨識，增加執行效率。
                <br /><br />
                <span className="text-[var(--primary)]">
                  專業志工辨別證
                </span>
                表明專業能力，立馬和需求連結，成為災區即戰力！
                <br />
                <span className="text-[var(--primary)]">
                  車輛辨識卡
                </span>
                表明物資內容，讓災區交通更順暢！
              </div>
              <div className="text-[var(--secondary)] mb-1 text-lg font-bold">
                使用說明
              </div>
              <div className="mb-4">
                1.點擊按鈕下載
                <br />
                2.將識別證掛胸前/背後,卡貼在車窗前
              </div>
              <Image
                src={getAssetPath("/volunteer_card-1.svg")}
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
                src={getAssetPath("/car_card-4.svg")}
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
                    <h4 className="font-bold text-lg mb-2 text-[var(--text-black)]">
                      安全第一
                    </h4>
                    <p className="text-[var(--gray-2)] leading-relaxed">
                      留意堰塞湖與潰堤風險，熟悉避難守則與撤離路線，遇到警報或洪水危險，務必立即撤離。
                    </p>
                  </div>

                  <div className="border-b border-[var(--gray-3)] pb-4">
                    <h4 className="font-bold text-lg mb-2 text-[var(--text-black)]">
                      結伴同行
                    </h4>
                    <p className="text-[var(--gray-2)] leading-relaxed">
                      避免單獨行動，與夥伴結伴，彼此照應更安全。
                    </p>
                  </div>

                  <div className="border-b border-[var(--gray-3)] pb-4">
                    <h4 className="font-bold text-lg mb-2 text-[var(--text-black)]">
                      保持聯繫
                    </h4>
                    <p className="text-[var(--gray-2)] leading-relaxed">
                      手機保持電量，攜帶行動電源，確保能通訊與定位。
                    </p>
                  </div>

                  <div className="border-b border-[var(--gray-3)] pb-4">
                    <h4 className="font-bold text-lg mb-2 text-[var(--text-black)]">
                      補給防護
                    </h4>
                    <p className="text-[var(--gray-2)] leading-relaxed">
                      隨時補水，戴帽子穿排汗衣，適時休息避免中暑與脫水。交通不便、物資有限，請自備足夠飲水與糧食。
                    </p>
                  </div>

                  <div className="border-b border-[var(--gray-3)] pb-4">
                    <h4 className="font-bold text-lg mb-2 text-[var(--text-black)]">
                      身心調適
                    </h4>
                    <p className="text-[var(--gray-2)] leading-relaxed">
                      身心調適：體力是最大資源，先顧好自己。若遇屍體或重災情要有心理準備，需要時務必求援。
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-lg mb-2 text-[var(--text-black)]">
                      交通安排
                    </h4>
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
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 線上志工 */}
            <div>
              <div className="rounded-lg p-8 text-center space-y-2">
                <h3 className="font-bold text-xl text-[var(--text-black)]">
                  評估自己無法到第一線清淤超人
                </h3>
                <p className="mb-6">也可以加入線上志工，一起遠端貢獻心力</p>
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
        {selectedCategory === "交通資訊" && (
          <div className="space-y-6 mb-5">
            <h2 className="text-[var(--orange)] text-2xl text-center font-bold mb-4">
              把路留給救災的重機！
            </h2>
            <p className="text-[var(--text-black)] leading-relaxed">
              花蓮光復鄉正全力進行災後重建，台鐵已加開班次，以確保充足運能。一起搭乘大眾運輸，以保存體力，把力量留到最關鍵的時刻！如真的需要自駕，請盡可能共乘，讓我們一起將道路讓給救災重機！
            </p>

            <div className="flex p-[4px] mx-auto my-8 size-fit gap-3 rounded-full border border-[var(--gray-3)]">
              <button
                onClick={() => setSelectedTransportMode("大眾運輸")}
                className={`
                  text-sm h-[36px] py-[8px] px-[25px]
                  rounded-full border-0 cursor-pointer whitespace-nowrap
                  ${
                    selectedTransportMode === "大眾運輸"
                      ? `
                      bg-[var(--light-gray-background)] text-[var(--orange)]
                    `
                      : `
                      bg-[var(--background)] text-[var(--gray-2)]
                    `
                  }
                `}
              >
                大眾運輸
              </button>
              <button
                onClick={() => setSelectedTransportMode("共乘資訊")}
                className={`
                  text-sm h-[36px] py-[8px] px-[25px]
                  rounded-full border-0 cursor-pointer whitespace-nowrap
                  ${
                    selectedTransportMode === "共乘資訊"
                      ? `
                      bg-[var(--light-gray-background)] text-[var(--orange)]
                    `
                      : `
                      bg-[var(--background)] text-[var(--gray-2)]
                    `
                  }
                `}
              >
                共乘資訊
              </button>
            </div>

            {selectedTransportMode === "大眾運輸" && (
              <>
                <div>
                  <h3 className="text-xl font-bold mb-3">
                    一、如何到花蓮：台鐵
                  </h3>
                  <a
                    href="https://www.railway.gov.tw/tra-tip-web/tip/tip001/tip112/gobytime"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex text-[var(--gray)] underline text-sm mb-2"
                  >
                    列車班次這裡看
                  </a>
                  <a
                    href="https://www.railway.gov.tw/tra-tip-web/tip/tip001/tip121/query"
                    className="flex text-[var(--gray)] underline text-sm mb-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    台鐵訂票來這邊
                  </a>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-[var(--text-black)]">
                    二、如何從花蓮到災區
                  </h3>

                  <div>
                    <p className="rounded-lg bg-[var(--light-primary)] text-center text-md mb-2">
                      交通部觀光署接駁車
                    </p>
                    <p className="text-center text-sm text-[var(--text-black)]  mb-2">
                      公路局每日調度專車：
                      <br />
                      07:00-10:00、16:00-20:00
                      <br />
                      每小時一班
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white rounded-lg overflow-hidden border border-[var(--gray-3)]">
                        <Image
                          src={getAssetPath("/station_1.svg")}
                          alt="花蓮車站 A"
                          width={200}
                          height={300}
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="bg-white rounded-lg overflow-hidden border border-[var(--gray-3)]">
                        <Image
                          src={getAssetPath("/station_2.svg")}
                          alt="花蓮車站 B"
                          width={200}
                          height={300}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                    <div className="text-sm text-[var(--gray)] space-y-2 mb-4">
                      <p>
                        ※專車路線往返新城｜花蓮｜吉安｜壽豐｜玉里等站與志工住宿地點。
                      </p>
                      <p>※車站與專車皆有識別圖卡，方便快速找到搭乘位置。</p>
                      <p>
                        ※班次將依需求與災區復原狀況隨時調整，確保交通不中斷。
                      </p>
                    </div>
                    <div className="mb-4">
                      <a
                        href="https://www.facebook.com/timefortaiwan101/posts/1240379071467098?rdid=rHjplZG0zRYAL8Dw#"
                        className="underline text-sm text-[var(--secondary)]"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        點此看官方公告
                      </a>
                      <p className="text-sm text-[var(--gray-2)] mt-2">
                        *交通部可能依現場狀況調整班次間距，請隨時留意官方公告。
                      </p>
                    </div>
                  </div>

                  <div className="text-[var(--text-black)]">
                    <p className="rounded-lg bg-[var(--light-primary)] text-center text-md mb-2">
                      尋找小蜜蜂接駁
                    </p>
                    <p>
                      車站周邊目前已由政府、軍方接手，以重機為主力投入救援。然而，偏遠的村落還需要鏟子超人們的支援！小蜜蜂超人已準備好，帶著鏟子超人們，一起前往需要幫助的地方！
                    </p>
                    <p className="mt-4 mb-4">
                      無論獨行或加入任何團體救災，請務必注意自身安全
                    </p>
                  </div>

                  <div className="bg-[var(--gray-background)] rounded-lg p-6 space-y-6">
                    <div className="flex gap-2">
                      <div className="w-70 font-bold">
                        車站前小蜜蜂臨時泊車點
                        <br />
                        （無固定位置）
                      </div>
                      <p className="text-[var(--gray-2)]">
                        出車站後，跟著現場的招牌指引就能找到！救災需求千變萬化，泊車點也跟著滾動調整，因此無確切地址。
                      </p>
                    </div>
                    <div className="bg-white rounded-lg overflow-hidden border border-[var(--gray-3)]">
                      <Image
                        src={getAssetPath("/sign.svg")}
                        alt="sign"
                        width={200}
                        height={300}
                        className="w-full h-auto"
                      />
                    </div>

                    <div className="flex gap-2">
                      <div className="w-70 font-bold">
                        慈濟志工社群
                        <br />
                        <a
                          className="border-b text-[var(--secondary)]"
                          href="https://line.me/ti/g2/gNNwamqenP9lV5jJHFVvIC2SYJOWrPbwJNMLXA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          加入 LINE 社群
                        </a>
                      </div>
                      <p className="text-[var(--gray-2)]">
                        由慈濟組織的志工社群，可依指示至記事本了解群內運作模式。
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-70 font-bold">
                        動森島民
                        <br />
                        <a
                          className="border-b text-[var(--secondary)]"
                          href="https://line.me/ti/g2/RBQui9B01TU9u5fnru_3KCS9J4BuvZInmkO7DA?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          加入 LINE 社群
                        </a>
                      </div>
                      <p className="text-[var(--gray-2)]">
                        由當地居民自行組織，可依指示至記事本了解群內運作模式。
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-70 font-bold">
                        花蓮救災-大部隊不去的地方
                        <br />
                        <a
                          className="border-b text-[var(--secondary)]"
                          href="https://line.me/ti/g2/xFQQW0R_NpxuFQ2diepCNKrqzYne-lqMLolknQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          加入 LINE 社群
                        </a>
                      </div>
                      <p className="text-[var(--gray-2)]">
                        由熱心超人組織，可依指示至記事本了解群內運作模式。
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-70 font-bold">
                        出發阿陶莫
                        <br />
                        <a
                          className="border-b text-[var(--secondary)]"
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://line.me/ti/g/kT5bXAtJ4U"
                        >
                          加入 LINE 社群
                        </a>
                      </div>
                      <p className="text-[var(--gray-2)]">
                        由熱心超人組織，可依指示至記事本了解群內運作模式。
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {selectedTransportMode === "共乘資訊" && (
              <div className="space-y-4">
                <div>
                  <div className="bg-[var(--gray-background)] rounded-lg p-5">
                    <h2 className="text-xl font-bold text-center mb-3">
                      請勿開車進入光復
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

                  <div className="bg-white overflow-hidden my-4">
                    <Image
                      src={getAssetPath("/alt_road.svg")}
                      alt="alt-road"
                      width={200}
                      height={300}
                      className="w-full h-auto"
                    />
                    <div className="text-md text-[var(--gray)] my-2 text-center">
                      資料來源：2025/09/26 花蓮縣政府公告
                    </div>
                  </div>
                  <div className="text-md py-4">
                    <div className="flex justify-center mb-3">
                      <a
                        href="https://gobus.moushih.com/"
                        className="flex text-[var(--secondary)] underline text-md"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        遊覽車媒合去Gobus
                      </a>
                    </div>
                    <Image
                      src={getAssetPath("/go_bus_banner.svg")}
                      alt="go-bus-banner"
                      width={335}
                      height={335}
                      className="w-full h-auto"
                    />
                    <h3 className="font-semibold mb-0 mt-3">
                      關於 Gobus —— 讓愛心接送，更簡單。
                    </h3>
                    <p>
                      召集人可以輕鬆發布車次、管理名單；志工則能一鍵報名、快速參加活動。讓每一次出發，都更有效率，也更有溫度。
                    </p>
                  </div>
                  <p className="rounded-lg bg-[var(--light-primary)] text-center text-md mb-2 mt-4">
                    各區共乘資訊
                  </p>
                  <p className="m-2">
                    無論獨行或加入任何團體救災，請務必注意自身安全
                  </p>
                  <div className="flex flex-col m-2">
                    <a
                      href="https://line.me/ti/g2/gitK-a3bK9FWZPLET55pxfGo0CyDT1NenIt8mQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[var(--secondary)] underline mb-1"
                    >
                      光復救災 北區共乘
                    </a>
                    <a
                      href="https://line.me/ti/g2/t15dvRs84e71Bv3W4GNKPlFcqycQFxaAeP3pRg?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[var(--secondary)] underline mb-1"
                    >
                      光復救災 中區共乘
                    </a>
                    <a
                      href="https://line.me/ti/g2/rSzI8t-udCwxDYITMl2WzdCyAnyjgATWkdg5Zw?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-[var(--secondary)] underline mb-1"
                    >
                      光復救災 南區共乘
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {selectedCategory === "住宿資訊" && (
          <div className="p-6 bg-gray-50 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">住宿資訊</h2>
            <p className="text-[var(--gray)]">住宿資訊的內容將顯示在這裡</p>
          </div>
        )}
      </div>
    </div>
  );
}
