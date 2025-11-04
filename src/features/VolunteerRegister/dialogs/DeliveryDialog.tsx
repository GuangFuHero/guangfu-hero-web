'use client';

import ActionButton from '@/components/ActionButton';
import NumberInput from '@/components/NumberInput';
import { getEditApiUrl } from '@/lib/api';
import { HumanResource } from '@/lib/types';
import { mapLink, phoneHref } from '@/lib/utils';
import { LocationOn as LocationIcon, Phone as PhoneIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import RoleTypeTag from '../RoleTypeTag';

interface DeliveryFormData {
  joinCount: number;
}

interface DeliveryDialogProps {
  open: boolean;
  onClose: () => void;
  request: HumanResource | null;
  onSubmittedCallback?: (isSuccess: boolean) => void;
}

const ROLE_NAME_MAP = {
  '鏟子超人,鏟': '鏟子超人',
  '清溝超人,溝': '清溝超人',
  '搬物超人,搬,拖,運': '搬物超人',
  '廚師超人,廚師,煮': '廚師超人',
  '整理超人,整理': '整理超人',
} as Record<string, string>;

function getRoleTypeColor(role_type: string): string {
  const TYPE_MAP: Record<string, { tag: string; cls: string; order: number }> = {
    一般志工: { tag: '一般', cls: 'var(--gray-4)', order: 5 },
    '清潔/整理': { tag: '清潔/整理', cls: 'var(--gray-4)', order: 0 },
    醫療照護: { tag: '醫療照護', cls: 'var(--gray-4)', order: 1 },
    後勤支援: { tag: '後勤支援', cls: 'var(--gray-4)', order: 2 },
    專業技術: { tag: '專業技術', cls: 'var(--gray-4)', order: 3 },
    其他: { tag: '其他', cls: 'var(--gray-4)', order: 4 },
  };
  return TYPE_MAP[role_type]?.cls || '';
}

const DeliveryDialog: React.FC<DeliveryDialogProps> = ({
  open,
  onClose,
  request,
  onSubmittedCallback = () => {},
}) => {
  const theme = useTheme();
  const isRequestCompleted = !!request?.is_completed;

  const maxNeeded = !request ? 0 : request.headcount_need - request.headcount_got;

  const [displayConfirmDialog, setDisplayConfirmDialog] = React.useState(false);

  const form = useForm<DeliveryFormData>({
    defaultValues: {
      joinCount: 1,
    },
    mode: 'onBlur',
  });

  const { control, formState, getValues, reset } = form;
  const joinCountValue = getValues('joinCount');

  const handleClose = () => {
    onClose();
    setDisplayConfirmDialog(false);
    reset({ joinCount: 1 });
  };

  const handleConfirm = form.handleSubmit(async formData => {
    if (!request) return;

    const payload = {
      headcount_got: request.headcount_got + Number(formData.joinCount),
      is_completed: request.headcount_got + Number(formData.joinCount) === request.headcount_need,
      status:
        request.headcount_got + Number(formData.joinCount) === request.headcount_need
          ? 'completed'
          : 'active',
    };

    try {
      const res = await fetch(`${getEditApiUrl()}/human_resources/${request.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!!result) {
        onSubmittedCallback(true);
        handleClose();
      } else {
        throw new Error('Submission failed');
      }
    } catch (e) {
      console.error('❌ Submission failed:', e);
      onSubmittedCallback(false);
      setDisplayConfirmDialog(false);
    }
  });

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            p: '16px',
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--gray-3)',
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '25px',
              color: 'var(--black)',
            }}
          >
            人力派遣
          </Typography>
          <IconButton sx={{ p: 0 }} onClick={handleClose}>
            <CloseIcon fontSize="medium" htmlColor="var(--gray-2)" />
          </IconButton>
        </DialogTitle>

        <DialogContent
          sx={{
            m: '12px 16px',
            p: 0,
            overflow: 'auto',
            gap: '12px',
            display: 'flex',
            flexDirection: 'column',
            '* > .MuiInputBase-root': {
              borderRadius: '8px',
              height: '48px',
              boxSizing: 'border-box',
            },
            '* > input': {
              fontSize: '16px',
              lineHeight: '20px',
              fontWeight: 400,
            },
          }}
        >
          {request && (
            <Stack spacing="16px">
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing="8px"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
              >
                <RoleTypeTag
                  label={request.role_type}
                  bgcolor={getRoleTypeColor(request.role_type)}
                />
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '16px',
                    lineHeight: '20px',
                    color: 'var(--gray)',
                  }}
                >
                  {ROLE_NAME_MAP?.[request.role_name || ''] || '-'}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                pb="16px"
                spacing="8px"
                divider={
                  <Divider orientation="vertical" flexItem sx={{ borderColor: 'var(--gray-5)' }} />
                }
              >
                <Typography
                  sx={{
                    fontSize: '16px',
                    lineHeight: '20px',
                    fontWeight: 400,
                    color: 'var(--gray)',
                    flex: 1,
                  }}
                >
                  需要 {request.headcount_need} {request.headcount_unit}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    lineHeight: '20px',
                    fontWeight: 600,
                    color: 'var(--red)',
                  }}
                >
                  尚需 {request.headcount_need - request.headcount_got} {request.headcount_unit}
                </Typography>
              </Stack>

              <Controller
                control={control}
                name="joinCount"
                render={({ field }) => (
                  <NumberInput
                    min={1}
                    max={maxNeeded}
                    value={field.value}
                    onChange={field.onChange}
                    sx={{
                      '* > input': { height: '48px' },
                      '.MuiInputAdornment-root': {
                        height: '48px',
                        minHeight: '48px',
                        width: '48px',
                      },
                    }}
                  />
                )}
              />
            </Stack>
          )}
          <Stack
            direction="row"
            alignItems="center"
            sx={{
              p: '12px 16px',
              borderRadius: '8px',
              fontSize: '16px',
              lineHeight: '20px',
              fontWeight: 400,
              color: 'var(--black)',
              bgcolor: 'var(--warning-background)',
              gap: '8px',
            }}
          >
            <Typography sx={{ font: 'inherit' }}>
              注意： 請先
              <Typography component="span" color="var(--primary)" fontWeight={600}>
                電話聯繫
              </Typography>
              並
              <Typography component="span" color="var(--primary)" fontWeight={600}>
                截圖資訊
              </Typography>
              ，確認無誤後再進行媒合
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'flex-start',
            p: '12px 16px',
            borderTop: '1px solid var(--gray-3)',
            gap: '16px',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            flex={{ xs: 1, sm: 0 }}
            width="100%"
            spacing={1}
            sx={{
              button: {
                minWidth: '120px',
                height: '49px',
                fontSize: '20px',
                lineHeight: '25px',
                fontWeight: 500,
              },
            }}
          >
            <ActionButton
              variant="primary-outline"
              className="flex-1 rounded-lg"
              onClick={handleClose}
            >
              取消
            </ActionButton>
            <ActionButton
              variant="primary"
              className={
                joinCountValue < 1 || joinCountValue > maxNeeded
                  ? 'opacity-50 flex-1 rounded-lg pointer-events-none'
                  : 'flex-1 rounded-lg'
              }
              onClick={() => {
                if (joinCountValue >= 1 && joinCountValue <= maxNeeded) {
                  setDisplayConfirmDialog(true);
                }
              }}
            >
              預覽資訊
            </ActionButton>
          </Stack>
        </DialogActions>
      </Dialog>

      <Dialog
        open={displayConfirmDialog}
        fullWidth
        maxWidth="sm"
        sx={{ backdropFilter: 'blur(4px)' }}
      >
        <DialogTitle
          sx={{
            p: '16px',
            flexDirection: 'row',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderBottom: '1px solid var(--gray-3)',
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '25px',
              color: 'var(--black)',
            }}
          >
            確認人力派遣資訊
          </Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            gap: '12px',
            display: 'flex',
            flexDirection: 'column',
            m: '16px 0',
            p: '0px 16px',
          }}
        >
          {request && (
            <Stack
              sx={{
                fontSize: '16px',
                lineHeight: '20px',
                color: 'var(--black)',
                py: '16px',
                gap: '12px',
                borderBottom: '1px dashed var(--gray-3)',
              }}
            >
              <Typography sx={{ color: '#000', font: 'inherit' }}>{request.org}</Typography>

              {request.address ? (
                <MuiLink
                  component={Link}
                  href={mapLink(request.address)}
                  target="_blank"
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
                >
                  <LocationIcon sx={{ fontSize: 16 }} htmlColor="var(--gray-2)" />
                  <Typography
                    sx={{
                      font: 'inherit',
                      fontWeight: 400,
                      color: 'var(--secondary)',
                    }}
                  >
                    {request.address}
                  </Typography>
                </MuiLink>
              ) : null}

              {request.phone && (
                <MuiLink
                  component={Link}
                  href={phoneHref(request.phone)}
                  sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
                >
                  <PhoneIcon sx={{ fontSize: 16 }} htmlColor="var(--gray-2)" />
                  <Typography
                    sx={{
                      font: 'inherit',
                      fontWeight: 400,
                      color: 'var(--secondary)',
                    }}
                  >
                    {request.phone}
                  </Typography>
                </MuiLink>
              )}

              {request.assignment_notes && (
                <Box sx={{ backgroundColor: '#F9F8F5', p: 2, mt: 2 }}>
                  <Typography color="var(--gray-2)" sx={{ font: 'inherit' }}>
                    備註：<span style={{ color: 'var(--black)' }}>{request.assignment_notes}</span>
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
          <Stack
            py="4px"
            sx={{ gap: '12px', fontSize: '16px', lineHeight: '20px', color: 'var(--gray)' }}
          >
            <Typography sx={{ font: 'inherit', fontWeight: 600 }}>加入數量：</Typography>
            <Typography sx={{ font: 'inherit', fontWeight: 400 }}>
              {ROLE_NAME_MAP?.[request?.role_name || ''] || '-'}
              {getValues('joinCount')}
              {request?.headcount_unit}
            </Typography>
          </Stack>
          <Stack
            sx={{
              p: '12px 16px',
              borderRadius: '8px',
              bgcolor: 'var(--warning-background)',
              gap: '8px',
            }}
          >
            <Typography
              sx={{
                fontSize: '16px',
                lineHeight: '20px',
                fontWeight: 500,
                color: 'var(--black)',
              }}
            >
              注意：送出後無法修改
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                lineHeight: '18px',
                fontWeight: 400,
                color: 'var(--gray)',
              }}
            >
              請再次確認資料是否正確
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            p: '12px 16px',
            borderTop: '1px solid var(--gray-3)',
            gap: '16px',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            flex={{ xs: 1, sm: 0 }}
            width="100%"
            spacing={1}
            sx={{
              button: {
                minWidth: '120px',
                height: '49px',
                fontSize: '20px',
                lineHeight: '25px',
                fontWeight: 500,
              },
            }}
          >
            <ActionButton
              variant="primary-outline"
              className="flex-1 rounded-lg"
              onClick={() => setDisplayConfirmDialog(false)}
            >
              返回修改
            </ActionButton>
            <ActionButton
              variant="primary"
              className={
                formState.isSubmitting ? 'opacity-50 flex-1 rounded-lg' : 'flex-1 rounded-lg'
              }
              onClick={handleConfirm}
            >
              送出
            </ActionButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeliveryDialog;
