import Wrapper from '@/features/Wrapper';
import { Metadata } from 'next';
import { env } from '@/config/env';
import { Typography, Container } from '@mui/material';

export const generateMetadata = (): Metadata => {
  return {
    title: '配送媒合',
    description: '登記在地需求並由小蜜蜂配送協助，僅提供當地居民支援與在地配送媒合。',
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      title: '配送媒合',
      description: '登記在地需求並由小蜜蜂配送協助，僅提供當地居民支援與在地配送媒合。',
      url: `${env.NEXT_PUBLIC_BASE_URL}/resources`,
      type: 'website',
    },
  };
};

export default function ResourcesPage() {
  return (
    <Wrapper hideFooter>
      {/*
      // Due to typhoon, close the matching pages temporarily

      <iframe
        src="https://pinkowo.github.io/hualien-bees/"
        className="w-full border-0"
        title="配送媒合"
        allow="geolocation"
        style={{ height: 'calc(100vh - 160px)' }} // header 4 rem + footer 140 px
      /> 
      */}
      <Typography sx={{ textAlign: 'center', lineHeight: 2, mb: 2 }}>
        因風神颱風來襲
        <br />
        政府指示 10/18 禁止志工進入災區。
      </Typography>
      <Typography sx={{ textAlign: 'center', lineHeight: 2, mb: 2 }}>
        本站「配送媒合、志工媒合」功能
        <br />
        於禁令期間亦暫不開放！
      </Typography>
      <Typography sx={{ textAlign: 'center', lineHeight: 2 }}>
        也再次提醒志工禁令期間請勿前往！
      </Typography>
    </Wrapper>
  );
}
