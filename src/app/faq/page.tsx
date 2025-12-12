import Wrapper from '@/features/Wrapper';
import { Metadata } from 'next';
import { env } from '@/config/env';
import HomeFaqSection from '@/app/_home/components/HomeFaqSection';

export const generateMetadata = (): Metadata => {
  return {
    title: '常見問題',
    description: '整理常見問題與解答，協助居民快速找到需要的資訊與指引。',
    openGraph: {
      title: '常見問題',
      description: '整理常見問題與解答，協助居民快速找到需要的資訊與指引。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/faq`,
      type: 'website',
    },
  };
};

export default function FaqPage() {
  return (
    <Wrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HomeFaqSection moreLinkHref="/" />
      </div>
    </Wrapper>
  );
}
