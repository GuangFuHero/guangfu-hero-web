import Wrapper from '@/features/Wrapper';
import { Metadata } from 'next';
import { env } from '@/config/env';

export const generateMetadata = (): Metadata => {
  return {
    title: '服務條款',
    description:
      '本平台為民間自發性非營利之救災資訊整合與媒合服務，使用前請詳閱平台性質、責任限制與使用規範。',
    openGraph: {
      title: '服務條款',
      description:
        '本平台為民間自發性非營利之救災資訊整合與媒合服務，使用前請詳閱平台性質、責任限制與使用規範。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/terms`,
      type: 'website',
    },
  };
};

export default function TermsPage() {
  return (
    <Wrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">服務條款</h1>

        <div className="space-y-6 text-[var(--gray)]">
          <section>
            <p className="mb-4">適用網站：光復救災資訊整合及本團隊所架設之平台（下稱「本網站」）</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">適用範圍</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                本服務條款（下稱本條款）係由光復救災資訊整合網（下稱本平台或「我們」）所訂定。本平台為民間自發性非營利組織，旨在協助2025年9月23日花蓮馬太鞍溢流光復水災之救災資訊整合。
              </li>
              <li>
                當您使用本平台或其提供之表單、媒合平台及資訊上傳與社群連結分享等功能，即代表同意本平台服務條款與隱私權政策。
              </li>
              <li>未成年人需經法定代理人同意且不得獨自從事具安全風險之行動。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">本平台提供以下服務</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>救災志工報名與媒合資訊</li>
              <li>物資需求與捐贈資訊媒合（純資訊性質，不涉及金流處理）</li>
              <li>使用者生成內容之上傳與分享</li>
              <li>
                救災相關資訊整合與發布（包括但不限於圖文影音等經同意授權者，本平台重製或轉發皆與原作者享有共同著作權，非經本平台同意切勿任意另行作為媒體營利行為）
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">本平台性質與免責</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                本平台係資訊整合與志工、物資媒合平台，非任何專業指示或保證，亦非政府或依法備查之「志願服務運用單位」，不得視為提供志願服務證、保險或訓練之機構。
              </li>
              <li>
                志工或提供物資者均應依現地指揮與官方公告行動，並自行評估體力、風險與自身安全等方式。
              </li>
              <li>對於因使用本平台而生之直接或間接損害，我們於法律允許範圍內不負賠償責任。</li>
            </ul>

            <h3 className="text-lg font-bold mt-4 mb-2">資訊正確性</h3>
            <p className="mb-2">本平台盡力確保物資資訊之正確性，但不保證：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>物資需求資訊之即時性或準確性</li>
              <li>物資捐贈後之實際運用情況</li>
              <li>捐贈物資與受贈方需求之完全匹配</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">物資捐贈媒合服務</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                本平台僅提供資訊媒合與導引。若涉及金錢募款，依法須由符合資格之團體依「公益勸募條例」辦理許可或備查，本平台不收受捐款。
              </li>
              <li>
                本平台提供物資需求與捐贈之純資訊媒合服務，不涉及：
                <ul className="list-circle pl-6 mt-2 space-y-1">
                  <li>金錢捐款之處理</li>
                  <li>線上金流服務</li>
                  <li>物資之保管、運送或分配</li>
                  <li>捐贈契約之成立或履行</li>
                </ul>
              </li>
              <li>若透過本平台連結向第三方捐贈，相關權利義務以該第三方之條款為準。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">授權</h2>

            <h3 className="text-lg font-bold mt-4 mb-2">使用者內容規範</h3>
            <p className="mb-2">
              使用者於本平台上傳或張貼之文字、影像、連結、回報等（下稱「使用者內容」），不得：
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>侵害他人智慧財產或隱私權</li>
              <li>散布錯誤災情、造謠或任何違法內容</li>
            </ul>
            <p className="mt-3">
              本平台得基於法令或安全需要移除內容、限制權限或通報。對於智慧財產權爭議，本平台適用「通知移除／回復通知」流程並提供聯繫窗口，以符合網路服務提供者之責任限制規範。
            </p>

            <h3 className="text-lg font-bold mt-4 mb-2">智慧財產權</h3>
            <p className="mb-2">
              本平台之所有內容，包括但不限於文字、圖片、影音、軟體、程式碼、網站架構、網頁設計等，均受著作權法及其他智慧財產權法保護。
            </p>

            <h3 className="text-lg font-bold mt-4 mb-2">使用者授權</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                使用者同意使用本平台而提供災情傳遞、任務調度、媒合與安全目的之使用授權，並製作圖文及聯繫相關單位作為使用。
              </li>
              <li>
                若內容含他人權利或是個人資料，使用者保證已具備隱私權相關法令遵循處理及揭露之合法基礎。
              </li>
              <li>
                本平台得以任何形式重製、改作、公開傳輸、公開播送、公開上映、公開演出、編輯、散布您上傳之內容。
              </li>
              <li>
                本平台得在使用使用者上傳之內容時，標示您之姓名、暱稱或其他識別資訊（如有提供）。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">第三方服務</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                本平台透過嵌入或連結第三方（如Google、Github）作為通訊、表單、雲端或串接做為資料蒐集及利用服務。其條款與隱私權政策依第三方相關政策而定。
              </li>
              <li>基於維護、資安、不可抗力或超出合理控制之情形，我們得暫停或變更服務。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">服務變更與終止</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                本平台將不定期進行功能或使用上變更，並公告並標示生效日，而並不另行個別通知；若使用者接收本平台訊息而行動則視為同意本平台服務條款。
              </li>
              <li>
                除法律明文規定或本條款另有約定外，不得：
                <ul className="list-circle pl-6 mt-2 space-y-1">
                  <li>重製、改作、編輯、散布本平台內容</li>
                  <li>將本平台內容用於商業目的</li>
                  <li>移除或變更本平台內容之著作權聲明</li>
                </ul>
              </li>
              <li>
                得基於個人、非商業目的，引用、分享本平台之公開資訊，但應：
                <ul className="list-circle pl-6 mt-2 space-y-1">
                  <li>註明資料來源</li>
                  <li>不得斷章取義或曲解原意</li>
                  <li>不得侵害本平台或他人之權益</li>
                </ul>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">準據法與管轄</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>本條款依中華民國法令作為準據法，相關爭議及解釋依此進行處理</li>
              <li>由臺北地方法院為第一審管轄</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">資料移除與更正</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                使用者有權要求查詢、更正或刪除您的個人資料。詳細規定請參閱本平台《隱私權政策》。
              </li>
              <li>本平台將於收到使用者的申請後儘速處理並刊誤。</li>
            </ul>
          </section>

          <section className="bg-[var(--gray-4)] p-4 rounded mt-8">
            <p className="font-bold">本服務條款自公告日起生效</p>
            <p>公告日期：2025 年 10 月 1 日</p>
            <p>版本：1.0</p>
          </section>
        </div>
      </div>
    </Wrapper>
  );
}
