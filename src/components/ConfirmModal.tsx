import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';

export interface ConfirmModalItem {
  name: string;
  count: number;
  unit: string;
}

export interface ConfirmModalStationInfo {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message?: string;
  stationInfo?: ConfirmModalStationInfo;
  items?: ConfirmModalItem[];
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message = '',
  stationInfo,
  items,
  onConfirm,
  onCancel,
  confirmText = '確認',
  cancelText = '取消',
}) => {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {message && <Typography sx={{ mb: 1 }}>{message}</Typography>}

        {stationInfo && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              物資站資訊：
            </Typography>
            <Box
              sx={{
                bgcolor: 'grey.50',
                p: 1,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>名稱：</strong>
                {stationInfo.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>電話：</strong>
                {stationInfo.phone}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <strong>地址：</strong>
                {stationInfo.address}
              </Typography>
              {stationInfo.notes && (
                <Typography variant="body2">
                  <strong>備註：</strong>
                  {stationInfo.notes}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        {items && items.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              物資清單：
            </Typography>
            <List
              dense
              sx={{
                bgcolor: 'background.paper',
                maxHeight: '50vh',
                overflow: 'auto',
              }}
            >
              {items.map((item, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 0.5,
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 500 }}>
                        {item.name} {item.count} {item.unit}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined" color="inherit">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color="success">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmModal;
