import PageLayout from "@/components/PageLayout";
import VolunteerInfo from "@/features/VolunteerInfo";
import { Metadata } from "next";
import { env } from "@/config/env";

export const generateMetadata = (): Metadata => {
  return {
    title: "志工資訊 - 行前必讀",
    description: "志工行前指引：裝備建議、藥品補給、安全守則與工具清單，做好準備更安全有效率。",
    openGraph: {
      title: "志工資訊 - 行前必讀",
      description: "志工行前指引：裝備建議、藥品補給、安全守則與工具清單，做好準備更安全有效率。",
      url: `${env.NEXT_PUBLIC_BASE_URL}/volunteer/preparation`,
      type: "website",
    },
  };
};

export default function VolunteerPreparationPage() {
  return (
    <PageLayout>
      <VolunteerInfo initialCategory="行前必讀" />
    </PageLayout>
  );
}
