import PageLayout from '@/components/PageLayout';
import VictimAssistance from '@/features/VictimAssistance';
import { Metadata } from 'next';
import { env } from '@/config/env';

export const generateMetadata = (): Metadata => {
  return {
    title: '居民協助 - 醫療站',
    description: '匯集花蓮光復災區急需醫療資源與服務資訊，整合協助通路與醫療團隊資源支援。',
    openGraph: {
      title: '居民協助 - 醫療站',
      description: '匯集花蓮光復災區急需醫療資源與服務資訊，整合協助通路與醫療團隊資源支援。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/victim/medical`,
      type: 'website',
    },
  };
};

export default function VictimMedicalPage() {
  return (
    <PageLayout>
      <VictimAssistance initialCategory="醫療站" />
    </PageLayout>
  );
}
