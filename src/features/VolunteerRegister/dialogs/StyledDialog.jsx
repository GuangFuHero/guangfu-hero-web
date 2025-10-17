'use client';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxHeight: '70%',
    top: '-10%',
  },
}));

export default StyledDialog;
