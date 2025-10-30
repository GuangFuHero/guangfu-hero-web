import Wrapper from '@/features/Wrapper';
import PageClosedLetterCard from '@/components/PageClosedLetterCard';
import { Metadata } from 'next';
import { env } from '@/config/env';

export const generateMetadata = (): Metadata => {
  return {
    title: '配送媒合',
    description: '登記在地需求並由小蜜蜂配送協助，僅提供當地居民支援與在地配送媒合。',
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: '配送媒合',
      description: '登記在地需求並由小蜜蜂配送協助，僅提供當地居民支援與在地配送媒合。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/resources`,
      type: 'website',
    },
  };
};

export default function ResourcesPage() {
  return (
    <Wrapper hideFooter>
      {/** Turn these pages offline as the requirements are getting less **/}
      {/* <iframe
        src="https://pinkowo.github.io/hualien-bees/"
        className="w-full border-0"
        title="配送媒合"
        allow="geolocation"
        style={{ height: 'calc(100vh - 160px)' }} // header 4 rem + footer 140 px
      /> */}
      <PageClosedLetterCard />
    </Wrapper>
  );
}
