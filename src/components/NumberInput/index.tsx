import { Add as AddIcon } from '@mui/icons-material';
import RemoveIcon from '@mui/icons-material/Remove';
import { InputAdornment, SxProps, TextField, Theme } from '@mui/material';

interface NumberInputProps {
  isError?: boolean;
  errorMessage?: string;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  value: number;
  sx?: SxProps<Theme> | undefined;
}

export default function NumberInput(props: NumberInputProps) {
  const {
    isError = false,
    errorMessage = null,
    min = 1,
    max = 999999,
    onChange,
    value,
    sx = {},
  } = props;
  const nextIncrementValue = (value || 0) + 1;
  const nextDecrementValue = (value || 0) - 1;

  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      sx={{ minWidth: { xs: '100%', sm: 100 }, ...sx }}
      inputProps={{ min, max }}
      error={isError}
      helperText={errorMessage}
      onChange={e => {
        const newValue = Math.min(max, Math.max(min, parseInt(e.target.value) || min));
        if (isNaN(newValue)) return;
        onChange(newValue);
      }}
      value={value}
      slotProps={{
        input: {
          sx: { p: 0, input: { px: '12px', py: 0, textAlign: 'center' } },
          startAdornment: (
            <InputAdornment
              component="button"
              position="start"
              sx={{
                m: 0,
                width: '48px',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'var(--gray-4)',
                cursor: 'pointer',
                borderTopLeftRadius: '8px',
                borderBottomLeftRadius: '8px',
              }}
              disabled={Math.max(min, nextDecrementValue) < min}
              onClick={() => {
                const newValue = Math.max(min, nextDecrementValue);
                if (isNaN(newValue)) return;
                onChange(newValue);
              }}
            >
              <RemoveIcon
                htmlColor={(value || 0) - 1 < min ? 'var(--gray-3)' : 'var(--black)'}
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
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'var(--gray-4)',
                cursor: 'pointer',
                borderTopRightRadius: '8px',
                borderBottomRightRadius: '8px',
              }}
              disabled={Math.min(max, nextIncrementValue) > max}
              onClick={() => {
                const newValue = Math.min(max, nextIncrementValue);
                if (isNaN(newValue)) return;
                onChange(newValue);
              }}
            >
              <AddIcon
                htmlColor={nextIncrementValue > max ? 'var(--gray-3)' : 'var(--black)'}
                fontSize="small"
              />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
