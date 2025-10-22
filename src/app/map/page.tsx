import { Suspense } from 'react';
import { Metadata } from 'next';
import PageLayout from '@/components/PageLayout';
import SiteMap from '@/features/SiteMap';

const SITE_URL = 'https://gf250923.org';
const LOGO_URL = 'https://gf250923.org/logo_new.svg';

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

export default function MapPage() {
  // JSON-LD
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
        foundingDate: '2025-09-23',
        address: {
          '@type': 'PostalAddress',
          addressLocality: '光復鄉',
          addressRegion: '花蓮縣',
          addressCountry: 'TW',
        },
        location: {
          '@type': 'Place',
          name: '花蓮縣光復鄉',
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 23.665853,
            longitude: 121.421125,
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: '光復鄉',
            addressRegion: '花蓮縣',
            addressCountry: 'TW',
          },
        },
        areaServed: [
          {
            '@type': 'Place',
            name: '花蓮縣光復鄉',
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 23.665853,
              longitude: 121.421125,
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: '光復鄉',
              addressRegion: '花蓮縣',
              addressCountry: 'TW',
            },
          },
          {
            '@type': 'Place',
            name: '花蓮縣',
            address: {
              '@type': 'PostalAddress',
              addressRegion: '花蓮縣',
              addressCountry: 'TW',
            },
          },
        ],
        sameAs: [
          'https://www.threads.com/@gunangfu250927',
          'https://www.facebook.com/gunangfu250927',
          'https://www.youtube.com/channel/UC1jIUA-kbGq-Dh1s3QBC6ow',
        ],
        knowsAbout: [
          '災區救援',
          '志工媒合',
          '志工招募',
          '物資分配',
          '災民協助',
          '地震救災',
          '緊急救援',
          '災情地圖',
        ],
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
        about: {
          '@type': 'Event',
          name: '花蓮光復地震災區救援行動',
          description: '2025年9月23日花蓮光復地震災區持續性救援與重建',
          startDate: '2025-09-23',
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: '花蓮縣光復鄉',
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 23.665853,
              longitude: 121.421125,
            },
            address: {
              '@type': 'PostalAddress',
              addressLocality: '光復鄉',
              addressRegion: '花蓮縣',
              addressCountry: 'TW',
            },
          },
          organizer: {
            '@id': `${SITE_URL}/#organization`,
          },
          performer: {
            '@type': 'Organization',
            name: '光復超人 - 遠端志工群',
          },
          offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            price: '0',
            priceCurrency: 'TWD',
            description: '免費提供災區救援服務',
          },
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/map#webpage`,
        url: `${SITE_URL}/map`,
        name: '災區救援地圖',
        description:
          '花蓮光復地震災區即時救援資源地圖，包含志工路線、物資站、補水站、洗澡點、醫療站、臨時住宿等資訊',
        inLanguage: 'zh-TW',
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: LOGO_URL,
        },
        about: [
          {
            '@type': 'Place',
            name: '花蓮縣光復鄉',
            description: '2025年0923地震災區',
            geo: {
              '@type': 'GeoCoordinates',
              latitude: 23.665853,
              longitude: 121.421125,
            },
          },
          {
            '@type': 'Thing',
            name: '災區救援資源',
            description: '物資發放站、補水站、洗澡點、醫療站、臨時住宿、志工路線',
          },
        ],
        datePublished: '2025-09-23',
        dateModified: new Date().toISOString().split('T')[0],
        author: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
      {
        '@type': 'Map',
        '@id': `${SITE_URL}/map#map`,
        name: '光復災區救援資源地圖',
        description:
          '即時顯示花蓮光復地震災區救援資源位置，包含物資站、補水站、洗澡點、醫療站、臨時住宿、志工路線等超過百個標記點',
        mapType: 'VenueMap',
        url: `${SITE_URL}/map`,
        inLanguage: 'zh-TW',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 23.665853,
          longitude: 121.421125,
        },
        spatialCoverage: {
          '@type': 'Place',
          name: '花蓮縣光復鄉',
          geo: {
            '@type': 'GeoShape',
            box: '23.7 121.4 23.6 121.5',
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: '光復鄉',
            addressRegion: '花蓮縣',
            addressCountry: 'TW',
          },
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/map#itemlist`,
        name: '災區救援資源類型',
        description: '光復災區地圖上標記的救援資源類型',
        numberOfItems: 6,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@type': 'Place',
              name: '物資發放站',
              description: '提供災區物資分配與發放服務',
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@type': 'Place',
              name: '補水站',
              description: '提供志工與災民飲用水補給',
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@type': 'Place',
              name: '洗澡點',
              description: '提供志工盥洗服務',
            },
          },
          {
            '@type': 'ListItem',
            position: 4,
            item: {
              '@type': 'Place',
              name: '醫療站',
              description: '提供醫療救護與健康諮詢服務',
            },
          },
          {
            '@type': 'ListItem',
            position: 5,
            item: {
              '@type': 'Place',
              name: '臨時住宿',
              description: '提供志工與災民臨時住宿空間',
            },
          },
          {
            '@type': 'ListItem',
            position: 6,
            item: {
              '@type': 'Thing',
              name: '志工路線',
              description: '推薦志工前往災區的路線規劃',
            },
          },
        ],
      },
    ],
  };

  return (
    <PageLayout>
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Suspense fallback={<div className="text-center py-8 text-[var(--gray)]">載入中...</div>}>
        <SiteMap />
      </Suspense>
    </PageLayout>
  );
}
