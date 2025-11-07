import { ModalProvider } from '@/providers/ModalProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { TabProvider } from '@/providers/TabProvider';
import { ToastProvider } from '@/providers/ToastProvider';

// 注意：此目錄以底線 `_` 開頭，Next.js 檔案式路由會忽略此目錄。
// 目的：提供首頁可重用的 Provider 組合，供首頁相關元件包裹使用，不直接參與路由。
/**
 * 首頁專用 Provider 佈局（不參與路由）。
 * 以與 /app/map/layout.tsx 相同的 Provider 組合封裝首頁子元素，
 * 讓首頁區塊在私有目錄 `_home` 下即可取得一致的全域狀態與通知能力。
 *
 * @param {object} params - 參數物件。
 * @param {React.ReactNode} params.children - 子節點內容。
 * @returns {JSX.Element} 回傳包含 Provider 包裹的內容區塊。
 */
export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 將首頁所需的全域狀態/通知等 Provider 於此集中管理
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
