'use client';

import { Box, Card, CardActions, CardContent, Divider, Typography } from '@mui/material';

import ActionButton from '@/components/ActionButton';
import { Stack } from '@mui/system';
import RoleTypeTag from '../RoleTypeTag';
import CardHeader from './CardHeader';
import ContactInfo from './ContactInfo';

const ROLE_NAME_MAP = {
  '鏟子超人,鏟': '鏟子超人',
  '清溝超人,溝': '清溝超人',
  '搬物超人,搬,拖,運': '搬物超人',
  '廚師超人,廚師,煮': '廚師超人',
  '整理超人,整理': '整理超人',
};

function getRemainNumber(need, got) {
  const needNum = parseInt(need);
  const gotNum = parseInt(got);

  return !isNaN(needNum) && !isNaN(gotNum) && needNum > gotNum ? needNum - gotNum : 0;
}

export default function RequestCard({ request, onDelivery, showToastMsg }) {
  const isRequestCompleted = request.is_completed;

  function getRoleTypeColor(role_type) {
    const TYPE_MAP = {
      一般志工: { tag: '一般', cls: 'var(--gray-4)', order: 5 },
      '清潔/整理': { tag: '清潔/整理', cls: 'var(--gray-4)', order: 0 },
      醫療照護: { tag: '醫療照護', cls: 'var(--gray-4)', order: 1 },
      後勤支援: { tag: '後勤支援', cls: 'var(--gray-4)', order: 2 },
      專業技術: { tag: '專業技術', cls: 'var(--gray-4)', order: 3 },
      其他: { tag: '其他', cls: 'var(--gray-4)', order: 4 },
    };
    return TYPE_MAP[role_type].cls;
  }

  return (
    <div style={{ position: 'relative' }}>
      <Card
        sx={{
          position: 'relative',
          borderRadius: 3,
          boxShadow: '0px 2px 10px 0px #0000001A',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <CardHeader
            name={request.org}
            createdAt={request.created_at}
            isCompleted={isRequestCompleted}
          />

          <Stack sx={{ p: '0 20px' }}>
            <Stack sx={{ py: '16px', gap: '12px', borderBottom: `1px dashed var(--gray-3)` }}>
              <Stack spacing="8px" direction="row" alignItems="center" justifyContent="flex-start">
                <RoleTypeTag
                  label={request.role_type}
                  bgcolor={getRoleTypeColor(request.role_type)}
                />
                <Typography variant="body">
                  <b>{ROLE_NAME_MAP?.[request.role_name || ''] || request.role_name || '-'}</b>
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing="8px"
                sx={{ fontSize: '16px', fontWeight: 400, lineHeight: '20px' }}
                divider={
                  <Divider orientation="vertical" flexItem sx={{ borderColor: 'var(--gray-5)' }} />
                }
              >
                <Typography
                  sx={{
                    font: 'inherit',
                    color: 'var(--gray)',
                    flex: 1,
                  }}
                >
                  需要 {request.headcount_need} 人
                </Typography>

                <Typography
                  sx={{
                    font: 'inherit',
                    fontWeight: 600,
                    color: isRequestCompleted ? 'var(--done)' : 'var(--red)',
                  }}
                >
                  {isRequestCompleted
                    ? '已完成'
                    : `尚需 ${getRemainNumber(request.headcount_need, request.headcount_got)} ${request.headcount_unit}`}
                </Typography>
              </Stack>
            </Stack>

            <ContactInfo
              address={request?.address}
              phone={request?.phone}
              isPhoneDisplayed={!isRequestCompleted && request?.phone}
            />

            {request.assignment_notes ? (
              <Box
                sx={{
                  my: '16px',
                  bgcolor: 'var(--light-gray-background)',
                  p: '16px',
                  fonts: '16px',
                  lineHeight: '20px',
                  fontWeight: 400,
                }}
              >
                <Typography sx={{ font: 'inherit', color: 'var(--gray-2)' }}>
                  備註：
                  <Typography component="span" sx={{ font: 'inherit', color: 'var(--black)' }}>
                    {request.assignment_notes}
                  </Typography>
                </Typography>
              </Box>
            ) : (
              <Box sx={{ height: '16px' }} />
            )}
          </Stack>
        </CardContent>

        <CardActions
          sx={{
            position: 'relative',
            justifyContent: isRequestCompleted ? 'flex-start' : 'center',
            p: '16px 20px',
            borderTop: '1px solid var(--gray-3)',
          }}
        >
          {isRequestCompleted ? (
            <Typography
              sx={{ fontSize: '14px', lineHeight: '18px', fontWeight: 400, color: 'var(--gray-2)' }}
            >
              如仍有需求，請重新點選新增需求
            </Typography>
          ) : (
            <ActionButton
              variant="primary"
              className="min-w-[240px] py-3 px-5 rounded-sm min-h-fit"
              icon={<></>}
              onClick={() => onDelivery(request)}
            >
              我要加入
            </ActionButton>
          )}
        </CardActions>
      </Card>
    </div>
  );
}
