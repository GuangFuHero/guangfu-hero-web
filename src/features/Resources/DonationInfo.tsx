'use client';

import { Divider, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';

const donationLocations = [
  {
    name: '大馬太鞍 - 自救會副主席',
    contact: '',
    phone: '0989091032',
    address: '花蓮縣光復鄉大同村中山路三段84號',
  },
  {
    name: '糖廠「大倉」- 縣府',
    contact: '',
    phone: '0937909124',
    address: '花蓮縣光復鄉糖廠街18號',
  },
  {
    name: '糖廠中央 - 張先生',
    contact: '',
    phone: '0958080620',
    address: '花蓮縣光復鄉糖廠街19號',
  },
];

const DonationInfo: React.FC = () => {
  return (
    <Stack
      flex={1}
      sx={{
        bgcolor: '#D347460D',
        p: '8px 20px',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: 600,
        lineHeight: '15px',
      }}
    >
      <Typography
        sx={{
          font: 'inherit',
          color: 'var(--red)',
          py: '8px',
        }}
      >
        ⚠ 此表單為蜜蜂配給媒合用，捐物資請寄：
      </Typography>
      <Stack divider={<Divider sx={{ borderColor: 'var(--gray-3)' }} />}>
        {donationLocations.map((location, index) => (
          <Stack key={index} direction="row" alignItems="center" flexWrap="wrap" flex={1}>
            <Typography
              color="var(--black)"
              sx={{
                font: 'inherit',
                flex: '1 1 150px',
                maxWidth: '228px',
                py: '8px',
              }}
            >
              {location.name}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              sx={{
                font: 'inherit',
                color: 'var(--gray-2)',
                py: '8px',
                flex: '0 0 auto',
                minWidth: '290px',
              }}
              divider={
                <Divider orientation="vertical" flexItem sx={{ borderColor: 'var(--gray-3)' }} />
              }
            >
              <Typography sx={{ font: 'inherit' }}>{location.phone}</Typography>
              <Typography sx={{ font: 'inherit' }}>{location.address}</Typography>
            </Stack>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default DonationInfo;
