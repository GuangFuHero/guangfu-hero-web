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
  return children;
}
