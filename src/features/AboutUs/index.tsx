'use client';

import TeamGroup from '@/components/TeamGroup';
import { teamMembers } from './constants';
import { Typography, Stack } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { getAssetPath } from '@/lib/utils';

const SectionHeader = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h4" fontWeight={600} textAlign="center" sx={{ my: 2 }}>
    {children}
  </Typography>
);

const IconLink = ({ path, alt, href }: { path: string; alt: string; href: string }) => (
  <Link href={href} passHref target="_blank" rel="noopener noreferrer">
    <Image
      src={getAssetPath(path)}
      alt={alt}
      width={40}
      height={40}
      className="transition-all duration-200 hover:[filter:invert(60%)_sepia(80%)_saturate(6000%)_hue-rotate(10deg)_brightness(100%)_contrast(95%)]"
    />
  </Link>
);

export default function AboutUs() {
  return (
    <Stack gap={4}>
      <Stack sx={{ py: 2 }}>
        <SectionHeader>關於我們</SectionHeader>
        <Stack gap={2} sx={{ fontSize: 16 }} className="text-[var(--text-black)]">
          <Typography>
            許多人能親自前往災區成為志工，
            而我們，是一群無法親臨現場，卻同樣想為這片土地盡一份力的「遠端志工」、「鍵盤志工」。
            我們用彼此的專業與行動，在線上建立出一套能支援現場的資訊系統——「光復超人」。
          </Typography>
          <Typography>
            這個平台的誕生，源自於一個簡單的信念：
            即使不在現場，我們仍能彼此連結，一起伸出手，讓力量匯聚成擁抱。
          </Typography>
          <Typography>目前，我們已推出多項功能：</Typography>
          <Typography>
            🧭
            志工指引：為新手志工整理了行前資訊，包括報到方式、交通概況、裝備建議，以及可加入的團隊與在地社群。
          </Typography>
          <Typography>
            🗺️ 志工地圖：整合災區的醫療站、物資站、廁所等地點，讓志工能更快熟悉現場環境。
          </Typography>
          <Typography>
            💬 需求媒合頁面：居民可直接登錄需求，志工能即時查看並前往支援，讓協助更有效率。
          </Typography>
          <Typography>
            🐝
            小蜜蜂配給系統：由騎車志工組成的「小蜜蜂」團隊負責物資配送。居民填寫需求後，小蜜蜂即可前往物資站領取並親自送達。
          </Typography>
          <Typography>
            我們的團隊來自各地，日夜接力開發，只為讓資訊更即時、協作更順暢。
            救災不只是短暫的行動，而是一場持續的接力。
          </Typography>
          <Typography>
            本平台不隸屬於任何政府、民間團體，由熱心民眾齊心成立、普及災區資訊。
          </Typography>
          <Typography
            variant="h4"
            fontWeight={600}
            textAlign="center"
            className="text-[var(--primary)]"
            sx={{ mt: 2 }}
          >
            無論在哪裡，都能成為光復的超人。
          </Typography>
        </Stack>
      </Stack>

      <Stack>
        <SectionHeader>追蹤我們</SectionHeader>
        <Stack gap={2} direction="row" justifyContent="center" className="text-[var(--text-black)]">
          <IconLink
            path="/thread_logo.svg"
            alt="thread"
            href="https://www.threads.com/@gunangfu250927"
          />
          <IconLink
            path="/youtube_logo.svg"
            alt="thread"
            href="https://www.youtube.com/@%E5%85%89%E5%BE%A9%E8%B6%85%E4%BA%BAGuangFuHero"
          />
          <IconLink path="/line_logo.svg" alt="thread" href="line://ti/p/@hreco" />
        </Stack>
      </Stack>

      <Stack>
        <SectionHeader>團隊成員</SectionHeader>
        <Stack gap={2} sx={{ fontSize: 16 }} className="text-[var(--text-black)]">
          <Typography>
            感謝所有為了讓系統能全天運作、資訊不中斷而付出的每一位「接力超人」！
          </Typography>
          <div className="space-y-[10px]">
            {teamMembers.map(member => (
              <TeamGroup
                key={member.id}
                groupName={member.groupName}
                personNames={member.personNames}
              />
            ))}
          </div>
          <Typography>以及其他所有不願具名卻也默默地和我們一起完成任務的志工朋友！</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
