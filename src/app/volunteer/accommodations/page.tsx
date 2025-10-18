import PageLayout from '@/components/PageLayout';
import VolunteerInfo from '@/features/VolunteerInfo';

export default function VolunteerAccommodationsPage() {
  return (
    <PageLayout>
      <VolunteerInfo initialCategory="住宿資訊" />
    </PageLayout>
  );
}
