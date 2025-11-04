'use client';

import ActionButton from '@/components/ActionButton';
import { SupplyItem } from '@/lib/types';
import { CreateFormData, DeliveryData } from '@/lib/types/resource';
import { mapLink, phoneHref } from '@/lib/utils';
import { LocationOn as LocationIcon, Phone as PhoneIcon } from '@mui/icons-material';
import {
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
import ResourceTag from '../ResourceTag';

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
          sx={{ fontWeight: 600, fontSize: '20px', lineHeight: '25px', color: 'var(--black)' }}
        >
          {dialogType ? <>{dialogType === 'create' ? '確認配送需求' : '確認配送清單'}</> : null}
        </Typography>
      </DialogTitle>

      {payload && (
        <DialogContent sx={{ overflow: 'auto', m: 0, p: 0 }}>
          <Stack
            p="12px"
            spacing={'12px'}
            sx={{ fontSize: '16px', lineHeight: '20px', fontWeight: 500 }}
          >
            <Typography sx={{ color: '#000', font: 'inherit' }}>{payload.org}</Typography>

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
                    font: 'inherit',
                    fontWeight: 400,
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
                    font: 'inherit',
                    fontWeight: 400,
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
                    py: '8px',
                    borderBottom: '1px dashed var(--gray-3)',
                    font: 'inherit',
                    color: 'var(--gray)',
                  }}
                  spacing="8px"
                >
                  <ResourceTag tag={item.tag} />
                  <Typography sx={{ font: 'inherit', fontWeight: 600 }}>{item.name}</Typography>
                  <Typography sx={{ font: 'inherit', fontWeight: 400 }}>
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
        <Stack
          direction="row"
          alignItems="center"
          flex={1}
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
