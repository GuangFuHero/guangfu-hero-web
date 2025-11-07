import Banner from '@/features/Banner';
import Header from '@/features/Header';
import clsx from 'clsx';
import React from 'react';

interface WrapperProps {
  hideBanner?: boolean;
  hideFooter?: boolean;
  hideShare?: boolean;
  /** 關閉 main 的滾動，適用會內嵌 iframe 的頁面，避免雙/三重捲軸 */
  noMainScroll?: boolean;
  children: React.ReactNode;
}

const Wrapper = ({
  hideBanner = false,
  hideFooter = false,
  hideShare = false,
  noMainScroll = false,
  children,
}: WrapperProps) => {
  return (
    // 若關閉 main 滾動，外層一併隱藏滾動避免多層滾；使用 dvh 更準確
    <div className={clsx('min-h-dvh flex flex-col', noMainScroll && 'overflow-hidden')}>
      {!hideBanner && <Banner />}
      <Header hideShare={hideShare} />

      <main
        className={clsx(
          'flex-1 min-h-0',
          noMainScroll ? 'overflow-hidden' : 'overflow-y-auto scrollbar-none'
        )}
      >
        {children}
      </main>

      {/* {!hideFooter && <Footer />} */}
    </div>
  );
};

export default Wrapper;
