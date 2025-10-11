import { Suspense } from 'react';
import PageLayout from '@/components/PageLayout';
import SiteMap from '@/features/SiteMap';

export default function MapPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="text-center py-8 text-[var(--gray)]">載入中...</div>}>
        <SiteMap />
      </Suspense>
    </PageLayout>
  );
}
