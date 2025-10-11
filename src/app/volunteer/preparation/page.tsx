import PageLayout from '@/components/PageLayout';
import VolunteerInfo from '@/features/VolunteerInfo';
import { Metadata } from 'next';
import { env } from '@/config/env';

export const generateMetadata = (): Metadata => {
  return {
    title: '志工資訊 - 行前必讀',
    description: '鏟子超人出發前記得檢查裝備清單，並做好安全準備、結伴同行。',
    openGraph: {
      title: '志工資訊 - 行前必讀',
      description: '鏟子超人出發前記得檢查裝備清單，並做好安全準備、結伴同行。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/volunteer/preparation`,
      type: 'website',
    },
  };
};

export default function VolunteerPreparationPage() {
  return (
    <PageLayout>
      <VolunteerInfo initialCategory="行前必讀" />
    </PageLayout>
  );
}
