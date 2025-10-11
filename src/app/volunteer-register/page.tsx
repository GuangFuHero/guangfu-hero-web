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
