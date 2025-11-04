import { Chip } from '@mui/material';

export default function RoleTypeTag({ bgcolor, label }: { bgcolor: string; label: string }) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        p: '4px 6px',
        span: { p: 0 },
        bgcolor,
        color: 'var(--gray-2)',
        borderRadius: '4px',
        fontSize: '14px',
        lineHeight: '18px',
        fontWeight: 500,
        width: 'fit-content',
      }}
    />
  );
}
