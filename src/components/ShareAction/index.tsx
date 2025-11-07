'use client';

import { usePathname } from 'next/navigation';
import { cloneElement, isValidElement, useCallback, useMemo, useState } from 'react';
import type { ReactElement, MouseEvent } from 'react';
import Toast2 from '@/components/Toast2';

export type ShareActionProps = {
  getTitle?: (pathname: string) => string;
  children?: ReactElement<{ onClick?: (e: MouseEvent<HTMLElement>) => void }>;
  duration?: number;
  shareId?: string;
};

/**
 * 分享動作共用組件。
 *
 * - 優先使用 Web Share API；若不支援或非使用者取消則退回複製連結。
 * - 複製成功後顯示 Toast2。
 * - 以 children 作為觸發元素，會自動注入 onClick。
 *
 * @param {Object} props - 組件參數。
 * @param {(pathname: string) => string} [props.getTitle] - 依路徑動態產生分享標題的函數，未提供時有預設行為。
 * @param {ReactElement} [props.children] - 觸發分享的自訂子元素；未提供時將渲染預設按鈕。
 * @param {number} [props.duration=3000] - Toast 顯示時間（毫秒）。
 * @returns {JSX.Element} 可互動的分享按鈕與 Toast。
 */
export default function ShareAction({
  getTitle,
  children,
  duration = 3000,
  shareId,
}: ShareActionProps) {
  const pathname = usePathname();
  const [showToast, setShowToast] = useState(false);

  const resolvedTitle = useMemo(() => {
    const defaultGetTitle = (p: string) => {
      if (p.startsWith('/map')) return '光復超人 - 現場地圖';
      if (p.startsWith('/volunteer')) return '光復超人 - 志工資訊';
      if (p.startsWith('/victim')) return '光復超人 - 居民協助';
      return '光復超人';
    };
    return (getTitle || defaultGetTitle)(pathname || '/');
  }, [getTitle, pathname]);

  const fallbackToCopy = useCallback(async (url: string) => {
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
      console.warn('Clipboard API 不可用 - 需要 HTTPS 或 localhost 環境');
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setShowToast(true);
    } catch (error) {
      console.error('複製失敗:', error);
    }
  }, []);

  const handleShare = useCallback(
    async (shareId?: string) => {
      if (typeof window === 'undefined') return;
      const baseUrl = window.location.origin;
      const shareUrl = shareId
        ? `${baseUrl}${pathname}#${shareId}` // ✅ 加上 #id
        : `${baseUrl}${pathname || '/'}`;

      if (navigator.share) {
        try {
          await navigator.share({ title: resolvedTitle, url: shareUrl });
        } catch (error: unknown) {
          if (!(error instanceof Error && error.name === 'AbortError')) {
            await fallbackToCopy(shareUrl);
          }
        }
      } else {
        await fallbackToCopy(shareUrl);
      }
    },
    [fallbackToCopy, pathname, resolvedTitle]
  );

  const trigger = isValidElement(children) ? (
    cloneElement(children as ReactElement<{ onClick?: (e: MouseEvent<HTMLElement>) => void }>, {
      onClick: async (e: MouseEvent<HTMLElement>) => {
        const original = (
          children as ReactElement<{ onClick?: (e: MouseEvent<HTMLElement>) => void }>
        ).props.onClick;
        if (typeof original === 'function') {
          await original(e);
        }
        await handleShare(shareId);
      },
    })
  ) : (
    <button onClick={() => handleShare()} aria-label="分享">
      分享
    </button>
  );

  return (
    <>
      {trigger}
      <Toast2 isVisible={showToast} onClose={() => setShowToast(false)} duration={duration} />
    </>
  );
}
