import { Suspense } from 'react';
import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import { Stack } from '@mui/material';
import Link from 'next/link';
import './home.css';
import HomeFaqSection from './components/HomeFaqSection';
import HomeAnnouncementsSection from './components/HomeAnnouncementsSection';
import Image from 'next/image';
import { getAssetPath } from '@/lib/utils';
import ShareAction from '@/components/ShareAction';
import SearchCardLink from './components/SearchCardLink';

// 注意：此檔案僅作為首頁的組版與 SEO 設定來源，實際路由仍為 `src/app/page.tsx`
// 你可以在 `app/page.tsx` 中導入並重導出此檔案的 `generateMetadata` 與預設元件。

const SITE_URL = 'https://gf250923.org';
const LOGO_URL = 'https://gf250923.org/logo_new.svg';

// 與 `app/map/page.tsx` 對齊的 SEO metadata 產生器（供首頁使用）
/**
 * 產生首頁 SEO 中繼資料（與 /app/map/page.tsx 對齊）。
 * @returns {Metadata} Next.js Metadata 物件。
 */
export const generateMetadata = (): Metadata => {
  return {
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
};

// 首頁內容（非路由頁），可在 app/page.tsx 中引用此元件
/**
 * 首頁內容組件（非路由頁）。
 * 建議由 app/page.tsx 匯入並作為首頁的實際內容。
 * @returns {JSX.Element} 版面元素。
 */
export default function HomePage() {
  // 結構化資料（JSON-LD）：首頁版本
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: '光復超人',
        alternateName: ['鏟子超人', '光復英雄', '鏟子英雄', '光復超人', '光復志工'],
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: LOGO_URL,
          width: 1028,
          height: 301,
        },
        image: {
          '@type': 'ImageObject',
          url: LOGO_URL,
          width: 1028,
          height: 301,
        },
        slogan: '每一個人都是彼此的超人',
        description:
          '花蓮光復地震災區救援志工媒合平台，提供志工招募、物資分配、災民協助、即時災情地圖等服務',
        address: {
          '@type': 'PostalAddress',
          addressLocality: '光復鄉',
          addressRegion: '花蓮縣',
          addressCountry: 'TW',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: '光復超人',
        alternateName: '鏟子超人',
        description:
          '花蓮光復地震災區救援平台 - 即時災情地圖、志工媒合、物資分配、災民協助、臨時住宿、熱食供應',
        inLanguage: 'zh-TW',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: SITE_URL,
        name: '首頁',
        description: '光復超人首頁：即時災情地圖、志工媒合、物資分配、災民協助等服務的入口',
        inLanguage: 'zh-TW',
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: LOGO_URL,
        },
        dateModified: new Date().toISOString().split('T')[0],
        author: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
    ],
  };

  // 首頁功能卡片資料：以資料驅動渲染，方便維護
  const searchCards = [
    {
      href: '/victim/support-information',
      title: '補助貸款',
      subtitle: '補助及貸款方案資訊',
      Icon: () => {
        return (
          <svg
            width="68"
            height="72"
            viewBox="0 0 68 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_5966_71780)">
              <path
                d="M50.43 22.088C59.19 27.968 71 37.838 71 54.708C71 60.958 68.26 66.7281 62.84 71.148C57.42 75.568 48.66 75.678 41 75.678C33.34 75.678 25.18 75.568 19.76 71.148C14.35 66.7281 11 60.9481 11 54.708C11 37.838 22.8 27.968 31.57 22.088H50.43ZM41 35.778C39.97 35.778 39.14 36.608 39.14 37.638V39.1081H38.22C36.69 39.1081 35.23 39.7181 34.15 40.7881C33.07 41.8681 32.47 43.3281 32.47 44.8581C32.47 44.8581 32.47 44.8681 32.47 44.8781V45.1281C32.47 45.1281 32.47 45.1381 32.47 45.148C32.54 46.568 33.14 47.9181 34.15 48.9281C35.23 50.0081 36.69 50.6081 38.22 50.6081H39.14V54.668H34.33C33.3 54.668 32.47 55.4981 32.47 56.528C32.47 57.558 33.3 58.3881 34.33 58.3881H39.14V59.8581C39.14 60.8881 39.97 61.7181 41 61.7181C42.03 61.7181 42.86 60.8881 42.86 59.8581V58.3881H43.78C45.31 58.3881 46.77 57.778 47.85 56.708C48.93 55.628 49.53 54.168 49.53 52.6381C49.53 51.1081 48.92 49.6481 47.85 48.5681C46.77 47.488 45.31 46.8881 43.78 46.8881H42.86V42.828H46.55C47.58 42.828 48.41 41.9981 48.41 40.9681C48.41 39.9381 47.58 39.1081 46.55 39.1081H42.86V37.638C42.86 36.608 42.03 35.778 41 35.778ZM43.76 50.618H43.99C44.45 50.6781 44.88 50.878 45.21 51.208C45.59 51.5881 45.8 52.1081 45.8 52.6381C45.8 53.1781 45.59 53.688 45.21 54.0681C44.88 54.3981 44.45 54.598 43.99 54.648H43.76L42.86 54.6581V50.598H43.76V50.618ZM39.14 42.8381V46.898H38.22C37.68 46.898 37.17 46.688 36.79 46.308C36.46 45.978 36.26 45.548 36.21 45.0881V44.868C36.21 44.3381 36.41 43.8181 36.79 43.4481C37.17 43.0681 37.69 42.8581 38.22 42.8581H39.14V42.8381ZM39.71 6.99805C40.38 6.18805 41.62 6.18805 42.29 6.99805L45 10.308C45.56 10.998 46.56 11.118 47.28 10.598L50.19 8.46805C51.49 7.50805 53.26 8.78805 52.76 10.328L50.4 17.648H31.61L29.25 10.328C28.75 8.78805 30.52 7.51805 31.82 8.46805L34.73 10.598C35.44 11.118 36.44 10.998 37.01 10.308L39.72 6.99805H39.71Z"
                fill="#F37C0E"
                fillOpacity="0.35"
              />
            </g>
            <defs>
              <clipPath id="clip0_5966_71780">
                <rect width="68" height="72" fill="white" />
              </clipPath>
            </defs>
          </svg>
        );
      },
    },
    {
      href: '/victim/house-repair',
      title: '居家修繕',
      subtitle: '水電、門窗..等',
      Icon: () => {
        return (
          <svg
            width="68"
            height="72"
            viewBox="0 0 68 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_5966_71779)">
              <path
                d="M32.6245 25.4548C33.2353 26.0779 33.5774 26.9157 33.5774 27.7882C33.5774 28.6607 33.2353 29.4984 32.6245 30.1215L27.2912 35.4548C26.6681 36.0656 25.8303 36.4077 24.9578 36.4077C24.0853 36.4077 23.2476 36.0656 22.6245 35.4548L10.0578 22.8882C8.38172 26.5921 7.87422 30.719 8.60298 34.7187C9.33173 38.7184 11.2621 42.401 14.1369 45.2758C17.0117 48.1506 20.6943 50.081 24.694 50.8097C28.6937 51.5385 32.8205 51.031 36.5245 49.3548L59.5578 72.3882C60.8839 73.7143 62.6825 74.4592 64.5578 74.4592C66.4332 74.4592 68.2318 73.7143 69.5578 72.3882C70.8839 71.0621 71.6289 69.2635 71.6289 67.3882C71.6289 65.5128 70.8839 63.7143 69.5578 62.3882L46.5245 39.3548C48.2006 35.6509 48.7081 31.5241 47.9794 27.5244C47.2506 23.5247 45.3202 19.842 42.4454 16.9673C39.5707 14.0925 35.888 12.1621 31.8883 11.4333C27.8886 10.7046 23.7618 11.2121 20.0578 12.8882L32.6245 25.4548Z"
                fill="#F37C0E"
                fillOpacity="0.35"
              />
            </g>
            <defs>
              <clipPath id="clip0_5966_71779">
                <rect width="68" height="72" fill="white" transform="matrix(-1 0 0 1 68 0)" />
              </clipPath>
            </defs>
          </svg>
        );
      },
    },
    {
      href: '/victim/mental-health',
      title: '心理資源',
      subtitle: '諮商、陪伴',
      Icon: () => {
        return (
          <svg
            width="68"
            height="72"
            viewBox="0 0 68 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_5966_71778)">
              <path
                d="M22.8164 16.3447C24.4357 8.30068 31.4641 3.30492 41.1621 4.66895C48.5729 5.71143 53.8413 11.7663 54.9014 19.3008C55.5828 24.144 56.1749 29.4651 59.1992 33.4883C62.6286 38.0503 64.5226 39.6065 68.3809 43.8145C72.0611 47.8283 74.3895 57.1758 72.6826 62.3428C66.8233 80.0794 11.3929 79.842 8.44336 62.3428C6.73666 52.2166 7.64189 47.9582 14.5029 42.0166C18.0839 38.9048 19.3807 36.659 19.958 32.1621C20.5626 27.4533 22.0469 20.1676 22.8164 16.3447ZM50.5137 36.0654C48.7954 35.3852 47.3212 35.2614 45.5332 35.7109C43.7453 36.1605 41.7282 38.5431 40.5049 39.9629C40.4186 40.0581 40.314 40.1336 40.1982 40.1855C40.0822 40.2376 39.9566 40.2646 39.8301 40.2646C39.7035 40.2646 39.578 40.2376 39.4619 40.1855C39.3461 40.1336 39.2416 40.0581 39.1553 39.9629C37.928 38.5522 35.7304 36.1551 33.9453 35.7109C32.1604 35.2669 30.8716 35.415 29.1572 36.0938C27.4428 36.7725 25.9681 37.9726 24.9277 39.5352C23.8873 41.0979 23.3301 42.9501 23.3301 44.8467C23.3302 48.7664 25.8054 51.6633 28.2803 54.2197L37.3682 63.3076C37.68 63.6682 38.0625 63.9562 38.4902 64.1523C38.9182 64.3485 39.3824 64.4484 39.8506 64.4453C40.3186 64.4422 40.7807 64.3364 41.2061 64.1348C41.6315 63.933 42.0109 63.64 42.3184 63.2754L51.3799 54.2197C53.8548 51.6634 56.33 48.7493 56.3301 44.8467C56.3388 42.946 55.7871 41.0873 54.748 39.5186C53.709 37.9499 52.2318 36.7457 50.5137 36.0654ZM35.9424 18.8955C35.858 18.9017 35.7649 18.9205 35.6973 18.9639C35.5536 19.0508 35.5699 19.2061 35.5615 19.3428C35.4939 20.2934 35.9333 21.9465 36.415 22.1396C36.8967 22.3322 37.286 22.1646 37.5059 21.9473C37.9369 21.5186 37.819 20.5925 37.3965 19.8096C37.2697 19.5734 37.1084 19.3433 36.8633 19.1631H36.8721C36.627 18.9829 36.2804 18.8646 35.9424 18.8955ZM40.3877 18.8955C40.3033 18.9017 40.2102 18.9205 40.1426 18.9639C39.9989 19.0508 40.0153 19.2061 40.0068 19.3428C39.9392 20.2934 40.3786 21.9465 40.8604 22.1396C41.342 22.3322 41.7313 22.1646 41.9512 21.9473C42.3822 21.5186 42.2643 20.5925 41.8418 19.8096C41.715 19.5734 41.5538 19.3433 41.3086 19.1631H41.3174C41.0723 18.9829 40.7257 18.8646 40.3877 18.8955Z"
                fill="#F37C0E"
                fillOpacity="0.35"
              />
            </g>
            <defs>
              <clipPath id="clip0_5966_71778">
                <rect width="68" height="72" fill="white" />
              </clipPath>
            </defs>
          </svg>
        );
      },
    },
    {
      href: '/victim/site',
      title: '光復站點',
      subtitle: '維修站、廁所、醫療、洗澡..',
      Icon: () => {
        return (
          <svg
            width="68"
            height="72"
            viewBox="0 0 68 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_5966_71777)">
              <path
                d="M40.6094 1.10938C47.7702 1.10938 54.6377 4.14381 59.7012 9.54492C64.7646 14.946 67.6094 22.2718 67.6094 29.9102C67.6091 47.8851 48.9151 66.6051 42.6377 72.3867C42.0529 72.8558 41.341 73.1094 40.6094 73.1094C39.8777 73.1094 39.1658 72.8558 38.5811 72.3867C32.3036 66.6051 13.6097 47.8851 13.6094 29.9102C13.6094 22.2718 16.4541 14.946 21.5176 9.54492C26.5811 4.14381 33.4485 1.10938 40.6094 1.10938ZM40.6113 16.6641C34.4748 16.6641 29.5 21.6389 29.5 27.7754C29.5001 33.9118 34.4749 38.8867 40.6113 38.8867C46.7477 38.8866 51.7225 33.9117 51.7227 27.7754C51.7227 21.639 46.7477 16.6642 40.6113 16.6641Z"
                fill="#F37C0E"
                fillOpacity="0.35"
              />
            </g>
            <defs>
              <clipPath id="clip0_5966_71777">
                <rect width="68" height="72" fill="white" />
              </clipPath>
            </defs>
          </svg>
        );
      },
    },
  ];

  // FAQ 百葉窗資料（一次僅展開一個）

  const socialLinks = [
    { path: '/thread_logo.svg', alt: 'thread', href: 'https://www.threads.com/@gunangfu250927' },
    // {
    //   path: '/youtube_logo.svg',
    //   alt: 'youtube',
    //   href: 'https://www.youtube.com/@%E5%85%89%E5%BE%A9%E8%B6%85%E4%BA%BAGuangFuHero',
    // },
    { path: '/line_logo.svg', alt: 'line', href: 'line://ti/p/@hreco' },
    {
      path: '/instagram_logo.svg',
      alt: 'instagram',
      href: 'https://www.instagram.com/gunangfu250927/',
    },
    { path: '/fb_logo.svg', alt: 'fb', href: 'https://www.facebook.com/gunangfu250927' },
    { path: '/share.svg', alt: 'share', href: 'https://www.facebook.com/gunangfu250927' },
  ];

  return (
    <PageLayout
      footerSlot={
        <footer className="footerBox mt-12">
          <div>
            <Image
              src={getAssetPath('/logo_new.svg')}
              alt="Logo"
              width={120}
              height={40}
              className="h-10 w-auto cursor-pointer"
            />
          </div>

          <Stack direction="row" justifyContent="center" className="socialBtns">
            {socialLinks.map(({ path, alt, href }) =>
              alt === 'share' ? (
                <ShareAction key={alt}>
                  <button className="cursor-pointer" aria-label="分享">
                    <Image
                      src={getAssetPath(path)}
                      alt={alt}
                      width={28}
                      height={28}
                      className="transition-all duration-200 hover:[filter:invert(60%)_sepia(80%)_saturate(6000%)_hue-rotate(10deg)_brightness(100%)_contrast(95%)]"
                    />
                  </button>
                </ShareAction>
              ) : (
                <Link key={alt} href={href} target="_blank" rel="noopener noreferrer">
                  <Image
                    src={getAssetPath(path)}
                    alt={alt}
                    width={33}
                    height={32}
                    className="transition-all duration-200 hover:[filter:invert(60%)_sepia(80%)_saturate(6000%)_hue-rotate(10deg)_brightness(100%)_contrast(95%)]"
                  />
                </Link>
              )
            )}
          </Stack>

          <div className="footerLinks">
            <Link href="/privacy">隱私權政策</Link>
            <Link href="/terms">服務條款</Link>
          </div>
        </footer>
      }
    >
      {/* JSON-LD：提供搜尋引擎更豐富的結構化資訊 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 主要內容區：可逐步拆分為 sections/components */}
      <Suspense fallback={<div className="text-center py-8 text-[var(--gray)]">載入中...</div>}>
        <h3 className="text-center text-[16px] font-normal text-[var(--gray)]">
          提供居民需要的協助與資訊
        </h3>
        <h3 className="homeTitle pb-3">
          <div className="flex items-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.4544 7.25004C11.5829 8.49405 9.46587 11.568 7.59443 14.0638C5.72298 16.5597 3.03646 18.1504 2.02565 20.8554C-0.0624183 26.4431 2.51759 29.6993 10.3954 29.6993C13.2169 29.8136 17.8231 30.2928 20.6169 29.7264C28.7703 28.0735 31.6343 23.0481 30.3847 16.1071C30.2026 15.0958 29.9333 12.5904 29.396 11.2575C27.7758 7.2376 25.555 5.07252 21.7785 4.70332C18.5851 4.39111 15.3259 6.00603 13.4544 7.25004Z"
                fill="#F37C0E"
              />
              <path
                d="M24.3433 14.9364C24.5273 14.7561 24.7875 14.6379 25.0413 14.669C25.1048 14.6752 25.1746 14.6939 25.2253 14.7374C25.3332 14.8245 25.3205 14.98 25.3268 15.1168C25.3776 16.0683 25.0476 17.7226 24.686 17.9154C24.3243 18.1082 24.0324 17.9403 23.8674 17.7226C23.5438 17.2935 23.6326 16.3669 23.9499 15.5832C24.0451 15.3469 24.1656 15.1168 24.3496 14.9364H24.3433Z"
                fill="#3A3937"
              />
              <path
                d="M19.3394 14.9364C19.5234 14.7561 19.7836 14.6379 20.0374 14.669C20.1009 14.6752 20.1706 14.6939 20.2214 14.7374C20.3293 14.8245 20.3166 14.98 20.3229 15.1168C20.3737 16.0683 20.0437 17.7226 19.6821 17.9154C19.3204 18.1082 19.0285 17.9403 18.8635 17.7226C18.5399 17.2935 18.6287 16.3669 18.946 15.5832C19.0412 15.3469 19.1617 15.1168 19.3457 14.9364H19.3394Z"
                fill="#3A3937"
              />
            </svg>
            <p>我要找...</p>
          </div>
        </h3>
        <div className="searchBoxs grid grid-cols-2 gap-3">
          {searchCards.map(({ href, title, subtitle, Icon }) => (
            <SearchCardLink className="boxLink" key={title} href={href} gaLabel={title}>
              <h3>{title}</h3>
              <small>{subtitle}</small>
              <Icon />
            </SearchCardLink>
          ))}
        </div>

        {/* 常見問題 */}
        <HomeFaqSection />

        {/* 網站公告 */}
        <HomeAnnouncementsSection />

        <h3 className="homeTitle pb-3 pt-8">
          <div className="flex items-center gap-2">
            <p>其他</p>
          </div>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <SearchCardLink
            href="/volunteer/about-us"
            gaLabel="關於我們"
            className="boxLink col-span-1 text-center text-[16px]"
            style={{
              backgroundColor: 'rgba(23, 155, 198, 1)',
              color: 'white',
              lineHeight: '44px',
              borderRadius: '12px',
            }}
          >
            關於我們
          </SearchCardLink>
          <SearchCardLink
            href="https://docs.google.com/forms/d/e/1FAIpQLSeZ1v6jp7TtVXc2YVExpHKhVpqu4KubOLNj8147C8nUXm1PRQ/viewform?usp=dialog"
            gaLabel="聯絡我們"
            className="boxLink col-span-1 text-center text-[16px]"
            target="_blank"
            style={{
              backgroundColor: 'rgba(23, 155, 198, 1)',
              color: 'white',
              lineHeight: '44px',
              borderRadius: '12px',
            }}
          >
            聯絡我們
          </SearchCardLink>
          <SearchCardLink
            href="https://docs.google.com/forms/d/e/1FAIpQLSd5HQsSMoStkgiaC-q3bHRaLVVGNKdETWIgZVoYEsyzE486ew/viewform?usp=dialog"
            gaLabel="網站問題回報"
            className="boxLink col-span-2 text-center text-[16px]"
            target="_blank"
            style={{
              border: '1px solid rgba(58, 57, 55, 1)',
              lineHeight: '44px',
              borderRadius: '12px',
            }}
          >
            網站問題回報
          </SearchCardLink>
        </div>
      </Suspense>
    </PageLayout>
  );
}
