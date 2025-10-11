'use client';
import { useState } from 'react';
import AlertBanner from '@/components/AlertBanner';
import WarningModal from '@/components/WarningModal';

const Banner = () => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  return (
    <>
      <AlertBanner onAlertClick={() => setShowWarningModal(true)} />
      <WarningModal isOpen={showWarningModal} onClose={() => setShowWarningModal(false)} />
    </>
  );
};

export default Banner;
