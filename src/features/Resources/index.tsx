'use client';

import { useInfiniteSupplies } from '@/hooks/useInfiniteSupplies';
import { Supply } from '@/lib/types';
import { CreateFormData, Station } from '@/lib/types/resource';
import { Alert, Box, CircularProgress, Skeleton, Typography } from '@mui/material';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createSupplyRequest, updateDeliveryProgress } from './api';
import {
  isCompleted,
  makeEmptyItem,
  mergeRequestsByOrganization,
  remainingNeed,
  sanitizeItem,
} from './utils';

import { useToast } from '@/providers/ToastProvider';
import { Stack } from '@mui/system';
import ConfirmDialog from './Dialogs/ConfirmDialog';
import CreateResourceDialog from './Dialogs/CreateResourceDialog';
import DeliveryDialog, { DeliveryFormData } from './Dialogs/DeliveryDialog';
import FilterPanel from './FilterPanel';
import Footer from './Footer';
import Header from './Header';
import ResourceItem from './ResourceItem';

interface CreateResourceFormData extends CreateFormData {
  policyAccepted: boolean;
}

const ResourcesComponent: React.FC = () => {
  const createForm = useForm<CreateResourceFormData>({
    defaultValues: {
      org: '',
      phone: '',
      address: '',
      items: [makeEmptyItem()],
      policyAccepted: false,
    },
  });

  const deliveryForm = useForm<DeliveryFormData>({
    defaultValues: {
      org: '',
      phone: '',
      address: '',
      items: [],
    },
  });

  const [selectedTag, setSelectedTag] = useState('');
  const [showMode, setShowMode] = useState<'pending' | 'completed'>('pending');

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState<'create' | 'delivery' | null>(null);

  const [fulfilledCollapsed, setFulfilledCollapsed] = useState<Record<string, boolean>>({});

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    supplyProviders,
  } = useInfiniteSupplies();

  const { showToast } = useToast();

  const allRequests: Supply[] = data?.pages.flatMap(page => page.member) || [];
  const totalItems = data?.pages[data.pages.length - 1]?.totalItems || allRequests.length;

  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (!hasNextPage || isFetchingNextPage) return;
      if (entries[0].isIntersecting) {
        fetchNextPage();
      }
    });
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const mergedRequests = useMemo(() => {
    const merged = mergeRequestsByOrganization(allRequests);
    return merged.sort((a: Supply, b: Supply) => {
      const aCompleted = isCompleted(a);
      const bCompleted = isCompleted(b);
      if (aCompleted && !bCompleted) return 1;
      if (!aCompleted && bCompleted) return -1;
      return 0;
    });
  }, [allRequests]);

  const visibleRequests = useMemo(() => {
    let list = mergedRequests;
    if (selectedTag) {
      list = list.filter((req: Supply) => req.supplies.some(item => item.tag === selectedTag));
    }
    if (showMode === 'pending') {
      list = list.filter(req => !isCompleted(req));
    } else if (showMode === 'completed') {
      list = list.filter(isCompleted);
    }
    return list;
  }, [mergedRequests, selectedTag, showMode]);

  const resetCreateForm = () => {
    createForm.reset({
      org: '',
      phone: '',
      address: '',
      items: [makeEmptyItem()],
      policyAccepted: false,
    });
  };

  const handleCreateOpen = () => {
    resetCreateForm();
    setCreateDialogOpen(true);
  };

  const handleCreateClose = () => {
    setCreateDialogOpen(false);
    setConfirmDialogOpen(null);
  };

  const getCreatePayload = () => {
    const formValues = createForm.getValues();
    return {
      org: formValues.org.trim(),
      phone: formValues.phone.trim(),
      address: formValues.address.trim(),
      items: formValues.items.map(sanitizeItem),
    };
  };

  const handleSubmitCreate = createForm.handleSubmit(async formData => {
    try {
      const payload = {
        org: formData.org.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        items: formData.items.map(sanitizeItem),
      };

      await createSupplyRequest(payload);
      showToast('已新增配送需求', 'success');
      setConfirmDialogOpen(null);
      setCreateDialogOpen(false);
      await refetch();
    } catch (error) {
      console.error('Create request failed:', error);
      showToast('新增配送需求失敗', 'error');
    }
  });

  const handleDeliveryOpen = (req: Supply) => {
    deliveryForm.reset({
      id: req.id,
      org: req.name,
      phone: req.phone,
      address: req.address,
      items: req.supplies.filter(i => remainingNeed(i) > 0).map(item => ({ ...item, count: 0 })),
    });
    setDeliveryDialogOpen(true);
  };

  const handleDeliveryClose = () => {
    setDeliveryDialogOpen(false);
    setConfirmDialogOpen(null);
    deliveryForm.reset({ items: [] });
  };

  const getDeliveryPayload = () => {
    const formValues = deliveryForm.getValues();
    return {
      org: formValues.org.trim(),
      phone: formValues.phone.trim(),
      address: formValues.address.trim(),
      items: formValues.items.filter(item => !!item.supply_id && item.count > 0),
    };
  };

  const handleDeliveryConfirm = deliveryForm.handleSubmit(async formData => {
    try {
      if (!formData.id) throw new Error('Missing delivery ID');
      const items = formData.items;
      const deliveryData = items
        .filter(item => !!item.id && item.count > 0)
        .map(item => ({
          id: item.id,
          count: item.count,
        }));
      await updateDeliveryProgress(formData.id, deliveryData);
      showToast('已送出配送清單', 'success');
      setConfirmDialogOpen(null);
      setDeliveryDialogOpen(false);
      await refetch();
    } catch (error) {
      console.error('Delivery update failed:', error);
      showToast('送出配送清單失敗', 'error');
    }
  });

  const isConfirmDialogSubmitting = useMemo(() => {
    if (confirmDialogOpen === 'create') return createForm.formState.isSubmitting;
    if (confirmDialogOpen === 'delivery') return deliveryForm.formState.isSubmitting;

    return false;
  }, [confirmDialogOpen, createForm.formState.isSubmitting, deliveryForm.formState.isSubmitting]);

  const handleConfirmDialogSubmit = () => {
    if (confirmDialogOpen === 'create') {
      handleSubmitCreate();
      return;
    }
    if (confirmDialogOpen === 'delivery') {
      handleDeliveryConfirm();
      return;
    }
  };

  const stationsForRequest = (req: Supply): Station[] => {
    if (!req?.supplies?.length) return [];

    const itemById = new Map(req.supplies.filter(item => item?.id).map(item => [item.id, item]));

    const providersMap = new Map();
    req.supplies.forEach(item => {
      if (!item?.id) return;
      const providers = supplyProviders[item.id] || [];
      providers.forEach(provider => {
        const normalizedName = (provider.name || '').trim().toLowerCase();
        const fallbackKey = `${provider.address || ''}|${provider.phone || ''}`.trim();
        const key =
          normalizedName || provider.id || fallbackKey || `${item.id}-${provider.name || ''}`;

        if (!providersMap.has(key)) {
          providersMap.set(key, {
            id: provider.id || key,
            name: provider.name?.trim(),
            address: (provider.address || '').trim(),
            phone: (provider.phone || '').trim(),
            supplies: new Map(),
          });
        }

        const entry = providersMap.get(key);
        const supplyId = provider.supply_item_id || item.id;
        const matchedItem = itemById.get(supplyId) || item;
        const supplyName = matchedItem?.name || item.name;
        const supplyKey = supplyId || `${item.id}-${supplyName}`;

        entry.supplies.set(supplyKey, {
          id: supplyKey,
          name: supplyName,
          tag: matchedItem?.tag,
          total_number: matchedItem?.total_number || 0,
          received_count: matchedItem?.received_count || 0,
          unit: matchedItem?.unit || '',
        });
      });
    });

    return Array.from(providersMap.values()).map(provider => ({
      ...provider,
      address: provider.address,
      supplies: Array.from(provider.supplies.values()),
    }));
  };

  const handleToggleFulfilled = (id: string) => {
    setFulfilledCollapsed(prev => ({
      ...prev,
      [id]: !(fulfilledCollapsed[id] ?? true),
    }));
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <>
      <Header onCreateOpen={handleCreateOpen} />
      <div className="px-4 md:px-6 max-w-[1200px] mx-auto">
        <FilterPanel
          selectedTag={selectedTag}
          showMode={showMode}
          onTagChange={setSelectedTag}
          onModeChange={setShowMode}
        />

        {isLoading ? (
          <Box>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={200}
                sx={{ mb: 2, borderRadius: 2 }}
              />
            ))}
          </Box>
        ) : (
          <>
            {visibleRequests.length > 0 ? (
              <Stack spacing={2.5}>
                {visibleRequests.map((req, index) => (
                  <ResourceItem
                    key={`${req.id}-${index}`}
                    request={req}
                    stations={stationsForRequest(req)}
                    isFulfilledCollapsed={fulfilledCollapsed[req.id] ?? true}
                    onToggleFulfilled={() => handleToggleFulfilled(req.id)}
                    onDeliveryOpen={handleDeliveryOpen}
                  />
                ))}
              </Stack>
            ) : (
              <Alert severity="info">目前沒有物資需求</Alert>
            )}

            <div ref={loaderRef} style={{ height: 1 }} />
            {isFetchingNextPage && (
              <Box display="flex" justifyContent="center" mt={3}>
                <CircularProgress />
              </Box>
            )}
            {!hasNextPage && visibleRequests.length > 0 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Typography variant="body2" color="text.secondary">
                  已載入全部需求{totalItems > 0 && `（共 ${totalItems} 筆）`}
                </Typography>
              </Box>
            )}
          </>
        )}

        <Footer />

        <CreateResourceDialog
          open={createDialogOpen}
          onClose={handleCreateClose}
          form={createForm}
          onConfirm={() => setConfirmDialogOpen('create')}
        />

        <DeliveryDialog
          open={deliveryDialogOpen}
          onClose={handleDeliveryClose}
          form={deliveryForm}
          onConfirm={() => setConfirmDialogOpen('delivery')}
        />

        <ConfirmDialog
          dialogType={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(null)}
          submitting={isConfirmDialogSubmitting}
          onSubmit={handleConfirmDialogSubmit}
          getPayload={{
            create: getCreatePayload,
            delivery: getDeliveryPayload,
          }}
        />
      </div>
    </>
  );
};

export default memo(ResourcesComponent);
