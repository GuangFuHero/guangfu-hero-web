'use client';
import { Place } from '@/lib/types/place';
import { createContext, ReactNode, useContext, useRef, useState } from 'react';

type ModalType = 'report' | 'detail' | 'confirm' | null;

interface ModalData {
  report: {
    category: string;
    id: string;
    name: string;
  };
  detail: {
    type?: string;
    name: string;
    fullData: Place;
  };
  confirm: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  };
}

interface ModalContextType {
  // Current modal state
  currentModal: ModalType;
  modalData: Partial<ModalData>;

  // Modal controls
  openReportModal: (category: string, id: string, name: string) => void;
  openDetailModal: (type: string | undefined, name: string, fullData: Place) => void;
  openConfirmModal: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
  closeModal: () => void;

  closeReportModalAndReturn: () => void;

  isReportModalOpen: boolean;
  isDetailModalOpen: boolean;
  isConfirmModalOpen: boolean;
  reportData: ModalData['report'] | null;
  detailData: ModalData['detail'] | null;
  confirmData: ModalData['confirm'] | null;

  showConfirm: (title: string, message: string) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [modalData, setModalData] = useState<Partial<ModalData>>({});
  const previousModalData = useRef<Partial<ModalData> | null>(null);
  const [confirmResolver, setConfirmResolver] = useState<((result: boolean) => void) | null>(null);

  const openReportModal = (category: string, id: string, name: string) => {
    if (currentModal === 'detail') {
      previousModalData.current = modalData;
    }
    setModalData({ report: { category, id, name } });
    setCurrentModal('report');
  };

  const openDetailModal = (type: string | undefined, name: string, fullData: Place) => {
    setModalData({ detail: { type, name, fullData } });
    setCurrentModal('detail');
  };

  const openConfirmModal = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    setModalData({ confirm: { title, message, onConfirm, onCancel } });
    setCurrentModal('confirm');
  };

  const closeModal = () => {
    setCurrentModal(null);
    setModalData({});
    previousModalData.current = null;
    if (confirmResolver) {
      confirmResolver(false);
      setConfirmResolver(null);
    }
  };

  const closeReportModalAndReturn = () => {
    if (previousModalData.current) {
      setModalData(previousModalData.current);
      previousModalData.current = null;
      setCurrentModal('detail');
    } else {
      closeModal();
    }
  };

  const showConfirm = (title: string, message: string): Promise<boolean> => {
    return new Promise(resolve => {
      setConfirmResolver(() => resolve);
      setModalData({
        confirm: {
          title,
          message,
          onConfirm: () => {
            setCurrentModal(null);
            setModalData({});
            resolve(true);
            setConfirmResolver(null);
          },
          onCancel: () => {
            setCurrentModal(null);
            setModalData({});
            resolve(false);
            setConfirmResolver(null);
          },
        },
      });
      setCurrentModal('confirm');
    });
  };

  const value: ModalContextType = {
    currentModal,
    modalData,
    openReportModal,
    openDetailModal,
    openConfirmModal,
    closeModal,
    closeReportModalAndReturn,

    // Legacy getters for compatibility
    isReportModalOpen: currentModal === 'report',
    isDetailModalOpen: currentModal === 'detail',
    isConfirmModalOpen: currentModal === 'confirm',
    reportData: modalData.report || null,
    detailData: modalData.detail || null,
    confirmData: modalData.confirm || null,
    showConfirm,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
