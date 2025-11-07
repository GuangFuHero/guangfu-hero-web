import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HomePage from '@/app/_home/page';

const SITE_URL = 'https://gf250923.org';
const LOGO_URL = 'https://gf250923.org/logo_new.svg';

export const metadata: Metadata = {
  title: '每一個人都是彼此的超人',
  description:
    '花蓮光復地震災區即時救援地圖 - 光復超人（鏟子超人、光復英雄）提供志工路線、志工報名、物資分配、補水站、洗澡點、醫療站、臨時住宿等完整救災資訊。災民需求即時配對，熱食供應，光復小蜜蜂接駁服務。',
  keywords:
    '光復超人,鏟子超人,光復英雄,鏟子英雄,光復救災,光復志工,志工路線,志工報名,報名志工,救災地圖,光復地圖,花蓮光復,災區救援,物資分配,花蓮地震,災民需求,臨時住宿,熱食供應,光復小蜜蜂,花蓮小蜜蜂',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: '光復超人 | 花蓮光復地震災區救援地圖',
    description:
      '即時災情地圖、志工媒合、物資分配、災民協助 - 光復超人（鏟子超人）讓每一個人都是彼此的超人',
    url: SITE_URL,
    type: 'website',
    images: [
      {
        url: LOGO_URL,
        width: 1028,
        height: 301,
        alt: '光復超人 Logo - 花蓮光復地震災區救援平台',
      },
    ],
    siteName: '光復超人',
    locale: 'zh_TW',
  },
  twitter: {
    card: 'summary_large_image',
    title: '光復超人 | 花蓮光復地震災區救援地圖',
    description:
      '即時災情地圖、志工媒合、物資分配、災民協助 - 光復超人（鏟子超人）讓每一個人都是彼此的超人',
    images: [LOGO_URL],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function Home() {
  // redirect('/map');
  return <HomePage />;
}
