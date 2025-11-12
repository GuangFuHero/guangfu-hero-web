import PageLayout from '@/components/PageLayout';
import VictimAssistance from '@/features/VictimAssistance';
import { Metadata } from 'next';
import { env } from '@/config/env';

export const generateMetadata = (): Metadata => {
  return {
    title: '居民協助 - 居家修繕',
    description: '彙整花蓮縣政府提供之居家修繕廠商的聯絡方式，協助民眾可以更快重建家園。',
    openGraph: {
      title: '居民協助 - 居家修繕',
      description: '彙整花蓮縣政府提供之居家修繕廠商的聯絡方式，協助民眾可以更快重建家園。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/victim/house-repair`,
      type: 'website',
    },
  };
};

export default function VictimHouseRepairPage() {
  return (
    <PageLayout>
      <VictimAssistance initialCategory="居家修繕" />
    </PageLayout>
  );
}
