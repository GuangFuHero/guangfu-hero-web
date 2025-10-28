import { AccessTime as TimeIcon } from '@mui/icons-material';
import { Chip, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import { memo } from 'react';
import { formatTimeAgo } from '../utils';

const CardHeader = ({
  name,
  createdAt,
  isCompleted,
}: {
  name: string;
  createdAt: number;
  isCompleted: boolean;
}) => {
  return (
    <Stack
      direction="row"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      flexWrap="wrap"
      p="16px 20px"
      borderBottom={`1px solid var(--gray-3)`}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {isCompleted && (
          <Chip
            label="已完成"
            size="small"
            sx={{
              bgcolor: 'var(--done)',
              color: 'white',
              borderRadius: '4px',
              fontSize: '12px',
              lineHeight: '15px',
              fontWeight: 500,
            }}
          />
        )}
        <Typography
          variant="h6"
          component="h2"
          sx={{ fontSize: '16px', fontWeight: 600, lineHeight: '20px' }}
        >
          {name}
        </Typography>
      </Stack>
      <Box display="flex" alignItems="center" gap={0.5}>
        <TimeIcon sx={{ fontSize: 16 }} htmlColor="var(--gray-2)" />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '12px', fontWeight: 400, lineHeight: '15px', color: 'var(--gray-2)' }}
        >
          {formatTimeAgo(createdAt)}
        </Typography>
      </Box>
    </Stack>
  );
};

export default memo(CardHeader);
