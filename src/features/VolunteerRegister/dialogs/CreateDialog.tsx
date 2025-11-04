'use client';
import ActionButton from '@/components/ActionButton';
import NumberInput from '@/components/NumberInput';
import { getEditApiUrl } from '@/lib/api';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Link as MuiLink,
  Select,
  Stack,
  TextareaAutosize,
  TextField,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

export type CreateVolunteerFormData = {
  org: string;
  phone: string;
  address: string;
  assignment_notes: string;
  headcount_need: number;
  headcount_unit: string;
  role_name: string;
  role_type: string;
  policyAccepted: boolean;
};

const ROLE_NAME_MAP = {
  '鏟子超人,鏟': '鏟子超人',
  '清溝超人,溝': '清溝超人',
  '搬物超人,搬,拖,運': '搬物超人',
  '廚師超人,廚師,煮': '廚師超人',
  '整理超人,整理': '整理超人',
} as Record<string, string>;

export const DEFAULT_VALUES: CreateVolunteerFormData = {
  org: '',
  phone: '',
  address: '',
  assignment_notes: '',
  headcount_need: 1,
  headcount_unit: '人',
  role_name: '鏟子超人,鏟',
  role_type: '一般志工',
  policyAccepted: false,
};

const VolunteerAlert = () => {
  return (
    <Stack
      spacing="12px"
      sx={{
        p: '12px 20px',
        bgcolor: 'var(--background-danger)',
        borderRadius: '16px',
      }}
    >
      <Typography
        sx={{ fontSize: '16px', lineHeight: '20px', fontWeight: 500, color: 'var(--red)' }}
      >
        ⚠ 提醒：此處為申請「一般志工」
      </Typography>
      <Box
        sx={{
          fontSize: '14px',
          lineHeight: '18px',
          fontWeight: 400,
          color: 'var(--gray)',
        }}
      >
        <Typography sx={{ font: 'inherit' }}>若需以下專業服務，請前往專區聯繫：</Typography>
        <br />
        <Typography sx={{ font: 'inherit' }}>
          水電、泥作、重機具、門窗、電捲門、木工、油漆、結構工程、裝潢
        </Typography>
      </Box>
      <ActionButton
        variant="tertiary"
        iconPosition="right"
        href="/victim/house-repair"
        className="w-fit"
        icon={<ArrowOutwardIcon fontSize="small" />}
      >
        <Typography
          sx={{ fontSize: '16px', lineHeight: '20px', fontWeight: 400, color: 'var(--black)' }}
        >
          查找廠商名單
        </Typography>
      </ActionButton>
    </Stack>
  );
};

interface CreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmittedCallback?: (isSuccess: boolean) => void;
}

const CreateDialog: React.FC<CreateDialogProps> = ({
  open,
  onClose,
  onSubmittedCallback = () => {},
}) => {
  const form = useForm<CreateVolunteerFormData>({
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  });
  const { control, formState, reset, getValues } = form;
  const [displayConfirmDialog, setDisplayConfirmDialog] = useState(false);

  const handleOpenConfirm = () => {
    if (formState.isValid) {
      setDisplayConfirmDialog(true);
    }
  };

  const handleClose = () => {
    setDisplayConfirmDialog(false);
    onClose();
    reset(DEFAULT_VALUES);
  };

  const handleConfirm = form.handleSubmit(async formData => {
    const payload = {
      org: formData.org,
      phone: formData.phone,
      address: formData.address,
      assignment_notes: formData.assignment_notes,
      headcount_need: Number(formData.headcount_need),
      headcount_unit: formData.headcount_unit,
      role_name: formData.role_name,
      role_type: formData.role_type,
      status: 'active',
      role_status: 'pending',
      is_completed: false,
    };

    try {
      const res = await fetch(`${getEditApiUrl()}/human_resources`, {
        method: 'POST',
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
    } catch (error) {
      console.error('❌ 提交失敗:', error);
      onSubmittedCallback(false);
      setDisplayConfirmDialog(false);
    }
  });

  const formData = getValues();

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
            新增人力需求
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
            '.MuiSelect-root': {
              height: '48px',
            },
          }}
        >
          <VolunteerAlert />

          <Stack spacing={1.5}>
            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: '12px' }}>
              <Controller
                control={control}
                name="org"
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    size="small"
                    placeholder="單位名稱*"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="tel"
                    required
                    size="small"
                    placeholder="聯絡資訊*"
                    error={!!fieldState.error}
                    helperText={
                      <Stack
                        component="span"
                        direction="row"
                        alignItems="flex-start"
                        sx={{
                          fontSize: '14px',
                          lineHeight: '18px',
                          fontWeight: 400,
                          color: 'var(--gray-2)',
                        }}
                      >
                        <InfoOutlineIcon sx={{ color: 'inherit', mr: 0.5 }} fontSize="small" />
                        <Typography component="span" sx={{ font: 'inherit' }}>
                          填寫將公開顯示電話，志工招滿後自動隱藏
                        </Typography>
                      </Stack>
                    }
                    sx={{ '.MuiFormHelperText-root': { ml: 0 } }}
                  />
                )}
              />
            </Stack>

            <Controller
              control={control}
              name="address"
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  size="small"
                  placeholder="地址*"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: '12px' }}>
              <Controller
                control={control}
                name="role_type"
                rules={{ required: true }}
                render={({ field }) => (
                  <FormControl required disabled fullWidth>
                    <InputLabel>需求類別</InputLabel>
                    <Select label="需求類別" {...field}>
                      <MenuItem value="一般志工">一般志工</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                control={control}
                name="role_name"
                rules={{ required: true }}
                render={({ field, fieldState }) => (
                  <FormControl required fullWidth error={!!fieldState.error}>
                    <InputLabel>需求名稱</InputLabel>
                    <Select label="需求名稱" {...field}>
                      <MenuItem value="鏟子超人,鏟">鏟子超人</MenuItem>
                      <MenuItem value="清溝超人,溝">清溝超人</MenuItem>
                      <MenuItem value="搬物超人,搬,拖,運">搬物超人</MenuItem>
                      <MenuItem value="廚師超人,廚師,煮">廚師超人</MenuItem>
                      <MenuItem value="整理超人,整理">整理超人</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Stack>

            <Controller
              control={control}
              rules={{ required: true }}
              name="headcount_need"
              render={({ field }) => (
                <NumberInput
                  value={field.value}
                  onChange={field.onChange}
                  sx={{
                    '* > input': { height: '48px' },
                    '.MuiInputAdornment-root': { height: '48px', minHeight: '48px', width: '48px' },
                  }}
                />
              )}
            />

            <Controller
              control={control}
              name="assignment_notes"
              render={({ field }) => (
                <Stack spacing="8px">
                  <TextareaAutosize
                    {...field}
                    minRows={4}
                    maxRows={4}
                    placeholder="備註"
                    className="border border-[var(--gray-3)] rounded-lg py-[8px] px-[12px] w-full focus:outline-[var(--primary)] resize-none"
                  />
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    sx={{
                      fontSize: '14px',
                      lineHeight: '18px',
                      fontWeight: 400,
                      color: 'var(--gray-2)',
                    }}
                  >
                    <InfoOutlineIcon sx={{ color: 'inherit', mr: 0.5 }} fontSize="small" />
                    <Typography sx={{ font: 'inherit' }}>
                      為確保志工符合您的需求，請詳述修繕物品、需要協助的細節、集合時間
                    </Typography>
                  </Stack>
                </Stack>
              )}
            />
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
          <Controller
            name="policyAccepted"
            control={control}
            render={({ field }) => (
              <Stack direction="row" flex={1}>
                <FormControlLabel
                  sx={{ m: 0, p: 0 }}
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value}
                      size="small"
                      sx={{ p: 0, svg: { color: field.value ? 'var(--primary)' : undefined } }}
                    />
                  }
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
                        sx={{
                          font: 'inherit',
                          color: 'var(--secondary)',
                          textDecorationLine: 'none',
                        }}
                      >
                        服務條款
                      </MuiLink>
                      及
                      <MuiLink
                        component={Link}
                        href="https://gf250923.org/privacy"
                        target="_blank"
                        onClick={e => e.stopPropagation()}
                        sx={{
                          font: 'inherit',
                          color: 'var(--secondary)',
                          textDecorationLine: 'none',
                        }}
                      >
                        隱私權政策
                      </MuiLink>
                      之使用
                    </Typography>
                  }
                />
              </Stack>
            )}
          />
          <Stack
            direction="row"
            alignItems="flex-start"
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
                !formState.isValid || formState.isSubmitting
                  ? 'opacity-50 flex-1 rounded-lg'
                  : 'flex-1 rounded-lg'
              }
              onClick={() => {
                if (!formState.isValid || formState.isSubmitting) return;
                handleOpenConfirm();
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
            sx={{ fontWeight: 500, fontSize: '20px', lineHeight: '25px', color: 'var(--black)' }}
          >
            確認人力需求
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
          <Stack sx={{ fontSize: '16px', lineHeight: '20px', color: 'var(--black)', gap: '16px' }}>
            <Typography
              sx={{ font: 'inherit', fontWeight: 500, display: { xs: 'block', sm: 'none' } }}
            >
              請再次確認以下資料是否正確：
            </Typography>
            <Box>
              <Typography sx={{ font: 'inherit', fontWeight: 600 }}>單位名稱：</Typography>
              <Typography sx={{ font: 'inherit', fontWeight: 400 }}>{formData.org}</Typography>
            </Box>

            <Box>
              <Typography sx={{ font: 'inherit', fontWeight: 600 }}>手機號碼：</Typography>
              <Typography sx={{ font: 'inherit', fontWeight: 400 }}>{formData.phone}</Typography>
            </Box>
            <Box>
              <Typography sx={{ font: 'inherit', fontWeight: 600 }}>地址：</Typography>
              <Typography sx={{ font: 'inherit', fontWeight: 400 }}>{formData.address}</Typography>
            </Box>

            <Box>
              <Typography sx={{ font: 'inherit', fontWeight: 600 }}>需求：</Typography>
              <Typography sx={{ font: 'inherit', fontWeight: 400 }}>
                {ROLE_NAME_MAP?.[formData.role_name] || ''}
                {formData.headcount_need}
                {formData.headcount_unit}
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ font: 'inherit', fontWeight: 600 }}>備註：</Typography>
              <Typography sx={{ font: 'inherit', fontWeight: 400 }}>
                {formData.assignment_notes ? formData.assignment_notes : '無'}
              </Typography>
            </Box>

            <Stack
              sx={{
                borderRadius: '8px',
                p: '12px 16px',
                bgcolor: 'var(--warning-background)',
                gap: '8px',
              }}
            >
              <Typography sx={{ fontSize: '16px', lineHeight: '20px', fontWeight: 500 }}>
                注意：需求送出後無法修改
              </Typography>
              <Typography sx={{ fontSize: '14px', lineHeight: '18px', fontWeight: 400 }}>
                請再次確認資料是否正確
              </Typography>
            </Stack>
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
                form.formState.isSubmitting ? 'opacity-50 flex-1 rounded-lg' : 'flex-1 rounded-lg'
              }
              onClick={handleConfirm}
            >
              {form.formState.isSubmitting ? '...' : '送出'}
            </ActionButton>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateDialog;
