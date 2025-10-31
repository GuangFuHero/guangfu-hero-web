'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Stack, ThemeProvider, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { getAssetPath } from '@/lib/utils';

const theme = createTheme({
  typography: {
    fontFamily: 'Noto_Sans_TC, sans-serif',
    body1: {
      fontSize: '16px',
      lineHeight: '20px',
      fontWeight: 400,
    },
  },
});

export default function OfflineAnnounce() {
  return (
    <Stack className="text-[var(--gray)] bg-[var(--warning-background)] rounded-xl max-w-[600px] gap-5 m-5 sm:mx-auto px-4 py-6 cursor-default shadow-[0px_2px_10px_0px_rgba(0,0,0,0.1)]">
      <ThemeProvider theme={theme}>
        <Typography sx={{ fontWeight: 500 }}>To: 每一位光復超人</Typography>
        <Typography>
          感謝各地超人們<span className="text-[var(--primary)]"> 10/1 至 10/30 期間至災區援救</span>
          ，協力使災區回到正軌。因應災區第一階段搶救任務告一段落：
        </Typography>

        <Typography>
          <span className="text-[var(--black)] font-[700]">如果您是志工</span>
          <br />
          請至<span className="font-[500]">大馬太鞍活動中心</span>接收現場任務分派
        </Typography>

        <Typography>
          <span className="text-[var(--black)] font-[700]">如果您是居民</span>
          <br />
          需要一般志工請至<span className="font-[500]">大馬太鞍活動中心</span>申請
          <br />
          需要專業志工請至
          <Link
            href="/victim/house-repair"
            className="font-[500] text-[var(--secondary)] mx-1 underline [text-underline-position:from-font]"
          >
            居家修復
          </Link>
          聯繫廠商
        </Typography>

        <Typography>
          平台未來會持續協助在地居民彙整現場所需臨時站點、補助資訊、社福團體等，協助居民回到日常，敬請持續關注！
        </Typography>
        <Stack className="gap-[8px]" alignItems={'flex-end'}>
          <Image src={getAssetPath('/logomark.svg')} alt="logo" width={60} height={40} />
          <Typography className="text-[var(--primary)] text-right" sx={{ fontWeight: 500 }}>
            2025 10/30
            <br />
            光復超人團隊
          </Typography>
        </Stack>
      </ThemeProvider>
    </Stack>
  );
}
