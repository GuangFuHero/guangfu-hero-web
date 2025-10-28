import ToastContainer from '@/features/MapContainer/ToastContainer';
import ResourcesComponent from '@/features/Resources/ResourcesComponent';
import { generateResourcesMetadata } from '@/features/Resources/metadata';
import Wrapper from '@/features/Wrapper';
import { QueryProvider } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import { Metadata } from 'next';

export const generateMetadata = (): Metadata => generateResourcesMetadata();

export default function ResourcesPage() {
  return (
    <Wrapper hideFooter>
      <QueryProvider>
        <ToastProvider>
          <ResourcesComponent />
          <ToastContainer />
        </ToastProvider>
      </QueryProvider>
    </Wrapper>
  );
}
