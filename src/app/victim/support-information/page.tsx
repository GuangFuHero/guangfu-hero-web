import PageLayout from '@/components/PageLayout';
import VictimAssistance from '@/features/VictimAssistance';
import { Metadata } from 'next';
import { env } from '@/config/env';

export const generateMetadata = (): Metadata => {
  return {
    title: '居民協助 - 輔助資訊',
    description: '彙整花蓮縣政府提供之輔助資訊，協助民眾可以獲得更多援助。',
    openGraph: {
      title: '居民協助 - 輔助資訊',
      description: '彙整花蓮縣政府提供之輔助資訊，協助民眾可以獲得更多援助。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/victim/support-information`,
      type: 'website',
    },
  };
};

export default function VictimSupportInformationPage() {
  return (
    <PageLayout>
      <VictimAssistance initialCategory="補助資訊" />
    </PageLayout>
  );
}
