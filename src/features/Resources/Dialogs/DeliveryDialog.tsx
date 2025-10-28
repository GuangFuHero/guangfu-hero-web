'use client';

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import React from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { remainingNeed, typeMeta } from '../utils';

import ActionButton from '@/components/ActionButton';
import NumberInput from '@/components/NumberInput';
import { SupplyItem } from '@/lib/types';
import CloseIcon from '@mui/icons-material/Close';
import { Stack } from '@mui/system';
export interface DeliveryFormData {
  id: string;
  org: string;
  phone: string;
  address: string;
  items: (SupplyItem & { count: number })[];
}
interface DeliveryDialogProps {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<DeliveryFormData>;
  onConfirm: () => void;
}

const DeliveryDialog: React.FC<DeliveryDialogProps> = ({ open, onClose, form, onConfirm }) => {
  const { formState, control } = form;

  const { fields } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fieldKey',
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '.MuiDialogContent-root': {
          p: '12px 16px',
        },
      }}
    >
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
          sx={{ fontWeight: 500, fontSize: '20px', lineHeight: '25px', color: 'var(--black)' }}
        >
          配送清單
        </Typography>
        <IconButton sx={{ p: 0 }} onClick={onClose}>
          <CloseIcon fontSize="medium" htmlColor="var(--gray-2)" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          p: '12px 16px',
          m: 0,
          overflow: 'auto',
          gap: '12px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'none',
        }}
      >
        {fields.map((item, index) => (
          <Stack
            p="12px 16px"
            key={item.fieldKey}
            spacing="12px"
            border="1px solid var(--gray-3)"
            borderRadius="8px"
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
            <Typography
              sx={{ fontSize: '14px', lineHeight: '18px', fontWeight: 600, color: 'var(--gray)' }}
            >
              {item.name}
            </Typography>

            <Typography
              sx={{ fontSize: '14px', lineHeight: '18px', fontWeight: 600, color: 'var(--red)' }}
            >
              尚缺 {remainingNeed(item)} {item.unit}
            </Typography>

            <Controller
              control={control}
              name={`items.${index}.count`}
              render={({ field }) => {
                const max = remainingNeed(item);
                return (
                  <Stack direction={{ xs: 'column', sm: 'row' }} flex={1} spacing="12px">
                    <NumberInput
                      min={0}
                      max={max}
                      value={field.value}
                      onChange={field.onChange}
                      sx={{ flex: 7, '* > input': { height: '36px' } }}
                    />
                    <Button
                      sx={{
                        flex: 1,
                        color: 'var(--black)',
                        bgcolor: '#3A39371A',
                        borderRadius: '8px',
                        height: '36px',
                        minWidth: '120px',
                        boxShadow: 'none',
                        ':disabled': {
                          opacity: 0.4,
                        },
                      }}
                      variant="contained"
                      disabled={field.value + 1 > max}
                      onClick={() => field.onChange(max)}
                    >
                      <Typography
                        sx={{
                          fontSize: '16px',
                          lineHeight: '20px',
                          fontWeight: 400,
                          whiteSpace: 'nowrap',
                          color: 'var(--black)',
                        }}
                      >
                        加到最大數量
                      </Typography>
                    </Button>
                  </Stack>
                );
              }}
            />
          </Stack>
        ))}
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
        <Stack direction="row" alignItems="center" flex={{ xs: 1, sm: 0 }} width="100%" spacing={1}>
          <ActionButton variant="secondary-outline" className="flex-1 rounded-sm" onClick={onClose}>
            取消
          </ActionButton>
          <ActionButton
            variant="secondary"
            className={
              !formState.isValid || formState.isSubmitting
                ? 'opacity-50 flex-1 rounded-sm'
                : 'flex-1 rounded-sm'
            }
            onClick={() => {
              if (!formState.isValid || formState.isSubmitting) return;
              onConfirm();
            }}
          >
            預覽資訊
          </ActionButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default DeliveryDialog;
