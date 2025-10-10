import PageLayout from "@/components/PageLayout";
import AboutUs from "@/features/AboutUs";
import { Metadata } from "next";
import { env } from "@/config/env";

export const generateMetadata = (): Metadata => {
  return {
    title: "關於我們",
    description: "由遠端與在地志工共同打造的資訊系統，整合地圖、需求媒合與配送支援，讓不在現場也能出一份力。",
    openGraph: {
      title: "關於我們",
      description: "由遠端與在地志工共同打造的資訊系統，整合地圖、需求媒合與配送支援，讓不在現場也能出一份力。",
      url: `${env.NEXT_PUBLIC_BASE_URL}/volunteer/about-us`,
      type: "website",
    },
  };
};

export default function VolunteerAboutUsPage() {
  return (
    <PageLayout>
      <AboutUs />
    </PageLayout>
  );
}
