'use client';

import AuthCheckSkeleton from '@/features/SupplyDepot/AuthCheckSkeleton';
import UnAuthBlock from '@/features/SupplyDepot/UnAuthBlock';
import Header from '@/features/SupplyDepot/Header';
import { useFetchAllData } from '@/features/SupplyDepot/useFetchAllData';
import { useCheckAuth } from '@/hooks/useCheckAuth';
import FetchSupplyStatus from '@/features/SupplyDepot/FetchSupplyStatus';
import SupplyStation from '@/features/SupplyDepot/SupplyStation';
import SupplyRequirementList from '@/features/SupplyDepot/SupplyRequirementList';
import { Stack, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import Wrapper from '@/features/Wrapper';
import { useForm, FormProvider } from 'react-hook-form';
import { submitSupplyProvider } from '@/lib/api';
import { useState, useEffect } from 'react';
import {
  getStoredProviderInfo,
  updateStoredProvderInfo,
  type ProviderInfo,
  getReportedSupplies,
  addReportedSupply,
  type ReportedSupplies,
} from '@/lib/supplyLocalStorage';
import ConfirmModal, {
  type ConfirmModalItem,
  type ConfirmModalStationInfo,
} from '@/components/ConfirmModal';

interface SupplyFormData {
  name: string;
  phone: string;
  address: string;
  notes?: string;
  [key: `quantity_${string}`]: number;
}

const SupplyDepotFormPage = () => {
  const { authChecked, authed } = useCheckAuth(); // 檢查登入狀態
  const { supplies, loading, error, loadingMore, hasMore, fetchNextBatch } =
    useFetchAllData(authed); // 取得物資資料
  const methods = useForm<SupplyFormData>();
  const { handleSubmit } = methods;

  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitProgress, setSubmitProgress] = useState({
    current: 0,
    total: 0,
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });
  const [storedProviderInfo, setStoredProverderInfo] = useState<ProviderInfo>({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  const [reportedSupplies, setReportedSupplies] = useState<ReportedSupplies>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<SupplyFormData | null>(null);
  const [confirmItems, setConfirmItems] = useState<ConfirmModalItem[]>([]);
  const [confirmStationInfo, setConfirmStationInfo] = useState<ConfirmModalStationInfo | null>(
    null
  );

  // Load data from local storage on mount
  useEffect(() => {
    setStoredProverderInfo(getStoredProviderInfo());
    setReportedSupplies(getReportedSupplies());
  }, []);

  // Listen for selected items changes from SupplyRequirementList
  useEffect(() => {
    const handleSelectedItemsChange = (event: CustomEvent) => {
      setSelectedItems(event.detail);
    };
    document.addEventListener('selectedItemsChange', handleSelectedItemsChange as EventListener);
    return () => {
      document.removeEventListener(
        'selectedItemsChange',
        handleSelectedItemsChange as EventListener
      );
    };
  }, []);

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    if (pendingFormData) {
      onSubmit(pendingFormData);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
    setPendingFormData(null);
  };

  const handleFormSubmit = (data: SupplyFormData) => {
    // Prepare items list for confirmation modal
    if (!supplies) return;

    const selectedSupplyItems = supplies.filter(item => selectedItems[item.id]);

    const itemsForModal: ConfirmModalItem[] = selectedSupplyItems
      .map(item => {
        const quantity = data[`quantity_${item.id}`];
        if (!quantity || quantity <= 0) return null;
        return {
          name: item.name,
          count: quantity,
          unit: item.unit,
        };
      })
      .filter((item): item is ConfirmModalItem => item !== null);

    // Prepare station info for confirmation modal
    const stationInfoForModal: ConfirmModalStationInfo = {
      name: data.name,
      phone: data.phone,
      address: data.address,
      notes: data.notes,
    };

    // Show confirmation modal before actual submission
    setPendingFormData(data);
    setConfirmItems(itemsForModal);
    setConfirmStationInfo(stationInfoForModal);
    setShowConfirmModal(true);
  };

  const onSubmit = async (data: SupplyFormData) => {
    if (!supplies) return;

    // Filter selected items
    const selectedSupplyItems = supplies.filter(item => selectedItems[item.id]);

    if (selectedSupplyItems.length === 0) {
      setSnackbar({
        open: true,
        message: '請至少選擇一項物資',
        severity: 'error',
      });
      return;
    }

    setSubmitting(true);
    setSubmitProgress({ current: 0, total: selectedSupplyItems.length });

    const errors: string[] = [];
    let successCount = 0;

    // Submit API calls one by one
    for (let i = 0; i < selectedSupplyItems.length; i++) {
      const item = selectedSupplyItems[i];
      const quantity = data[`quantity_${item.id}`];

      if (!quantity || quantity <= 0) {
        errors.push(`${item.name}: 請輸入有效數量`);
        continue;
      }

      setSubmitProgress({ current: i + 1, total: selectedSupplyItems.length });

      const submitData = {
        name: data.name,
        address: data.address,
        phone: data.phone,
        notes: data.notes || '',
        supply_item_id: item.id,
        provide_unit: item.unit,
        provide_count: quantity,
        pii_date: 0, // 依後端需求固定送 0
      };
      try {
        const id_token =
          JSON.parse(localStorage.getItem('line_oauth_state') ?? '{}').id_token ?? '';

        await submitSupplyProvider(submitData, id_token);
        // Store successful submission in local storage
        addReportedSupply(item.id, quantity);
        successCount++;
      } catch (err) {
        errors.push(`${item.name}: ${err instanceof Error ? err.message : '提交失敗'}`);
      }
    }

    setSubmitting(false);

    // Show results
    if (errors.length === 0) {
      setSnackbar({
        open: true,
        message: `成功提交 ${successCount} 項物資!`,
        severity: 'success',
      });
      // Update reported supplies state
      setReportedSupplies(getReportedSupplies());
      // Clear selected items in child component
      document.dispatchEvent(new CustomEvent('clearSelectedItems'));
      // Clear only quantity fields, keep station info
      supplies?.forEach(item => {
        methods.setValue(`quantity_${item.id}`, 0);
      });
      setSelectedItems({});
    } else if (successCount > 0) {
      setSnackbar({
        open: true,
        message: `部分成功: ${successCount} 項成功, ${errors.length} 項失敗`,
        severity: 'info',
      });
      // Update reported supplies state even for partial success
      setReportedSupplies(getReportedSupplies());
      // Clear selected items in child component
      document.dispatchEvent(new CustomEvent('clearSelectedItems'));
      // Clear only quantity fields, keep station info
      supplies?.forEach(item => {
        methods.setValue(`quantity_${item.id}`, 0);
      });
      setSelectedItems({});
    } else {
      setSnackbar({
        open: true,
        message: `提交失敗: ${errors.join(', ')}`,
        severity: 'error',
      });
    }

    // memorize supply provider's info
    updateStoredProvderInfo(data.name, data.phone, data.address, data.notes);
  };

  if (!authChecked) {
    return <AuthCheckSkeleton />;
  }
  if (!authed) {
    return <UnAuthBlock />;
  }

  return (
    <Wrapper hideFooter hideBanner hideShare>
      <main className="min-h-dvh bg-gradient-to-b from-slate-50 to-slate-100 text-slate-900">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 md:py-10">
          <Header />
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <SupplyStation previousInfo={storedProviderInfo} />
                <FetchSupplyStatus loading={loading} error={error} count={supplies?.length || 0} />
                <SupplyRequirementList
                  supplies={supplies}
                  reportedSupplies={reportedSupplies}
                  loadingMore={loadingMore}
                  hasMore={hasMore}
                  fetchNextBatch={fetchNextBatch}
                />
              </Stack>
              <Button
                variant="contained"
                sx={{ width: '100%' }}
                onClick={handleSubmit(handleFormSubmit)}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {submitting
                  ? `送出中... (${submitProgress.current}/${submitProgress.total})`
                  : '送出'}
              </Button>
            </form>
          </FormProvider>
          <ConfirmModal
            open={showConfirmModal}
            title="請確認以下物資資訊"
            stationInfo={confirmStationInfo || undefined}
            items={confirmItems}
            onConfirm={handleConfirmSubmit}
            onCancel={handleCancelSubmit}
            confirmText="確認送出"
            cancelText="取消"
          />
        </div>
      </main>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Wrapper>
  );
};

export default SupplyDepotFormPage;
