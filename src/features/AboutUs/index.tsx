'use client';

import TeamGroup from '@/components/TeamGroup';
import { teamMembers, onSiteVolunteers } from './constants';
import { Typography, Stack } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { getAssetPath } from '@/lib/utils';
import ShareAction from '@/components/ShareAction';

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
      width={33}
      height={32}
      style={{ width: '40px', height: 'auto' }}
      className="transition-all duration-200 hover:[filter:invert(60%)_sepia(80%)_saturate(6000%)_hue-rotate(10deg)_brightness(100%)_contrast(95%)]"
    />
  </Link>
);

export default function AboutUs() {
  return (
    <Stack gap={4} sx={{ marginBottom: 4 }}>
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

          <div style={{ height: '10px' }}></div>

          <Typography>🏡 新功能（居民導向）</Typography>
          <Typography>補助資訊：整理各項災後補助與申請流程</Typography>
          <Typography>居家修繕指南：提供維修與重建的資源與聯絡資訊</Typography>
          <Typography>
            心理資源：無論是文字、電話或視訊，都有人可以傾聽與支持，適合居民和志工使用
          </Typography>
          <Typography>光復站點：整合醫療、物資、庇護所等必要資源</Typography>

          <Typography>----</Typography>

          <Typography>🧭 已關閉功能</Typography>
          <Typography>隨著災區從緊急階段變成重建階段，已經將部分功能關閉</Typography>
          <Typography>
            志工指引：行前資訊、報到方式、交通概況、裝備建議，以及可加入的團隊與在地社群
          </Typography>
          <Typography>志工地圖：整合醫療站、物資站、廁所等地點</Typography>
          <Typography>志工媒合頁面：居民可登錄需求，志工即時查看並支援</Typography>
          <Typography>小蜜蜂配給系統：志工領取物資並送達居民手中</Typography>

          <div style={{ height: '10px' }}></div>

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
          <IconLink path="/line_logo.svg" alt="line" href="line://ti/p/@hreco" />
          <IconLink
            path="/instagram_logo.svg"
            alt="instagram"
            href="https://www.instagram.com/gunangfu250927/"
          />
          <IconLink path="/fb_logo.svg" alt="fb" href="https://www.facebook.com/gunangfu250927" />
          <ShareAction>
            <button className="cursor-pointer" aria-label="分享">
              <Image
                src={getAssetPath('/share.svg')}
                alt="share"
                width={30}
                height={30}
                className="transition-all duration-200 hover:[filter:invert(60%)_sepia(80%)_saturate(6000%)_hue-rotate(10deg)_brightness(100%)_contrast(95%)]"
              />
            </button>
          </ShareAction>
        </Stack>
      </Stack>

      <Stack>
        <SectionHeader>團隊成員</SectionHeader>
        <Stack gap={2} sx={{ fontSize: 16 }} className="text-[var(--text-black)]">
          <Typography align="center">
            感謝一路走來，讓網站全天候運行、支援前線救災而加入的夥伴們，讓網站一直陪伴光復，直到走出陰霾。除了具名者，也有許多不願具名的志工，因為有你們才得以接力下去，完成任務！
          </Typography>
          <Stack gap={2}>
            {teamMembers.map(member => (
              <TeamGroup
                key={member.id}
                groupName={member.groupName}
                personNames={member.personNames}
                additionGroups={member.additionGroups}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>

      <Stack>
        <SectionHeader>前線志工</SectionHeader>
        <Stack gap={2} sx={{ fontSize: 16 }} className="text-[var(--text-black)]">
          <TeamGroup
            groupName={'個人及團隊單位'}
            personNames={onSiteVolunteers}
            additionGroups={[]}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
