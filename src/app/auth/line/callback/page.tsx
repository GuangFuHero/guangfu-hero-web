import { Suspense } from 'react';
import LineLocalCallback from '@/features/LineLogin';

export default function MapPage() {
  return (
    <Suspense fallback={<div className="text-center py-8 text-[var(--gray)]">載入中...</div>}>
      <LineLocalCallback />
    </Suspense>
  );
}
