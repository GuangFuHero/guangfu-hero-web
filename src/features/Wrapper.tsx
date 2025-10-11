import React from 'react';
import Header from '@/features/Header';
import Footer from '@/features/Footer';
import Banner from '@/features/Banner';
import clsx from 'clsx';

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
      
      <Header hideShare={hideShare} />

      <main
        className={clsx(
          'flex-1 min-h-0',
          noMainScroll ? 'overflow-hidden' : 'overflow-y-auto scrollbar-none',
          'mt-[65px]',
          !hideFooter && 'mb-[85px]',
        )}
      >
        {!hideBanner && <Banner />}
        {children}
      </main>


      {!hideFooter && <Footer />}
    </div>
  );
};

export default Wrapper;
