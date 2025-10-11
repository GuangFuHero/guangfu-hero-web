'use client';

import { UserPosition } from '@/types/map';
import ConfirmModal from './ConfirmModal';
import HelpRequestModal from './HelpRequestModal';
import ReportIssueModal from './ReportIssueModal';

interface ModalsProps {
  userPosition: UserPosition | null;
}

export default function Modals({ userPosition }: ModalsProps) {
  return (
    <>
      <ConfirmModal />
      <HelpRequestModal userPosition={userPosition} />
      <ReportIssueModal />
    </>
  );
}
