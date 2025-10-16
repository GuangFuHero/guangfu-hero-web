import { ModalProvider } from '@/providers/ModalProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { TabProvider } from '@/providers/TabProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '地點總覽',
  description: '光復鄉救災設施地圖，包含住宿點、加水站、廁所、洗澡點、醫療站等資訊',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="overflow-hidden h-[100svh] w-[100svw]">
      <QueryProvider>
        <TabProvider>
          <ModalProvider>
            <ToastProvider>{children}</ToastProvider>
          </ModalProvider>
        </TabProvider>
      </QueryProvider>
    </div>
  );
}
