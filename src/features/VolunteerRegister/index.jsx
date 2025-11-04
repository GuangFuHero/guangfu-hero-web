'use client';
import { useInfiniteHumanResource } from '@/hooks/useInfiniteHumanResource';
import { useToast } from '@/providers/ToastProvider';
import { Alert, Box, Stack, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { useEffect, useRef, useState } from 'react';
import CreateDialog from './dialogs/CreateDialog';
import DeliveryDialog from './dialogs/DeliveryDialog';
import FilterPanel from './FilterPanel';
import Header from './Header';
import VolunteerItem from './VolunteerItem';

export default function MainContent() {
  const { showToast } = useToast();

  const [openCreate, setOpenCreate] = useState(false);
  const [openDelivery, setOpenDelivery] = useState(false);
  const [deliveryData, setDeliveryData] = useState();

  const [selectedTag, setSelectedTag] = useState('');
  const [showMode, setShowMode] = useState('active');

  const {
    displayedData,
    totalItems,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteHumanResource(showMode, selectedTag);

  const loaderRef = useRef(null);

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

  function DeliveryRequest(data) {
    setDeliveryData(data);
    setOpenDelivery(true);
  }

  function onDeliverySubmittedCallback(isSuccess) {
    if (isSuccess) {
      showToast('已送出加入人力', 'success');
      setOpenDelivery(false);
      refetch();
    } else {
      showToast('更新失敗，請再試一次!', 'error');
    }
  }

  function onCreateSubmittedCallback(isSuccess) {
    if (isSuccess) {
      showToast('已新增人力需求', 'success');
      setOpenCreate(false);
      refetch();
    } else {
      showToast('新增人力需求失敗，請再試一次!', 'error');
    }
  }

  return (
    <>
      <Header onCreateOpen={() => setOpenCreate(true)} />
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
            {displayedData.length > 0 ? (
              <Stack spacing={2.5}>
                {displayedData.map((req, index) => (
                  <VolunteerItem
                    key={index}
                    request={req}
                    onDelivery={data => DeliveryRequest(data)}
                    showToastMsg={m => showToast(m)}
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
            {!hasNextPage && displayedData.length > 0 && (
              <Box display="flex" justifyContent="center" mt={3}>
                <Typography variant="body2" color="text.secondary">
                  已載入全部需求{totalItems > 0 && `（共 ${totalItems} 筆）`}
                </Typography>
              </Box>
            )}
          </>
        )}
      </div>

      <CreateDialog
        open={openCreate}
        onSubmittedCallback={onCreateSubmittedCallback}
        onClose={() => setOpenCreate(false)}
      />
      <DeliveryDialog
        open={openDelivery}
        onSubmittedCallback={onDeliverySubmittedCallback}
        request={deliveryData}
        onClose={() => {
          setOpenDelivery(false);
          setDeliveryData(false);
        }}
      />
    </>
  );
}
