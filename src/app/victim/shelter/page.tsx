import PageLayout from '@/components/PageLayout';
import VictimAssistance from '@/features/VictimAssistance';
import { Metadata } from 'next';
import { env } from '@/config/env';

export const generateMetadata = (): Metadata => {
  return {
    title: '居民協助 - 庇護所',
    description: '彙整花蓮光復周邊安心站與收容點位置、聯絡方式與開放資訊，協助民眾就近尋求支援。',
    openGraph: {
      title: '居民協助 - 庇護所',
      description: '彙整花蓮光復周邊安心站與收容點位置、聯絡方式與開放資訊，協助民眾就近尋求支援。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/victim/shelter`,
      type: 'website',
    },
  };
};

export default function VictimShelterPage() {
  return (
    <PageLayout>
      <VictimAssistance initialCategory="庇護所" />
    </PageLayout>
  );
}
