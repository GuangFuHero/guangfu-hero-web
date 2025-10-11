import PageLayout from '@/components/PageLayout';
import VictimAssistance from '@/features/VictimAssistance';
import { Metadata } from 'next';
import { env } from '@/config/env';

export const generateMetadata = (): Metadata => {
  return {
    title: '居民協助 - 心理資源',
    description: '彙整花蓮光復周邊心理資源與支援資訊，協助民眾就近尋求心理健康支援。',
    openGraph: {
      title: '居民協助 - 心理資源',
      description: '彙整花蓮光復周邊心理資源與支援資訊，協助民眾就近尋求心理健康支援。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/victim/mental-health`,
      type: 'website',
    },
  };
};

export default function VictimMentalHealthPage() {
  return (
    <PageLayout>
      <VictimAssistance initialCategory="心理資源" />
    </PageLayout>
  );
}
