import { LocationOn as LocationIcon, Phone as PhoneIcon } from '@mui/icons-material';
import { Link as MuiLink, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import Link from 'next/link';
import { memo } from 'react';
import { mapLink, phoneHref } from '../utils';

const ContactInfo = ({
  address,
  phone,
  isPhoneDisplayed,
}: {
  address?: string;
  phone?: string;
  isPhoneDisplayed: boolean;
}) => {
  return (
    <Stack
      spacing={2}
      py="16px"
      sx={{
        borderBottom: '1px dashed var(--gray-3)',
        fontSize: '16px',
        fontWeight: 600,
        lineHeight: '20px',
      }}
    >
      <Typography
        sx={{
          font: 'inherit',
          color: 'var(--black)',
        }}
      >
        聯絡資訊
      </Typography>

      {address ? (
        <MuiLink
          component={Link}
          href={mapLink(address)}
          target="_blank"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}
        >
          <LocationIcon sx={{ fontSize: 16 }} htmlColor="var(--gray-2)" />
          <Typography
            sx={{
              font: 'inherit',
              fontWeight: 400,
              color: 'var(--secondary)',
            }}
          >
            {address}
          </Typography>
        </MuiLink>
      ) : null}

      {isPhoneDisplayed && phone && (
        <MuiLink
          component={Link}
          href={phoneHref(phone)}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
        >
          <PhoneIcon sx={{ fontSize: 16 }} htmlColor="var(--gray-2)" />
          <Typography
            sx={{
              font: 'inherit',
              fontWeight: 400,
              color: 'var(--secondary)',
            }}
          >
            {phone}
          </Typography>
        </MuiLink>
      )}
    </Stack>
  );
};

export default memo(ContactInfo);
