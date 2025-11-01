import { Chip } from '@mui/material';
import { typeMeta } from './utils';

export default function ResourceTag({ tag }: { tag: string }) {
  return (
    <Chip
      label={typeMeta(tag).label}
      size="small"
      sx={{
        p: '4px 6px',
        span: { p: 0 },
        bgcolor: typeMeta(tag).color,
        color: 'white',
        borderRadius: '4px',
        fontSize: '14px',
        lineHeight: '18px',
        fontWeight: 500,
        width: 'fit-content',
      }}
    />
  );
}
