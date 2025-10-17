'use client';

import { Snackbar, Alert } from '@mui/material';

export default function Toast({ message, onClose }) {
  return (
    <Snackbar
      open={!!message}
      autoHideDuration={2200}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity="info" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
