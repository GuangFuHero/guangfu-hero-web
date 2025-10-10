"use client";

import TeamGroup from "@/components/TeamGroup";

export default function AboutUs() {
  const teamMembers = [
    {
      id: 1,
      groupName: "網站更新組",
      personNames: [
        "王◯恆",
        "Sam",
        "Zack",
        "JessZhong",
        "audery1011",
        "Pink Li",
        "施宇",
        "ppqq",
        "強森",
        "Yukay ",
        "破破popo",
        "彭◯珍",
        "WilliamTai",
        "陳◯妏",
        "Abby Su",
        "Wenny Chang",
        "Yi",
        "謝◯雯",
        "Stephanie Sung",
        "IKEA",
        "jerry._.",
        "Randy",
        "cy.hsu",
        "Sylvia Kuo",
        "陳◯柔",
        "JeanLu",
        "BensonTW",
        "ZhuMon",
        "Arey",
        "Ava Tu",
        "Mizhon",
        "Pichu",
        "haoyun, shih",
        "蘇◯育",
        "Glori",
        "Lindsay",
        "Meeka",
        "Oswald",
        "DanLin",
        "Chi",
        "Carol 朱◯綾",
        "浩富",
      ],
    },
    {
      id: 2,
      groupName: "宣傳組",
      personNames: [
        "于涵",
        "Sunny Yang",
        "捲捲 FANG JOU",
        "小魏 WEI",
        "ヨウヨウ",
        "Julia(小孟)",
        "阿一",
      ],
    },
    {
      id: 3,
      groupName: "地圖組",
      personNames: [
        "Zack",
        "Fannie",
        "張◯瑜 (PerfectlyJoJo)",
        "雅",
        "Zeli",
        "曾◯容 (鷹)",
        "Claire",
        "ShunFa Yang",
        "湯◯嵐 (Lanny Tang)",
        "billy",
      ]
    },
    {
      id: 4,
      groupName: "設計組",
      personNames: [
        "Vita",
        "Sunny Yang",
        "葉◯均 Andy",
        "JessZhong",
        "瑜瑜",
        "Pichu",
        "Yuling",
        "渺渺",
        "Sucre Lin 林糖糖",
        "Doublewen",
      ],
    },
    {
      id: 5,
      groupName: "DC管理組",
      personNames: [
        "JessZhong",
        "Sunny Yang",
        "瑜瑜",
        "Tobie 偷偷",
        "Andrew Yen",
        "Chun Caroline",
      ],
    },
    {
      id: 6,
      groupName: "Line社群組 & 官方組",
      personNames: [
        "于涵",
        "施宇 (鯊魚)",
      ],
    },
    {
      id: 7,
      groupName: "廣宣組",
      personNames: [
        "Sunny Yang",
        "Jocelyn",
        "Yukay",
        "Andrew Yen",
        "Julia(小孟)",
      ],
    },
    {
      id: 8,
      groupName: "核實組",
      personNames: [
        "雅",
        "湯雅嵐 (Lanny Tang)",
        "小路",
      ],
    },
    {
      id: 9,
      groupName: "公關組",
      personNames: [
        "捲捲 FANG JOU",
        "Andrew Yen",
      ],
    },
    {
      id: 10,
      groupName: "海巡組",
      personNames: [
        "Janet",
        "嵐",
        "小路",
        "艾瑪",
        "DanLin",
        "出包",
      ],
    },
    {
      id: 11,
      groupName: "進度管理組",
      personNames: [
        "Sucre Lin 林糖糖",
        "Aylin",
      ],
    },
  ];

  return (
    <div className="space-y-12 mb-[22px]">
      <section className="space-y-[22px]">
        <header className="h-[38px] py-2 px-2 text-[28px] font-medium text-[var(--text-black)] text-center">
          關於我們
        </header>
        <div className="text-[16px] leading-[20px] text-[var(--text-black)]">
          <p className="mb-4">
            許多人能親自前往災區成為志工，
            而我們，是一群無法親臨現場，卻同樣想為這片土地盡一份力的「遠端志工」、「鍵盤志工」。
            我們用彼此的專業與行動，在線上建立出一套能支援現場的資訊系統——「光復超人」。
          </p>
          <p className="mb-4">
            這個平台的誕生，源自於一個簡單的信念：
            即使不在現場，我們仍能彼此連結，一起伸出手，讓力量匯聚成擁抱。
          </p>
          <p className="mb-4">
            目前，我們已推出多項功能：
          </p>
          <p className="mb-4">
            🧭 志工指引：為新手志工整理了行前資訊，包括報到方式、交通概況、裝備建議，以及可加入的團隊與在地社群。
          </p>
          <p className="mb-4">
            🗺️ 志工地圖：整合災區的醫療站、物資站、廁所等地點，讓志工能更快熟悉現場環境。
          </p>
          <p className="mb-4">
            💬 需求媒合頁面：居民可直接登錄需求，志工能即時查看並前往支援，讓協助更有效率。
          </p>
          <p className="mb-4">
            🐝 小蜜蜂配給系統：由騎車志工組成的「小蜜蜂」團隊負責物資配送。居民填寫需求後，小蜜蜂即可前往物資站領取並親自送達。
          </p>
          <p className="mb-4">
            我們的團隊來自各地，日夜接力開發，只為讓資訊更即時、協作更順暢。
            救災不只是短暫的行動，而是一場持續的接力。
          </p>
          <p className="mb-4">
            本平台不隸屬於任何政府、民間團體，由熱心民眾齊心成立、普及災區資訊。
          </p>
          <p className="mb-4 text-[28px] leading-[40px] text-center text-[var(--primary)] font-bold">
            無論在哪裡，
            <br className="sm:hidden" />
            都能成為光復的超人。
          </p>
        </div>
      </section>

      <section className="space-y-[22px]">
        <header className="h-[38px] py-2 px-2 text-[28px] font-medium text-[var(--text-black)] text-center">
          團隊成員
        </header>
        <div className="text-[16px] leading-[20px] text-[var(--text-black)]">
          感謝所有為了讓系統能全天運作、資訊不中斷而付出的每一位「接力超人」！
        </div>

        <div className="space-y-[10px]">
          {teamMembers.map((member) => (
            <TeamGroup
              key={member.id}
              groupName={member.groupName}
              personNames={member.personNames}
            />
          ))}
        </div>

        <div className="text-[16px] leading-[20px] text-[var(--text-black)]">
          以及其他所有不願具名卻也默默地和我們一起完成任務的志工朋友！
        </div>
      </section>
    </div>
  );
}
