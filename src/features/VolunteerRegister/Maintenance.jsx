'use client';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function Maintenance() {
  return (
    <>
      <Box sx={{ width: '100%', textAlign: 'center', mt: 3 }}>
        <Typography variant="h3" gutterBottom>
          系統維護中
        </Typography>
        <Typography variant="h5">目前系統維護中，造成不便敬請見諒</Typography>
      </Box>
    </>
  );
}
