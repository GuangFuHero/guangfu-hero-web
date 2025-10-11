import Wrapper from '@/features/Wrapper';
import { Metadata } from 'next';
import { env } from '@/config/env';

export const generateMetadata = (): Metadata => {
  return {
    title: '隱私權政策',
    description:
      '說明個資蒐集目的、使用範圍與保護措施；災害之緊急公益情境下之目的外利用與告知原則。',
    openGraph: {
      title: '隱私權政策',
      description:
        '說明個資蒐集目的、使用範圍與保護措施；災害之緊急公益情境下之目的外利用與告知原則。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/privacy`,
      type: 'website',
    },
  };
};

export default function PrivacyPage() {
  return (
    <Wrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">隱私權政策</h1>

        <div className="space-y-6 text-[var(--gray)]">
          <section>
            <p className="mb-4">適用網站:光復救災資訊整合及本團隊所架設之平台(下稱「本網站」)</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">適用範圍</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                光復救災資訊整合網(下稱本網站、「我們」)重視您的隱私權保護。本隱私權政策(下稱「本政策」)說明本平台如何蒐集、處理、利用及保護您的個人資料。
              </li>
              <li>本隱私權政策適用於您使用本網站所有服務時,本網站所蒐集、處理及利用的個人資料。</li>
              <li>
                不適用於經由本網站連結之其他網站,該等網站之隱私權保護,請參閱各該網站之隱私權政策。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">個人資料蒐集目的</h2>
            <p className="mb-3">代碼 / 特定目的名稱:說明</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>045 / 災害防救:</strong>
                進行災害救援資訊整合、志工調度、物資媒合等救災相關活動
              </li>
              <li>
                <strong>069 / 契約、類似契約或其他法律關係事務:</strong>
                處理志工報名、使用者註冊等契約關係事務
              </li>
              <li>
                <strong>090 / 消費者、客戶管理與服務:</strong>
                提供平台服務、回應使用者需求、聯繫溝通
              </li>
              <li>
                <strong>157 / 調查、統計與研究分析:</strong>
                統計救災資訊、分析服務使用情形,以優化平台功能
              </li>
              <li>
                <strong>181 / 其他經營合於營業登記項目或組織章程所定之業務:</strong>
                與本網站救災資訊整合相關之其他必要業務
              </li>
            </ul>
            <p className="mt-3 text-sm bg-yellow-50 p-3 rounded">
              <strong>重要說明:</strong>
              基於災害救援之緊急性與公益性,在符合個資法第20條但書第3款、第4款,本網站得於原蒐集目的外利用您的個人資料。上述緊急授權僅限於災害救援之必要範圍,我們將盡最大努力通知當事人,並在緊急情境結束後,立即停止目的外利用。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">本網站可能蒐集的個人資料類別</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>識別類(C001):</strong>
                姓名、電子郵件地址、行動電話號碼、住址或通訊地址、身分證字號
              </li>
              <li>
                <strong>特徵類(C011):</strong>性別、出生年月日
              </li>
              <li>
                <strong>社會情況(C031-C038):</strong>
                職業、緊急聯絡人姓名及電話
              </li>
              <li>
                <strong>教育、技術或其他專業(C051-C053):</strong>
                專業證照資訊、專業技能、語言能力
              </li>
              <li>
                <strong>其他:</strong>
                時間與地點、可提供之物資種類與數量、其他您主動提供之資訊
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">個人資料來源</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>您直接提供:</strong>
                透過志工報名表、物資登錄表、使用者註冊等方式主動提供
              </li>
              <li>
                <strong>間接蒐集:</strong>
                在您使用本網站時自動產生之資料(如瀏覽記錄、IP位址、Cookie)
              </li>
              <li>
                <strong>第三方提供:</strong>
                經您同意,由其他合法救災組織或政府機關提供
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">利用之期間、地區、對象及方式</h2>

            <h3 className="text-lg font-bold mt-4 mb-2">利用期間</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>一般資料:特定目的存續期間(災害救援期間及後續必要期間)</li>
              <li>志工個資:自您報名之日起至救災任務結束後6個月</li>
              <li>物資媒合資料:自您登錄之日起至媒合完成後3個月</li>
              <li>使用者帳號資料:自您註冊之日起至帳號刪除之日止</li>
            </ul>

            <h3 className="text-lg font-bold mt-4 mb-2">利用地區</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>主要範圍:中華民國臺灣地區</li>
              <li>跨境傳輸:本網站使用之雲端服務可能涉及跨境傳輸</li>
            </ul>

            <h3 className="text-lg font-bold mt-4 mb-2">利用方式</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>志工媒合與調度</li>
              <li>物資需求與供給資訊配對</li>
              <li>救災資訊發布與傳播</li>
              <li>聯繫溝通與通知</li>
              <li>服務統計與分析(去識別化處理)</li>
              <li>緊急災害應變</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">不提供個人資料之影響</h2>
            <p className="mb-3">若您選擇不提供個人資料或提供不完整資料,可能產生下列影響:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>無法完成志工報名:無法聯繫您進行志工調度與安排</li>
              <li>無法進行物資媒合:無法確認您的聯絡方式與物資詳情</li>
              <li>無法提供完整服務:部分功能可能受限或無法使用</li>
              <li>緊急聯繫困難:災害情境下可能無法及時聯繫您</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">隱私權政策修訂</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>修訂權保留:</strong>
                本網站得隨時修訂本隱私權政策之權利,以符合法規要求或服務調整需要。
              </li>
              <li>
                <strong>修訂通知方式:</strong>
                網站首頁顯著位置公告或取得您的重新同意。
              </li>
              <li>
                <strong>一般修訂:</strong>
                (如文字調整、法規引用更新等)網站公告並更新「最後更新日期」,修訂後隱私權政策公告後,您繼續使用本網站服務,視為您已閱讀、瞭解並同意接受修訂後之內容。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Cookie與自動蒐集技術</h2>
            <p className="mb-3">本網站使用Cookie技術以改善使用者體驗,包括:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>記憶您的登入狀態</li>
              <li>分析網站流量與使用情形</li>
              <li>優化網站功能</li>
            </ul>
            <p className="mt-3 mb-3">您可以透過瀏覽器設定拒絕Cookie,但可能影響部分網站功能</p>

            <h3 className="text-lg font-bold mt-4 mb-2">自動蒐集資訊</h3>
            <p className="mb-2">本網站伺服器會自動記錄您的:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP位址</li>
              <li>瀏覽器類型與版本</li>
              <li>瀏覽時間與頁面</li>
              <li>裝置資訊</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">第三方連結</h2>
            <p>
              本網站可能包含連結至其他網站(如政府機關、其他救災組織等),該等網站之隱私權保護政策,請參閱各該網站之規定,本隱私權政策不適用。
            </p>
          </section>

          <section className="bg-[var(--gray-4)] p-4 rounded mt-8">
            <p className="font-bold">本隱私權政策自公告日起生效</p>
            <p>公告日期:2025 年 10 月 1 日</p>
            <p>版本:1.0</p>
          </section>
        </div>
      </div>
    </Wrapper>
  );
}
