'use client';
import ActionButton from '@/components/ActionButton';
import AddIcon from '@mui/icons-material/Add';
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';
import { debounce, Divider, Stack, Typography } from '@mui/material';
import { memo } from 'react';
import ReactGA from 'react-ga4';

const sendClickGAEvent = debounce(() => {
  ReactGA.event('click_create_button', {
    button_label: '新增人力需求',
    page_path: window.location.pathname,
    location: 'header',
  });
}, 300);

interface HeaderProps {
  onCreateOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ onCreateOpen }) => {
  const handleCreateClick = () => {
    onCreateOpen();
    sendClickGAEvent();
  };

  return (
    <div className="mb-[12px] w-[100svw] bg-[var(--light-gray-background)] flex items-center justify-center border-b border-[var(--gray-3)]">
      <Stack
        sx={{
          flex: 1,
          maxWidth: 'calc(1200px - 24px)',
          width: '100%',
          color: 'white',
          p: 3,
        }}
        gap={2}
      >
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
            志工媒合
          </Typography>
          <Stack
            direction="row"
            spacing="12px"
            boxSizing="border-box"
            justifySelf="flex-end"
            divider={
              <Divider orientation="vertical" flexItem sx={{ borderColor: 'var(--gray-5)' }} />
            }
            sx={{
              width: { xs: '100%', sm: 'auto' },
              '* > button': { xs: { flex: 1 }, sm: { flex: undefined } },
            }}
          >
            <ActionButton
              variant="primary"
              icon={<AddIcon fontSize="small" />}
              iconPosition="left"
              onClick={handleCreateClick}
              className="flex-1"
            >
              新增人力需求
            </ActionButton>
            <ActionButton
              variant="tertiary"
              openInNewTab={false}
              icon={<ArrowOutwardIcon fontSize="small" />}
              iconPosition="right"
              href="/resources"
              className="flex-1"
            >
              我需要物資
            </ActionButton>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
};

export default memo(Header);
