'use client';
import React, { useEffect, useState } from 'react';
import { Container, Box, ThemeProvider, CssBaseline, Chip } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Header from './Header';
import RequestCard from './RequestCard';
import Pagination from './Pagination';
import Toast from './Toast';

// dialogs
import CreateDialog from './dialogs/CreateDialog';
import EditDialog from './dialogs/EditDialog';
import DeliveryDialog from './dialogs/DeliveryDialog';

import { safeApiRequest } from './utils/helpers';

import theme from './colorPalate';

// import { Analytics } from '@vercel/analytics/react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { getApiUrl } from '@/lib/api';

export default function MainContent() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [toastMsg, setToastMsg] = useState('');

  const [openCreate, setOpenCreate] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [openDelivery, setOpenDelivery] = useState(false);
  const [totalPage, setTotalPage] = useState(2);

  const [editData, setEditData] = useState();
  const [deliveryData, setDeliveryData] = useState();

  const [requestState, setRequestState] = useState('active');
  const [listFilter, setListFilter] = React.useState(['']);

  const [originalData, setOriginalData] = React.useState([]);

  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {
    loadData(page, requestState, true);
  }, [page]);

  useEffect(() => {
    // Reload data whenever filters change so server-side filtering (q_role) is applied
    setPage(0);
    loadData(page, requestState, true);
  }, [listFilter, requestState]);

  function renderCards(data) {
    //擋掉soft deleted 的資料:  {status:"need_delete"}
    const requests = data.filter(d => d.status !== 'need_delete');

    //依據更新時間進行排序
    const sortedRequests = [...requests].sort((a, b) => b.updated_at - a.updated_at);

    // const filtreedRequest = [...sortedRequests].filter(item => {
    //   for (let i = 0; i < listFilter.length; i++) {
    //     if (item.assignment_notes.includes(listFilter[i]) || item.role_name.includes(listFilter[i]) || item.role_type.includes(listFilter[i])) {
    //       return true
    //     }
    //   }
    //   return false
    // })

    setRequests(sortedRequests);
  }

  const loadData = async (offset, state, shouldScrollThePage) => {
    setIsLoading(true);
    setRequests([]);
    const result = await safeApiRequest(
      `${getApiUrl()}/human_resources?limit=20&offset=${offset * 20}&status=${state}&order_by_time=desc&q_role=${listFilter}`
    );
    if (result.success) {
      setOriginalData(result.data.member);
      setIsLoading(false);

      renderCards(result.data.member);
      setTotalPage(
        result.data.totalItems % 20 === 0
          ? result.data.totalItems / 20
          : Math.floor(result.data.totalItems / 20) + 1
      );

      if (shouldScrollThePage) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }
  };

  function handlePageChange(newPage) {
    setRequests([]);
    setPage(newPage);
  }

  function EditRequest(data) {
    setEditData(data);
    setOpenEdit(true);
  }

  function DeliveryRequest(data) {
    setDeliveryData(data);
    setOpenDelivery(true);
  }

  function onEditSubmittedCallback(isSuccess) {
    if (isSuccess) {
      setToastMsg('需求更新成功!');
      setOpenEdit(false);
      loadData(page, requestState, false);
    } else {
      setToastMsg('需求更新失敗，請再試一次!');
    }
  }

  function onDeliverySubmittedCallback(isSuccess) {
    if (isSuccess) {
      setToastMsg('加入成功!');
      setOpenDelivery(false);
      loadData(page, requestState, false);
    } else {
      setToastMsg('加入失敗，請再試一次!');
    }
  }
  function onCreateSubmittedCallback(isSuccess) {
    if (isSuccess) {
      setToastMsg('需求已送出!');
      setOpenCreate(false);
      loadData(page, requestState, false);
    } else {
      setToastMsg('需求送出失敗，請再試一次!');
    }
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Header onCreate={() => setOpenCreate(true)} />
        <Container sx={{ mt: 3 }}>
          <Box sx={{ width: '100%', mb: 1 }}>
            <Tabs
              value={requestState}
              onChange={(e, v) => {
                setRequestState(v);
                setRequests([]);
                setPage(0);
              }}
            >
              <Tab value="active" label="尚缺志工" />
              <Tab value="completed" label="已完成" />
            </Tabs>
          </Box>
          <Box sx={{ width: '100%', mb: 1, userSelect: 'none' }}>
            <Chip
              color={listFilter[0] === '' ? 'primary' : ''}
              label="所有需求"
              sx={{ mr: 1, mb: 1 }}
              onClick={() => {
                setListFilter(['']);
              }}
            />

            {/* filtering with string query */}
            <Chip
              color={listFilter.includes('鏟子超人') ? 'primary' : ''}
              label="鏟子超人"
              sx={{ mr: 1, mb: 1 }}
              onClick={() => {
                setListFilter(['鏟子超人', '鏟']);
              }}
            />
            <Chip
              color={listFilter.includes('清溝超人') ? 'primary' : ''}
              label="清溝超人"
              sx={{ mr: 1, mb: 1 }}
              onClick={() => {
                setListFilter(['清溝超人', '溝']);
              }}
            />
            <Chip
              color={listFilter.includes('搬物超人') ? 'primary' : ''}
              label="搬物超人"
              sx={{ mr: 1, mb: 1 }}
              onClick={() => {
                setListFilter(['搬物超人', '搬', '拖', '運']);
              }}
            />
            <Chip
              color={listFilter.includes('廚師超人') ? 'primary' : ''}
              label="廚師超人"
              sx={{ mr: 1, mb: 1 }}
              onClick={() => {
                setListFilter(['廚師超人', '廚師', '煮']);
              }}
            />
            <Chip
              color={listFilter.includes('整理超人') ? 'primary' : ''}
              label="整理超人"
              sx={{ mr: 1, mb: 1 }}
              onClick={() => {
                setListFilter(['整理超人', '整理']);
              }}
            />
          </Box>
          {requests.length === 0 && isLoading && (
            <>
              <Stack spacing={1}>
                <Skeleton variant="text" sx={{ fontSize: '5rem' }} />
              </Stack>
            </>
          )}
          {/* {(requests.length === 0 && !isLoading) && <>
            <Stack spacing={1}>
              <Typography variant="h6">此頁查無符合條件的需求，您可以點選下方分頁按鈕，切換至其他分頁</Typography>
            </Stack>
          </>} */}
          {requests.map((req, idx) => (
            <RequestCard
              key={idx}
              request={req}
              onEdit={data => EditRequest(data)}
              onDelivery={data => DeliveryRequest(data)}
              showToastMsg={m => setToastMsg(m)}
            />
          ))}

          <Pagination page={page + 1} onPageChange={handlePageChange} count={totalPage} />
        </Container>

        <CreateDialog
          open={openCreate}
          onSubmittedCallback={onCreateSubmittedCallback}
          onClose={() => setOpenCreate(false)}
        />
        <EditDialog
          open={openEdit}
          onSubmittedCallback={onEditSubmittedCallback}
          request={editData}
          onClose={() => setOpenEdit(false)}
        />
        <DeliveryDialog
          open={openDelivery}
          onSubmittedCallback={onDeliverySubmittedCallback}
          onClose={() => setOpenDelivery(false)}
          request={deliveryData}
        />

        {/* <Maintenance/> */}

        <Toast message={toastMsg} onClose={() => setToastMsg('')} />
        {/* <Analytics /> */}
      </ThemeProvider>
    </>
  );
}
