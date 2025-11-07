import { getAssetPath } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

function DearName() {
  return (
    <div
      className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full"
      data-name="dearName"
    >
      <p className="basis-0 font-['Noto_Sans_TC:Medium',sans-serif] font-medium grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[var(--gray)] text-[16px]">
        To: 每一位光復超人
      </p>
    </div>
  );
}

function Paragraph() {
  return (
    <div
      className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full"
      data-name="paragraph"
    >
      <div className="basis-0 font-['Noto_Sans_TC:Regular',sans-serif] font-normal grow leading-[20px] min-h-px min-w-px relative shrink-0 text-[var(--gray)] text-[16px]">
        <p className="mb-[20px]">
          感謝各地超人們
          <span className="text-[var(--primary)]"> 10/1 至 10/30 期間至災區援救</span>
          ，協力使災區回到正軌。因應災區第一階段搶救任務告一段落：
        </p>
        <p className="font-['Noto_Sans_TC:Bold',sans-serif] font-bold mb-0 text-[var(--black)]">
          如果您是志工
        </p>
        <p className="mb-[20px]">
          請至
          <span className="font-['Noto_Sans_TC:Medium',sans-serif] font-medium">
            大馬太鞍活動中心
          </span>
          接收現場任務分派
        </p>
        <p className="font-['Noto_Sans_TC:Bold',sans-serif] font-bold mb-0 text-[var(--black)]">
          如果您是居民
        </p>
        <p className="mb-0">
          需要一般志工請至
          <span className="font-['Noto_Sans_TC:Medium',sans-serif] font-medium">
            大馬太鞍活動中心
          </span>
          申請
        </p>
        <p className="mb-[20px]">
          需要專業志工請至
          <Link
            href="/victim/house-repair"
            className="[text-underline-position:from-font] decoration-solid font-['Noto_Sans_TC:Medium',sans-serif] font-medium text-[var(--secondary)] underline mx-1"
          >
            居家修繕
          </Link>
          <span className="font-['Noto_Sans_TC:Regular',sans-serif] font-normal">聯繫廠商</span>
        </p>
        <p>
          平台未來會持續協助在地居民彙整現場所需臨時站點、補助資訊、社福團體等，協助居民回到日常，敬請持續關注！
        </p>
      </div>
    </div>
  );
}

function SignName() {
  return (
    <div
      className="content-stretch flex flex-col gap-[8px] items-end justify-center relative shrink-0 w-full"
      data-name="signName"
    >
      <Image
        src={getAssetPath('/logomark.svg')}
        alt="Logo"
        width={60}
        height={40}
        className="shrink-0 w-[60px] h-auto"
      />
      <div className="font-['Noto_Sans_TC:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[var(--primary)] text-[16px] text-nowrap text-right whitespace-pre">
        <p className="mb-0">2025 10/30</p>
        <p>光復超人團隊</p>
      </div>
    </div>
  );
}

export default function PageClosedLetterCard() {
  return (
    <div
      className="bg-[var(--warning-background)] m-5 sm:mx-auto relative rounded-[12px] shadow-[0px_2px_10px_0px_rgba(0,0,0,0.1)] shrink-0 w-auto max-w-[600px]"
      data-name="Letter"
    >
      <div className="flex flex-col items-center justify-center size-full">
        <div className="box-border content-stretch flex flex-col gap-[20px] items-center justify-center px-[16px] py-[24px] relative w-full cursor-default">
          <DearName />
          <Paragraph />
          <SignName />
        </div>
      </div>
    </div>
  );
}
