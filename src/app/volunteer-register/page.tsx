import { Metadata } from 'next';
import Wrapper from '@/features/Wrapper';
import { env } from '@/config/env';

export const generateMetadata = (): Metadata => {
  return {
    title: '志工媒合',
    description: '成為救災超人、瀏覽任務媒合與報到資訊，與在地需求即時配對，安全有序投入協助。',
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: '志工媒合',
      description: '成為救災超人、瀏覽任務媒合與報到資訊，與在地需求即時配對，安全有序投入協助。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/volunteer-register`,
      type: 'website',
    },
  };
};

export default function VolunteerRegisterPage() {
  return (
    <Wrapper hideFooter>
      {/* 警示條 */}
      <div className="w-full bg-amber-100/90 border-b border-amber-300">
        <div className="mx-auto max-w-6xl px-4 py-3 text-amber-900 text-sm md:text-base">
          <span className="mr-2">⚠️</span>
          志工媒合前請先
          <strong className="mx-1 text-red-600">電話確認</strong>
          並
          <strong className="mx-1 text-red-600">截圖資訊</strong>
          ；確認無誤再進行媒合。
          <span className="ml-2 font-semibold text-red-600">— 請先截圖電聯資訊再媒合！</span>
        </div>
      </div>


      {/* 原本 iframe */}
      <iframe
        src="https://hualien-volunteers-frontend-iota.vercel.app/"
        className="w-full border-0"
        title="志工媒合"
        allow="geolocation"
        style={{ height: 'calc(100vh - 160px)' }}
      />
    </Wrapper>
  );
}
