'use client';

import { Card, CardContent, CardActions, Typography, Box, Button, Chip } from '@mui/material';
import CustomProgressBar from './Progress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

import RoomIcon from '@mui/icons-material/Room';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import isCompleted from './utils/isCompleted';

function getRelativeTime(timestamp) {
  const now = Date.now(); // 當前時間 (毫秒)
  const diff = now - timestamp * 1000; // 時間差 (毫秒)

  const seconds = Math.floor(diff / 1000); // 時間差（秒）
  const minutes = Math.floor(seconds / 60); // 時間差（分鐘）
  const hours = Math.floor(minutes / 60); // 時間差（小時）
  const days = Math.floor(hours / 24); // 時間差（天）
  const weeks = Math.floor(days / 7); // 時間差（週）
  const months = Math.floor(days / 30); // 時間差（個月）
  const years = Math.floor(days / 365); // 時間差（年）

  if (minutes < 1) {
    if (seconds <= 45) {
      return '剛剛'; // 少於等於 45 秒顯示為 "剛剛"
    } else {
      return '1 分鐘前'; // 超過 45 秒但小於 1 分鐘顯示為 "1 分鐘前"
    }
  }

  if (minutes < 60) {
    return minutes === 1 ? '1 分鐘前' : `${minutes} 分鐘前`;
  }
  if (hours < 24) {
    return hours === 1 ? '1 小時前' : `${hours} 小時前`;
  }
  if (days < 7) {
    return days === 1 ? '1 天前' : `${days} 天前`;
  }
  if (weeks < 4) {
    return weeks === 1 ? '1 週前' : `${weeks} 週前`;
  }
  if (months < 12) {
    return months === 1 ? '1 個月前' : `${months} 個月前`;
  }
  return years === 1 ? '1 年前' : `${years} 年前`;
}

function getAbsoluteTime(timestamp) {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString(undefined, {
    month: '2-digit',
    day: '2-digit',
    hour12: false,
    hour: 'numeric',
  });
}

function getGoogleMapUrl(addr) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('花蓮 ' + addr)}`;
}

export default function RequestCard({ request, onEdit, onDelivery, showToastMsg }) {
  const isRequestCompleted = isCompleted(request);
  const theme = useTheme();
  const isNotPhone = useMediaQuery(theme.breakpoints.up('sm')); //手機以上的螢幕寬度

  function getRoleTypeColor(role_type, is_completed) {
    if (is_completed) return '';

    const TYPE_MAP = {
      一般志工: { tag: '一般', cls: '', order: 5 },
      '清潔/整理': { tag: '清潔/整理', cls: 'primary', order: 0 },
      醫療照護: { tag: '醫療照護', cls: 'error', order: 1 },
      後勤支援: { tag: '後勤支援', cls: 'success', order: 2 },
      專業技術: { tag: '專業技術', cls: 'warning', order: 3 },
      其他: { tag: '其他', cls: '', order: 4 },
    };
    return TYPE_MAP[role_type].cls;
  }

  const handleCopyByDomElement = value => {
    const el = document.createElement('textarea');
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToastMsg('地址資訊已複製到剪貼簿');
  };

  return (
    <div style={{ position: 'relative' }}>
      <Card sx={{ mb: 2 }}>
        {/* {isRequestCompleted && (
                    <div className="stamp">已完成</div>
                )} */}
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {isRequestCompleted && (
              <>
                <Chip color="success" label="已完成" sx={{ verticalAlign: 'bottom' }} />
                &nbsp;&nbsp;
              </>
            )}
            {request.org}
          </Typography>
          <Typography variant="body2">
            <RoomIcon sx={{ fontSize: 'inherit', verticalAlign: 'text-top' }} />
            <Button
              sx={{ textTransform: 'inherit', textDecoration: 'underline' }}
              size="small"
              color="info"
              onClick={() => handleCopyByDomElement(request.address)}
            >
              {request.address}
            </Button>
          </Typography>

          {!isRequestCompleted && (
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              <PersonIcon sx={{ fontSize: 'inherit', verticalAlign: 'text-top', mr: 1 }} />
              {request.phone ? request.phone : '(未填寫電話號碼)'}
            </Typography>
          )}

          {request.created_at === request.updated_at ? (
            <Typography variant="body2" sx={{ marginBottom: 1 }}>
              <AccessTimeIcon sx={{ fontSize: 'inherit', verticalAlign: 'text-top', mr: 1 }} />
              建立於 {dayjs.unix(Number(request.created_at)).format('YYYY-MM-DD HH:mm')} (
              {getRelativeTime(request.created_at)})
            </Typography>
          ) : (
            <>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 'inherit', verticalAlign: 'text-top', mr: 1 }} />
                建立於 {dayjs.unix(Number(request.created_at)).format('YYYY-MM-DD HH:mm')}
              </Typography>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                <AccessTimeIcon sx={{ fontSize: 'inherit', verticalAlign: 'text-top', mr: 1 }} />
                最後更新於 {getRelativeTime(request.updated_at)}
              </Typography>
            </>
          )}

          {request.assignment_notes && (
            <Typography variant="body2" color="text.secondary">
              備註：{request.assignment_notes}
            </Typography>
          )}
          <Box
            sx={{ mt: 1, display: isNotPhone ? 'flex' : 'block', justifyContent: 'space-between' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                size="small"
                color={getRoleTypeColor(request.role_type, isRequestCompleted)}
                label={request.role_type}
                sx={{ mr: 1 }}
              />
              <Typography variant="body">
                <b>{request.role_name}</b>&nbsp;
              </Typography>
            </Box>
            <Box sx={{ mt: isNotPhone ? 0 : 1 }}>
              {!isRequestCompleted ? (
                <>
                  已到位 {request.headcount_got}/{request.headcount_need}
                  {request.headcount_unit}，還需要{' '}
                  <Typography sx={{ display: 'inline-block' }} color="error">
                    {request.headcount_need - request.headcount_got}
                    {request.headcount_unit}
                  </Typography>{' '}
                </>
              ) : (
                <Typography color="success">
                  總共需 {request.headcount_got}
                  {request.headcount_unit}，已全部到位!
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ mt: 1 }}>
            <CustomProgressBar
              percentage={(request.headcount_got / request.headcount_need) * 100}
            />
          </Box>
        </CardContent>
        {!isRequestCompleted ? (
          <CardActions sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="outlined" size="small" onClick={() => onEdit(request)} disabled={true}>
              修改需求
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => onDelivery(request)}
              disabled={isRequestCompleted}
            >
              我要加入
            </Button>
          </CardActions>
        ) : (
          <CardActions>
            <Typography sx={{ m: 1 }} color="primary">
              如仍有需求，請重新點選新增需求
            </Typography>
          </CardActions>
        )}
      </Card>
    </div>
  );
}
