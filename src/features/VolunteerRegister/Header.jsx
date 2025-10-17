'use client';
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function Header({ onCreate }) {
  // 處理點擊事件：先送 GA，再執行原本功能
  const handleCreateClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click_create_button', {
        button_label: '新增人力需求',
        page_path: window.location.pathname, // 記錄目前頁面
        location: 'header', // 可自訂：header / volunteer_page 等
      });
    } else {
      console.log('[GA Debug] click_create_button: 新增人力需求');
    }

    if (onCreate) onCreate();
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h5">志工媒合</Typography>
        </Box>
        <Button variant="contained" onClick={handleCreateClick} startIcon={<AddIcon />}>
          新增人力需求
        </Button>
      </Toolbar>
    </AppBar>
  );
}
