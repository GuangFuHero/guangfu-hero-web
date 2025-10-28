import { Supply, SupplyItem } from '@/lib/types';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Chip, Collapse, Divider, IconButton, Stack, Typography } from '@mui/material';
import { memo } from 'react';
import { fulfilledItems, pendingItems, remainingNeed, typeMeta } from '../utils';

const Item = ({ item, remaining }: { item: SupplyItem; remaining: number }) => {
  return (
    <Stack py="12px" spacing={2}>
      <Stack direction="row" alignItems="center" spacing={1}>
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
          }}
        />
        <Typography
          sx={{ fontSize: '14px', fontWeight: 600, lineHeight: '18px', color: 'var(--gray)' }}
        >
          {item.name}
        </Typography>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'var(--gray-5)' }} />}
        sx={{ fontSize: '14px', fontWeight: 400, lineHeight: '18px' }}
      >
        <Typography flex={1} sx={{ font: 'inherit', color: 'var(--gray)' }}>
          需求 {item.total_number} {item.unit}
        </Typography>

        <Typography sx={{ font: 'inherit', color: remaining === 0 ? 'var(--done)' : 'var(--red)' }}>
          {remaining === 0 ? '已完成' : `尚需 ${remaining} ${item.unit}`}
        </Typography>
      </Stack>
    </Stack>
  );
};

const Items = ({
  req,
  isFulfilledCollapsed,
  onToggleFulfilled,
}: {
  req: Supply;
  isFulfilledCollapsed: boolean;
  onToggleFulfilled: () => void;
}) => {
  const pending = pendingItems(req);
  const fulfilled = fulfilledItems(req);

  return (
    <Stack spacing={2} py="16px">
      <Typography
        sx={{
          fontSize: '16px',
          fontWeight: 600,
          lineHeight: '20px',
          color: 'var(--black)',
        }}
      >
        需求物資
      </Typography>

      {pending.length > 0 && (
        <Stack>
          {pending.map(({ item, index }) => (
            <Item key={`pending-${index}`} item={item} remaining={remainingNeed(item)} />
          ))}
        </Stack>
      )}

      {fulfilled.length > 0 && (
        <Stack>
          <Stack direction="row" alignItems="center">
            <Typography
              sx={{ fontSize: '14px', fontWeight: 600, lineHeight: '18px', color: 'var(--gray)' }}
            >
              已完成項目（{fulfilled.length}）
            </Typography>
            <IconButton
              size="small"
              onClick={e => {
                e.stopPropagation();
                onToggleFulfilled();
              }}
            >
              {isFulfilledCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          </Stack>
          <Collapse in={!isFulfilledCollapsed}>
            <Stack spacing={1.5}>
              {fulfilled.map(({ item, index }) => (
                <Item key={`fulfilled-${index}`} item={item} remaining={remainingNeed(item)} />
              ))}
            </Stack>
          </Collapse>
        </Stack>
      )}
    </Stack>
  );
};

export default memo(Items);
