import { ModalProvider } from '@/providers/ModalProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { TabProvider } from '@/providers/TabProvider';
import { ToastProvider } from '@/providers/ToastProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <TabProvider>
        <ModalProvider>
          <ToastProvider>{children}</ToastProvider>
        </ModalProvider>
      </TabProvider>
    </QueryProvider>
  );
}
