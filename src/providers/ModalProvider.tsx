import { createContext, ReactNode, useContext, useState } from 'react';

interface ModalContextType {
  // Help Modal
  isHelpModalOpen: boolean;
  openHelpModal: () => void;
  closeHelpModal: () => void;

  // Report Modal
  isReportModalOpen: boolean;
  reportData: {
    category: string;
    id: string;
    name: string;
  } | null;
  openReportModal: (category: string, id: string, name: string) => void;
  closeReportModal: () => void;

  // Confirm Modal
  isConfirmModalOpen: boolean;
  confirmData: {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null;
  openConfirmModal: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void;
  closeConfirmModal: () => void;

  // Promise-based confirm function
  showConfirm: (title: string, message: string) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportData, setReportData] = useState<{
    category: string;
    id: string;
    name: string;
  } | null>(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  const [confirmResolver, setConfirmResolver] = useState<
    ((result: boolean) => void) | null
  >(null);

  const openHelpModal = () => setIsHelpModalOpen(true);
  const closeHelpModal = () => setIsHelpModalOpen(false);

  const openReportModal = (category: string, id: string, name: string) => {
    setReportData({ category, id, name });
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setReportData(null);
  };

  const openConfirmModal = (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    setConfirmData({ title, message, onConfirm, onCancel });
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setConfirmData(null);
    if (confirmResolver) {
      confirmResolver(false);
      setConfirmResolver(null);
    }
  };

  const showConfirm = (title: string, message: string): Promise<boolean> => {
    return new Promise(resolve => {
      setConfirmResolver(() => resolve);
      setConfirmData({
        title,
        message,
        onConfirm: () => {
          setIsConfirmModalOpen(false);
          setConfirmData(null);
          resolve(true);
          setConfirmResolver(null);
        },
        onCancel: () => {
          setIsConfirmModalOpen(false);
          setConfirmData(null);
          resolve(false);
          setConfirmResolver(null);
        },
      });
      setIsConfirmModalOpen(true);
    });
  };

  const value: ModalContextType = {
    isHelpModalOpen,
    openHelpModal,
    closeHelpModal,

    isReportModalOpen,
    reportData,
    openReportModal,
    closeReportModal,

    isConfirmModalOpen,
    confirmData,
    openConfirmModal,
    closeConfirmModal,
    showConfirm,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
