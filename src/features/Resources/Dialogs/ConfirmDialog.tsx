'use client';

import ActionButton from '@/components/ActionButton';
import { SupplyItem } from '@/lib/types';
import { CreateFormData, DeliveryData } from '@/lib/types/resource';
import { LocationOn as LocationIcon, Phone as PhoneIcon } from '@mui/icons-material';
import {
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import Link from 'next/link';
import { useMemo } from 'react';
import { mapLink, phoneHref, typeMeta } from '../utils';

export type DialogType = 'create' | 'delivery' | null;

type PayloadMap = {
  create: () => CreateFormData;
  delivery: () => DeliveryData;
};

interface ConfirmDialogProps {
  dialogType: DialogType;
  onClose: () => void;
  getPayload: PayloadMap;
  submitting: boolean;
  onSubmit: () => void;
}

function ConfirmDialog({
  dialogType,
  onClose,
  getPayload,
  submitting,
  onSubmit,
}: ConfirmDialogProps) {
  const payload = useMemo(() => {
    if (!dialogType) return;
    return getPayload[dialogType]();
  }, [getPayload, dialogType]);

  if (!dialogType || !payload) return null;

  return (
    <Dialog
      open={!!dialogType}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ backdropFilter: 'blur(4px)' }}
    >
      <DialogTitle
        sx={{
          p: '16px',
          flexDirection: 'row',
          display: 'flex',
          alignItems: 'center',
          borderBottom: '1px solid var(--gray-3)',
        }}
      >
        <Typography
          sx={{ fontWeight: 500, fontSize: '20px', lineHeight: '25px', color: 'var(--black)' }}
        >
          {dialogType ? <>{dialogType === 'create' ? '確認新增需求' : '確認配送清單'}</> : null}
        </Typography>
      </DialogTitle>

      {payload && (
        <DialogContent sx={{ overflow: 'auto', m: 0, p: 0 }}>
          <Stack p="12px" spacing={'12px'}>
            <Typography
              sx={{ fontSize: '16px', lineHeight: '20px', fontWeight: 500, color: '#000' }}
            >
              {payload.org}
            </Typography>

            {payload.address ? (
              <MuiLink
                component={Link}
                href={mapLink(payload.address)}
                target="_blank"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
              >
                <LocationIcon sx={{ fontSize: 16 }} htmlColor="var(--gray-2)" />
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '18px',
                    color: 'var(--secondary)',
                  }}
                >
                  {payload.address}
                </Typography>
              </MuiLink>
            ) : null}

            {payload.phone && (
              <MuiLink
                component={Link}
                href={phoneHref(payload.phone)}
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
              >
                <PhoneIcon sx={{ fontSize: 16 }} htmlColor="var(--gray-2)" />
                <Typography
                  sx={{
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '18px',
                    color: 'var(--secondary)',
                  }}
                >
                  {payload.phone}
                </Typography>
              </MuiLink>
            )}

            <Stack spacing="12px">
              {(payload.items || []).map((item: SupplyItem & { count?: number }, index) => (
                <Stack
                  key={index}
                  sx={{
                    p: '8px 0',
                    borderBottom: '1px dashed var(--gray-3)',
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '18px',
                    color: 'var(--gray)',
                  }}
                  spacing="8px"
                >
                  <Chip
                    label={typeMeta(item.tag).label}
                    size="small"
                    sx={{
                      bgcolor: typeMeta(item.tag).color,
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '12px',
                      lineHeight: '15px',
                      fontWeight: 500,
                      width: 'fit-content',
                    }}
                  />
                  <Typography sx={{ font: 'inherit', fontWeight: 600 }}>{item.name}</Typography>
                  <Typography sx={{ font: 'inherit' }}>
                    {dialogType ? <>{dialogType === 'create' ? '需求' : '配送'}</> : null}{' '}
                    {dialogType ? (
                      <>{dialogType === 'create' ? item.total_number : item.count}</>
                    ) : null}{' '}
                    {item.unit}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </DialogContent>
      )}

      <DialogActions
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: '12px',
          borderTop: '1px solid var(--gray-3)',
        }}
      >
        <Stack direction="row" alignItems="center" flex={1} width="100%" spacing={1}>
          <ActionButton variant="secondary-outline" className="flex-1 rounded-sm" onClick={onClose}>
            返回修改
          </ActionButton>
          <ActionButton
            variant="secondary"
            className={submitting ? 'opacity-50 flex-1 rounded-sm' : 'flex-1 rounded-sm'}
            onClick={onSubmit}
          >
            {submitting ? <CircularProgress size={20} /> : '送出'}
          </ActionButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
