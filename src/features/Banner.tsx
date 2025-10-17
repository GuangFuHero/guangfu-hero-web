'use client';
import { useState } from 'react';
import AlertBanner from '@/components/AlertBanner';
import WarningModal from '@/components/WarningModal';

const Banner = () => {
  const [showWarningModal, setShowWarningModal] = useState(false);

  const handleAlertClick = () => {
    setShowWarningModal(true);
  };

  const handleClose = () => {
    setShowWarningModal(false);
  };

  return (
    <>
      <AlertBanner onAlertClick={handleAlertClick} />
      <WarningModal isOpen={showWarningModal} onClose={handleClose} />
    </>
  );
};

export default Banner;
