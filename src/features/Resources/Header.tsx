'use client';

import ActionButton from '@/components/ActionButton';
import { Add as AddIcon } from '@mui/icons-material';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { Divider, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { memo } from 'react';
import DonationInfo from './DonationInfo';

interface HeaderProps {
  onCreateOpen: () => void;
}

const LabelAndActionButton = ({ onCreateOpen }: HeaderProps) => {
  const buttonClassNames =
    'flex-1 py-3 px-5 min-h-fit text-[16px] leading-[20px] font-weight-500 items-center justify-center';
  return (
    <Stack
      display="flex"
      width="100%"
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent={{ xs: 'center', sm: 'space-between' }}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      columnGap={2}
    >
      <Typography
        variant="h4"
        color="var(--black)"
        component="h1"
        py="8px"
        sx={{
          textAlign: 'left',
          fontWeight: 'bold',
          lineHeight: '30px',
          fontSize: '24px',
        }}
      >
        物資配送
      </Typography>
      <Stack
        direction="row"
        spacing="12px"
        boxSizing="border-box"
        justifySelf="flex-end"
        divider={<Divider orientation="vertical" flexItem sx={{ borderColor: 'var(--gray-5)' }} />}
        sx={{
          width: { xs: '100%', sm: 'auto' },
          button: { xs: { flex: 1 }, sm: { flex: undefined } },
        }}
      >
        <ActionButton
          variant="secondary"
          icon={<AddIcon fontSize="small" />}
          iconPosition="left"
          onClick={onCreateOpen}
          className={buttonClassNames}
        >
          新增物資需求
        </ActionButton>
        <ActionButton
          variant="tertiary"
          openInNewTab={false}
          icon={<ArrowOutwardIcon fontSize="small" />}
          iconPosition="right"
          href="/volunteer-register"
          className={buttonClassNames}
        >
          我想找志工
        </ActionButton>
      </Stack>
    </Stack>
  );
};

const Header: React.FC<HeaderProps> = ({ onCreateOpen }) => {
  return (
    <div className="mb-[12px] w-[100svw] bg-[var(--light-gray-background)] flex items-center justify-center border-b border-[var(--gray-3)]">
      <Stack
        sx={{
          flex: 1,
          maxWidth: 'calc(1200px - 24px)',
          width: '100%',
          color: 'white',
          p: { xs: 2, md: 3 },
        }}
        gap={2}
      >
        <LabelAndActionButton onCreateOpen={onCreateOpen} />

        <DonationInfo />
      </Stack>
    </div>
  );
};

export default memo(Header);
