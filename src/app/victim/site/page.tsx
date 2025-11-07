import PageLayout from '@/components/PageLayout';
import VictimAssistance from '@/features/VictimAssistance';
import { Metadata } from 'next';
import { env } from '@/config/env';

export const generateMetadata = (): Metadata => {
  return {
    title: '居民協助 - 光復站點',
    description: '彙整站點，協助民眾可以獲得更多援助。',
    openGraph: {
      title: '居民協助 - 光復站點',
      description: '彙整站點，協助民眾可以獲得更多援助。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/victim/site`,
      type: 'website',
    },
  };
};

export default function VictimSitePage() {
  return (
    <PageLayout>
      <VictimAssistance initialCategory="光復站點" />
    </PageLayout>
  );
}
