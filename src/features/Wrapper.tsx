import React from 'react';
import Header from '@/features/Header';
import Footer from '@/features/Footer';
import Banner from '@/features/Banner';

interface WrapperProps {
  hideBanner?: boolean;
  hideFooter?: boolean;
  hideShare?: boolean;
  children: React.ReactNode;
}

const Wrapper = ({
  hideBanner = false,
  hideFooter = false,
  hideShare = false,
  children,
}: WrapperProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header hideShare={hideShare} />
      <main
        className={`flex-1 mt-[65px] mb-[85px] overflow-y-auto ${
          hideFooter ? 'max-h-screen-minus-header' : 'max-h-screen-minus-header-footer'
        }`}
      >
        {!hideBanner && <Banner />}
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Wrapper;
