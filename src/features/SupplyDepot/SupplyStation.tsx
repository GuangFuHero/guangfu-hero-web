'use client';
import React from 'react';
import { Card, TextField, Typography, Stack } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { ProviderInfo } from '@/lib/supplyLocalStorage';

interface SupplyStationProps {
  previousInfo?: ProviderInfo;
}

const SupplyStation = ({ previousInfo }: SupplyStationProps) => {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <section aria-labelledby="station-info" className="space-y-6">
      <Card variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          物資站資訊
        </Typography>

        <button
          className="mb-8 mr-4 rounded-2xl border border-transparent bg-blue-400 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 active:scale-[0.99]"
          type="button"
          onClick={() => {
            if (previousInfo) {
              setValue('name', previousInfo.name);
              setValue('phone', previousInfo.phone);
              setValue('address', previousInfo.address);
              setValue('notes', previousInfo.notes);
            }
          }}
        >
          點選貼上前一次的資料
        </button>
        <button
          className="mb-8 mr-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-black shadow-sm hover:bg-gray-100 active:scale-[0.99]"
          type="button"
          onClick={() => {
            setValue('name', '');
            setValue('phone', '');
            setValue('address', '');
            setValue('notes', '');
          }}
        >
          清除物資站資料
        </button>

        <Stack spacing={2}>
          <TextField
            label="名稱"
            placeholder="例：光復里物資站"
            variant="outlined"
            size="small"
            margin="dense"
            slotProps={{ inputLabel: { shrink: true } }}
            required
            {...register('name', {
              required: '請輸入物資站名稱',
            })}
            error={!!errors.name}
            helperText={errors.name?.message as string}
          />
          <TextField
            label="電話"
            placeholder="例：0912345678"
            variant="outlined"
            size="small"
            margin="dense"
            slotProps={{ inputLabel: { shrink: true } }}
            required
            {...register('phone', {
              required: '請輸入電話號碼',
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message as string}
          />
          <TextField
            label="地址"
            placeholder="例：花蓮縣光復鄉…"
            variant="outlined"
            size="small"
            margin="dense"
            slotProps={{ inputLabel: { shrink: true } }}
            required
            {...register('address', {
              required: '請輸入地址',
            })}
            error={!!errors.address}
            helperText={errors.address?.message as string}
          />
          <TextField
            label="備註"
            placeholder="例：可聯繫時間、其他說明"
            variant="outlined"
            size="small"
            margin="dense"
            multiline
            rows={2}
            slotProps={{ inputLabel: { shrink: true } }}
            {...register('notes')}
          />
        </Stack>
      </Card>
    </section>
  );
};

export default SupplyStation;
