'use client';

import { Card, CardContent, CardActions, Typography, Box, Button, Chip } from '@mui/material';
import CustomProgressBar from './Progress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
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

function getGoogleMapUrl(addr) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('花蓮 ' + addr)}`;
}

function getRemainNumber(need, got) {
  const needNum = parseInt(need);
  const gotNum = parseInt(got);

  return !isNaN(needNum) && !isNaN(gotNum) && needNum > gotNum ? needNum - gotNum : 0;
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
      <Card sx={{ mb: 3, boxShadow: '0px 2px 10px 0px #0000001A', borderRadius: '20px' }}>
        {/* {isRequestCompleted && (
                    <div className="stamp">已完成</div>
                )} */}
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: { xs: 0.5, sm: 1 },
              mb: 1,
              px: 3,
              pt: 2,
              borderBottom: '1px solid #e6e6e6',
            }}
          >
            <Typography variant="h6" sx={{ mb: { xs: 0, sm: 1 } }}>
              {isRequestCompleted && (
                <Chip
                  color="success"
                  label="已完成"
                  sx={{ verticalAlign: 'bottom', marginRight: 1 }}
                />
              )}
              {request.org}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, ml: { sm: 'auto' } }}>
              <Typography
                variant="body2"
                sx={{ marginBottom: 1, color: '#838383', fontSize: '12px' }}
              >
                <AccessTimeIcon sx={{ fontSize: 'inherit', verticalAlign: 'text-top', mr: 1 }} />
                建立於 {dayjs.unix(Number(request.created_at)).format('YYYY-MM-DD HH:mm')}
                {' ('}
                {getRelativeTime(request.created_at)}
                {')'}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ px: 3, pt: 1.5, pb: 2, borderBottom: '1px solid #e6e6e6' }}>
            <Box sx={{ mt: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  size="small"
                  color={getRoleTypeColor(request.role_type, isRequestCompleted)}
                  label={request.role_type}
                  sx={{ mr: 1, borderRadius: '2px', fontSize: '12px' }}
                />
                <Typography variant="body">
                  <b>{request.role_name}</b>
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  pt: 1,
                  pb: 1,
                  mb: 1,
                  fontSize: '14px',
                  borderBottom: '1px dotted #e6e6e6',
                }}
              >
                <Typography variant="body">需要 {request.headcount_need} 人</Typography>
                {isRequestCompleted ? (
                  <Typography variant="body" color="success">
                    已完成
                  </Typography>
                ) : (
                  <Typography variant="body" color="error">
                    尚需 {getRemainNumber(request.headcount_need, request.headcount_got)} 人
                  </Typography>
                )}
              </Box>
            </Box>

            <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 'bold', py: 1 }}>
              聯絡資訊
            </Typography>

            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <svg
                width="14"
                height="17"
                viewBox="0 0 14 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.66667 8.33333C7.125 8.33333 7.51736 8.17014 7.84375 7.84375C8.17014 7.51736 8.33333 7.125 8.33333 6.66667C8.33333 6.20833 8.17014 5.81597 7.84375 5.48958C7.51736 5.16319 7.125 5 6.66667 5C6.20833 5 5.81597 5.16319 5.48958 5.48958C5.16319 5.81597 5 6.20833 5 6.66667C5 7.125 5.16319 7.51736 5.48958 7.84375C5.81597 8.17014 6.20833 8.33333 6.66667 8.33333ZM6.66667 14.4583C8.36111 12.9028 9.61806 11.4896 10.4375 10.2187C11.2569 8.94792 11.6667 7.81944 11.6667 6.83333C11.6667 5.31944 11.184 4.07986 10.2187 3.11458C9.25347 2.14931 8.06944 1.66667 6.66667 1.66667C5.26389 1.66667 4.07986 2.14931 3.11458 3.11458C2.14931 4.07986 1.66667 5.31944 1.66667 6.83333C1.66667 7.81944 2.07639 8.94792 2.89583 10.2187C3.71528 11.4896 4.97222 12.9028 6.66667 14.4583ZM6.66667 16.6667C4.43056 14.7639 2.76042 12.9965 1.65625 11.3646C0.552083 9.73264 0 8.22222 0 6.83333C0 4.75 0.670139 3.09028 2.01042 1.85417C3.35069 0.618056 4.90278 0 6.66667 0C8.43056 0 9.98264 0.618056 11.3229 1.85417C12.6632 3.09028 13.3333 4.75 13.3333 6.83333C13.3333 8.22222 12.7812 9.73264 11.6771 11.3646C10.5729 12.9965 8.90278 14.7639 6.66667 16.6667Z"
                  fill="#838383"
                />
              </svg>

              <Button
                sx={{ textTransform: 'inherit', textDecoration: 'underline', pl: 0 }}
                size="small"
                color="info"
                onClick={() => handleCopyByDomElement(request.address)}
              >
                {request.address}
              </Button>
            </Typography>

            {!isRequestCompleted && (
              <Typography
                variant="body2"
                sx={{ marginBottom: 1, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.125 15C12.3889 15 10.6736 14.6215 8.97917 13.8646C7.28472 13.1076 5.74306 12.0347 4.35417 10.6458C2.96528 9.25694 1.89236 7.71528 1.13542 6.02083C0.378472 4.32639 0 2.61111 0 0.875C0 0.625 0.0833333 0.416667 0.25 0.25C0.416667 0.0833333 0.625 0 0.875 0H4.25C4.44444 0 4.61806 0.0659722 4.77083 0.197917C4.92361 0.329861 5.01389 0.486111 5.04167 0.666667L5.58333 3.58333C5.61111 3.80556 5.60417 3.99306 5.5625 4.14583C5.52083 4.29861 5.44444 4.43056 5.33333 4.54167L3.3125 6.58333C3.59028 7.09722 3.92014 7.59375 4.30208 8.07292C4.68403 8.55208 5.10417 9.01389 5.5625 9.45833C5.99306 9.88889 6.44444 10.2882 6.91667 10.6562C7.38889 11.0243 7.88889 11.3611 8.41667 11.6667L10.375 9.70833C10.5 9.58333 10.6632 9.48958 10.8646 9.42708C11.066 9.36458 11.2639 9.34722 11.4583 9.375L14.3333 9.95833C14.5278 10.0139 14.6875 10.1146 14.8125 10.2604C14.9375 10.4062 15 10.5694 15 10.75V14.125C15 14.375 14.9167 14.5833 14.75 14.75C14.5833 14.9167 14.375 15 14.125 15ZM2.52083 5L3.89583 3.625L3.54167 1.66667H1.6875C1.75694 2.23611 1.85417 2.79861 1.97917 3.35417C2.10417 3.90972 2.28472 4.45833 2.52083 5ZM9.97917 12.4583C10.5208 12.6944 11.0729 12.8819 11.6354 13.0208C12.1979 13.1597 12.7639 13.25 13.3333 13.2917V11.4583L11.375 11.0625L9.97917 12.4583Z"
                    fill="#838383"
                  />
                </svg>
                <span style={{ color: '#179BC6' }}>
                  {request.phone ? request.phone : '(未填寫電話號碼)'}
                </span>
              </Typography>
            )}

            <Box sx={{ pt: 1, backgroundColor: '#F9F8F5', p: 2, mt: 2 }}>
              {request.assignment_notes && (
                <Typography variant="body2" color="#838383" sx={{ fontSize: '14px' }}>
                  備註：<span style={{ color: '#3A3937' }}>{request.assignment_notes}</span>
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>

        {!isRequestCompleted ? (
          <CardActions
            sx={{
              display: 'flex',
              justifyContent: 'center',
              px: 2,
              pt: 2.5,
              pb: 3,
            }}
          >
            {/* <Button variant="outlined" size="small" onClick={() => onEdit(request)} disabled={true}>
              修改需求
            </Button> */}
            <Button
              size="small"
              variant="contained"
              sx={{
                width: { xs: '100%', sm: '240px' },
                maxWidth: '100%',
                backgroundColor: '#F37C0E',
                boxShadow: 'none',
                fontSize: '16px',
                fontWeight: '400',
                borderRadius: '8px',
              }}
              onClick={() => onDelivery(request)}
              disabled={isRequestCompleted}
            >
              我要加入
            </Button>
          </CardActions>
        ) : (
          <CardActions sx={{ px: 2, pt: 2.5, pb: 3 }}>
            <Typography sx={{ m: 1 }} color="primary">
              如仍有需求，請重新點選新增需求
            </Typography>
          </CardActions>
        )}
      </Card>
    </div>
  );
}
