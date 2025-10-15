import { ModalProvider } from '@/providers/ModalProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import dynamic from 'next/dynamic';

const Modals = dynamic(() => import('@/features/MapContainer/Modals'));

const ToastContainer = dynamic(() => import('@/features/MapContainer/ToastContainer'));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <ModalProvider>
        <ToastProvider>
          {children}
          <ToastContainer />
          <Modals />
        </ToastProvider>
      </ModalProvider>
    </QueryProvider>
  );
}
