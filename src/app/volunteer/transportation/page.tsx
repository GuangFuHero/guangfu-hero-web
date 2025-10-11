import PageLayout from '@/components/PageLayout';
import VolunteerInfo from '@/features/VolunteerInfo';
import { Metadata } from 'next';
import { env } from '@/config/env';

export const generateMetadata = (): Metadata => {
  return {
    title: '志工資訊 - 交通資訊',
    description: '小蜜蜂接駁媒合、公共運輸資訊，加入志工 LINE 社群瞭解更多。',
    openGraph: {
      title: '志工資訊 - 交通資訊',
      description: '小蜜蜂接駁媒合、公共運輸資訊，加入志工 LINE 社群瞭解更多。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/volunteer/transportation`,
      type: 'website',
    },
  };
};

export default function VolunteerTransportationPage() {
  return (
    <PageLayout>
      <VolunteerInfo initialCategory="交通資訊" />
    </PageLayout>
  );
}
