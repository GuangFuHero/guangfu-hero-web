'use client';

import ActionButton from '@/components/ActionButton';
import { CreateFormData, typeOptions } from '@/lib/types/resource';
import { Add as AddIcon } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Link as MuiLink,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React from 'react';
import { Control, Controller, UseFormReturn, useFieldArray } from 'react-hook-form';
import { INDEX_TO_CHINESE_NUMBERS } from '../constants';

const SupplyItemsList = ({ control }: { control: Control<CreateResourceFormData> }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fieldKey',
  });

  return (
    <Stack py="4px">
      <Typography
        variant="h6"
        gutterBottom
        sx={{ fontSize: '14px', lineHeight: '18px', fontWeight: 500, color: 'var(--black)' }}
      >
        需求項目
        <Typography component="span" sx={{ font: 'inherit', color: '#CF3C33' }}>
          *
        </Typography>
      </Typography>

      <Stack spacing="8px">
        {fields.map((field, index) => (
          <Stack
            key={field.fieldKey}
            spacing={1}
            sx={{
              bgcolor: 'var(--light-gray-background)',
              p: '12px 16px',
              borderRadius: '8px',
              '* > input, .MuiSelect-select': { bgcolor: 'white', borderRadius: '8px' },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography
                sx={{
                  fontSize: '16px',
                  lineHeight: '20px',
                  fontWeight: 500,
                  color: 'var(--black)',
                }}
              >
                項目{INDEX_TO_CHINESE_NUMBERS[index]}
              </Typography>

              {fields.length > 1 && (
                <ActionButton
                  className="w-fit p-0 min-w-fit text-[var(--red)]"
                  onClick={() => remove(index)}
                >
                  移除
                </ActionButton>
              )}
            </Stack>
            <Stack
              display="flex"
              direction={{ xs: 'column', sm: 'row' }}
              alignItems="center"
              spacing={1}
            >
              <Controller
                name={`items.${index}.tag`}
                control={control}
                rules={{
                  required: '請選擇物資類型',
                }}
                render={({ field: fieldProps, fieldState }) => (
                  <FormControl
                    size="small"
                    sx={{ minWidth: { xs: '100%', sm: 150 } }}
                    error={!!fieldState.error}
                  >
                    <Select {...fieldProps} variant="outlined" fullWidth>
                      {typeOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />

              <Controller
                name={`items.${index}.name`}
                control={control}
                rules={{
                  required: '物資名稱為必填',
                  validate: value => value.trim().length > 0 || '物資名稱不能為空白',
                }}
                render={({ field: fieldProps, fieldState }) => (
                  <>
                    <OutlinedInput
                      fullWidth
                      {...fieldProps}
                      size="small"
                      sx={{ minWidth: { xs: '100%', sm: 120 } }}
                      placeholder="名稱（如瓶裝水）*"
                      error={!!fieldState.error}
                    />
                    {fieldState.error && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {fieldState.error?.message}
                      </Typography>
                    )}
                  </>
                )}
              />

              <Controller
                name={`items.${index}.total_number`}
                control={control}
                rules={{
                  required: '需求數量為必填',
                  validate: value => {
                    const num = Number(value);
                    if (!Number.isInteger(num) || num < 1) {
                      return '需求數量必須為大於 0 的整數';
                    }
                    if (num > 999999) {
                      return '需求數量不能超過 999999';
                    }
                    return true;
                  },
                }}
                render={({ field: fieldProps, fieldState }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    {...fieldProps}
                    size="small"
                    sx={{ minWidth: { xs: '100%', sm: 100 } }}
                    inputProps={{ min: 1, max: 999999 }}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    onChange={e => {
                      const newValue = Math.min(999999, Math.max(1, parseInt(e.target.value) || 1));
                      if (isNaN(newValue)) return;
                      fieldProps.onChange(newValue);
                    }}
                    slotProps={{
                      input: {
                        sx: { p: 0, input: { px: '12px', textAlign: 'center' } },
                        startAdornment: (
                          <InputAdornment
                            component="button"
                            position="start"
                            sx={{
                              m: 0,
                              width: '48px',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'var(--gray-4)',
                              cursor: 'pointer',
                            }}
                            disabled={Math.max(1, (fieldProps.value || 0) - 1) < 1}
                            onClick={() => {
                              const newValue = Math.max(1, (fieldProps.value || 0) - 1);
                              if (isNaN(newValue)) return;
                              fieldProps.onChange(newValue);
                            }}
                          >
                            <RemoveIcon
                              htmlColor={
                                (fieldProps.value || 0) - 1 < 1 ? 'var(--gray-3)' : 'var(--black)'
                              }
                              fontSize="small"
                            />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment
                            component="button"
                            position="end"
                            sx={{
                              m: 0,
                              width: '48px',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'var(--gray-4)',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              const newValue = Math.min(999999, (fieldProps.value || 0) + 1);
                              if (isNaN(newValue)) return;
                              fieldProps.onChange(newValue);
                            }}
                          >
                            <AddIcon
                              htmlColor={
                                (fieldProps.value || 0) + 1 > 999999
                                  ? 'var(--gray-3)'
                                  : 'var(--black)'
                              }
                              fontSize="small"
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              />

              <Controller
                name={`items.${index}.unit`}
                control={control}
                rules={{
                  required: '單位為必填',
                  validate: value => value.trim().length > 0 || '單位不能為空白',
                }}
                render={({ field: fieldProps, fieldState }) => (
                  <TextField
                    fullWidth
                    variant="outlined"
                    {...fieldProps}
                    size="small"
                    sx={{ minWidth: { xs: '100%', sm: 80 } }}
                    placeholder="單位（如箱）*"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Stack>
          </Stack>
        ))}
      </Stack>

      {fields?.length <= 50 && (
        <ActionButton
          variant="secondary-light"
          icon={<AddIcon />}
          iconPosition="left"
          onClick={() => {
            append({
              id: '',
              tag: '食物/水',
              name: '',
              total_number: 1,
              unit: '',
              received_count: 0,
              supply_id: '',
            });
          }}
          className="flex-1 w-full mt-3"
        >
          新增更多項目
        </ActionButton>
      )}
    </Stack>
  );
};

interface CreateResourceFormData extends CreateFormData {
  policyAccepted: boolean;
}

interface CreateResourceDialogProps {
  open: boolean;
  onClose: () => void;
  form: UseFormReturn<CreateResourceFormData>;
  onConfirm: () => void;
}

const CreateResourceDialog: React.FC<CreateResourceDialogProps> = ({
  open,
  onClose,
  form,
  onConfirm,
}) => {
  const { control, formState } = form;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
            新增配送需求
          </Typography>
          <IconButton sx={{ p: 0 }} onClick={onClose}>
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
          }}
        >
          <Stack spacing={1.5}>
            <Controller
              name="org"
              control={control}
              rules={{
                required: '單位名稱為必填',
                validate: value => value.trim().length > 0 || '單位名稱不能為空白',
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  size="small"
                  placeholder="單位名稱*"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ fontWeight: 500 }}
                />
              )}
            />

            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="tel"
                  placeholder="電話*"
                  size="small"
                  sx={{ '.MuiFormHelperText-root': { ml: 0 } }}
                  helperText={
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{
                        fontSize: '14px',
                        lineHeight: '18px',
                        fontWeight: 400,
                        color: 'var(--gray-2)',
                      }}
                    >
                      <InfoOutlineIcon sx={{ color: 'inherit' }} fontSize="small" />
                      <Typography sx={{ font: 'inherit' }}>
                        填寫將公開顯示電話，取得物資後自動隱藏
                      </Typography>
                    </Stack>
                  }
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              rules={{
                required: '地址為必填',
                validate: value => value.trim().length > 0 || '地址不能為空白',
              }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  size="small"
                  placeholder="地址*"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ fontWeight: 500 }}
                />
              )}
            />
          </Stack>

          <SupplyItemsList control={control} />
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
          <Controller
            name="policyAccepted"
            control={control}
            rules={{
              required: '請同意服務條款和隱私權政策',
              validate: value => value === true || '請同意服務條款和隱私權政策',
            }}
            render={({ field, fieldState }) => (
              <Stack direction="row" flex={1}>
                <FormControlLabel
                  sx={{ m: 0, p: 0 }}
                  control={<Checkbox {...field} checked={field.value} size="small" sx={{ p: 0 }} />}
                  label={
                    <Typography
                      sx={{
                        fontSize: '14px',
                        lineHeight: '18px',
                        fontWeight: 400,
                        letterSpacing: 0,
                        color: 'var(--black)',
                      }}
                    >
                      <Typography component="span" sx={{ font: 'inherit', color: 'var(--red)' }}>
                        *
                      </Typography>
                      我已理解本平台
                      <MuiLink
                        component={Link}
                        href="https://gf250923.org/terms"
                        target="_blank"
                        onClick={e => e.stopPropagation()}
                        sx={{ font: 'inherit', color: 'var(--secondary)' }}
                      >
                        服務條款
                      </MuiLink>
                      及
                      <MuiLink
                        component={Link}
                        href="https://gf250923.org/privacy"
                        target="_blank"
                        onClick={e => e.stopPropagation()}
                        sx={{ font: 'inherit', color: 'var(--secondary)' }}
                      >
                        隱私權政策
                      </MuiLink>
                      之使用
                    </Typography>
                  }
                />
                {fieldState.error && (
                  <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                    {fieldState.error.message}
                  </Typography>
                )}
              </Stack>
            )}
          />
          <Stack
            direction="row"
            alignItems="center"
            flex={{ xs: 1, sm: 0 }}
            width="100%"
            spacing={1}
          >
            <ActionButton
              variant="secondary-outline"
              className="flex-1 rounded-sm"
              onClick={onClose}
            >
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
    </>
  );
};

export default CreateResourceDialog;
