'use client';

import { Box, Typography } from '@mui/material';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <Box textAlign="center" mt={4}>
      <Typography variant="body2" color="text.secondary">
        若您有能力提供物資，請優先以「我要配送」填寫可支援的數量，感謝協助。
      </Typography>
    </Box>
  );
};

export default Footer;
