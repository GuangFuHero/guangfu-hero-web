import { Metadata } from 'next';
import Wrapper from '@/features/Wrapper';
// import MainContent from '@/features/VolunteerRegister/MainContent';
import PageClosedLetterCard from '@/components/PageClosedLetterCard';

const SITE_URL = 'https://gf250923.org';
const LOGO_URL = 'https://gf250923.org/logo_new.svg';

export const generateMetadata = (): Metadata => {
  return {
    title: '志工媒合',
    description:
      '成為救災超人、瀏覽任務媒合與報到資訊，與在地需求即時配對，安全有序投入協助。花蓮光復鄉地震災區志工招募、物資分配、災民協助平台。',
    keywords:
      '花蓮光復,光復超人,鏟子超人,花蓮地震,災區志工,救援志工,志工報名,光復小蜜蜂,花蓮小蜜蜂',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: '志工媒合 | 光復超人',
      description: '成為救災超人、瀏覽任務媒合與報到資訊，與在地需求即時配對，安全有序投入協助。',
      url: `${SITE_URL}/volunteer-register`,
      type: 'website',
      images: [
        {
          url: LOGO_URL,
          width: 1028,
          height: 301,
          alt: '光復超人 Logo',
        },
      ],
      siteName: '光復超人',
    },
    twitter: {
      card: 'summary_large_image',
      title: '志工媒合 | 光復超人',
      description: '成為救災超人、瀏覽任務媒合與報到資訊，與在地需求即時配對，安全有序投入協助。',
      images: [LOGO_URL],
    },
  };
};

export default function VolunteerRegisterPage() {
  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: '光復超人',
        alternateName: ['鏟子超人', '光復志工', '光復救災', '鏟子英雄', '光復英雄'],
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          url: LOGO_URL,
          width: 1028,
          height: 301,
        },
        description: '花蓮光復地震災區救援志工媒合平台，提供志工招募、物資分配、災民協助等服務',
        foundingDate: '2025-09-25',
        areaServed: {
          '@type': 'Place',
          name: '花蓮縣光復鄉',
          address: {
            '@type': 'PostalAddress',
            addressLocality: '光復鄉',
            addressRegion: '花蓮縣',
            addressCountry: 'TW',
          },
        },
        sameAs: [
          'https://www.threads.com/@gunangfu250927',
          'https://www.facebook.com/gunangfu250927',
          'https://www.youtube.com/channel/UC1jIUA-kbGq-Dh1s3QBC6ow',
        ],
        knowsAbout: ['災區救援', '志工媒合', '物資分配', '災民協助', '地震救災'],
      },
      // WebPage - 志工媒合頁面
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/volunteer-register#webpage`,
        url: `${SITE_URL}/volunteer-register`,
        name: '志工媒合',
        description: '成為救災超人、瀏覽任務媒合與報到資訊，與在地需求即時配對，安全有序投入協助',
        inLanguage: 'zh-TW',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: SITE_URL,
          name: '光復超人',
          publisher: {
            '@id': `${SITE_URL}/#organization`,
          },
        },
        about: {
          '@type': 'Thing',
          name: '災區志工招募',
          description: '花蓮光復地震災區志工媒合與任務配對服務',
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: LOGO_URL,
        },
        datePublished: '2025-09-23',
        dateModified: new Date().toISOString().split('T')[0],
        author: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
      // BreadcrumbList
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/volunteer-register#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '首頁',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '志工媒合',
            item: `${SITE_URL}/volunteer-register`,
          },
        ],
      },
      // WebSite - 網站整體資訊
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: '光復超人',
        description: '花蓮光復地震災區救援平台 - 志工媒合、物資分配、居民協助',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        inLanguage: 'zh-TW',
      },
    ],
  };

  return (
    <Wrapper hideFooter>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/** Turn these pages offline as the requirements are getting less **/}
      {/* <MainContent /> */}
      <PageClosedLetterCard />
    </Wrapper>
  );
}
