'use client';
import React, { useEffect, useState } from 'react';
import { Container, Box, ThemeProvider, CssBaseline, Chip, Button } from '@mui/material';
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
import { env } from '@/config/env';

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
      `${env.NEXT_PUBLIC_API_URL}/human_resources?limit=20&offset=${offset * 20}&status=${state}&order_by_time=desc&q_role=${listFilter}`
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
        <Box sx={{ backgroundColor: '#FEF2E7', p: 3, textAlign: 'center' }}>
          <p>
            因應災區需求減少，媒合功能將於 <span style={{ color: '#D34746' }}>10/30</span> 關閉，
            志工請至「大馬太鞍活動中心」接受分配
            <br />
            居民若有專業志工需求，請至專區聯繫廠商
          </p>
          <Button
            href="/victim/house-repair"
            component="a"
            sx={{
              border: '1px solid #F37C0E',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              mt: 2,
              width: { xs: '100%', md: '240px' },
              color: '#F37C0E',
              '&:hover': {
                backgroundColor: '#F37C0E',
                color: '#fff',
                '& svg path': {
                  fill: '#fff',
                },
              },
            }}
          >
            <span>查看廠商名單</span>
            <svg
              width="11"
              height="11"
              viewBox="0 0 11 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.16667 10.8333L0 9.66667L8 1.66667H0.833333V0H10.8333V10H9.16667V2.83333L1.16667 10.8333Z"
                fill="#F37C0E"
              />
            </svg>
          </Button>
        </Box>
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
            {/* filtering with string query */}
            {[
              { key: 'all', label: '所有需求', keywords: [''] },
              { key: 'shovel', label: '鏟子超人', keywords: ['鏟子超人', '鏟'] },
              { key: 'clean', label: '清溝超人', keywords: ['清溝超人', '溝'] },
              { key: 'move', label: '搬物超人', keywords: ['搬物超人', '搬', '拖', '運'] },
              { key: 'chef', label: '廚師超人', keywords: ['廚師超人', '廚師', '煮'] },
              { key: 'organize', label: '整理超人', keywords: ['整理超人', '整理'] },
            ].map(item => (
              <Chip
                key={item.key}
                color={
                  item.key === 'all'
                    ? listFilter[0] === ''
                      ? 'primary'
                      : ''
                    : listFilter.includes(item.label)
                      ? 'primary'
                      : ''
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {((item.key === 'all' && listFilter[0] === '') ||
                      (item.key !== 'all' && listFilter.includes(item.label))) && (
                      <svg
                        width="12"
                        height="9"
                        viewBox="0 0 12 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.72667 7.05333L0.946666 4.27333L0 5.21333L3.72667 8.94L11.7267 0.94L10.7867 0L3.72667 7.05333Z"
                          fill="white"
                        />
                      </svg>
                    )}
                    {item.label}
                  </Box>
                }
                sx={{
                  mr: 1,
                  mb: 1,
                  borderRadius: '4px',
                  fontSize: '16px',
                  ...(((item.key === 'all' && listFilter[0] === '') ||
                    (item.key !== 'all' && listFilter.includes(item.label))) && {
                    backgroundColor: '#434343',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#434343',
                    },
                  }),
                }}
                onClick={() => {
                  setListFilter(item.key === 'all' ? [''] : item.keywords);
                }}
              />
            ))}
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
