import PageLayout from "@/components/PageLayout";
import VolunteerInfo from "@/features/VolunteerInfo";
import { Metadata } from "next";
import { env } from "@/config/env";

export const generateMetadata = (): Metadata => {
  return {
    title: "志工資訊 - 交通資訊",
    description: "媒合交通與運輸志工資源，協助災區物資、救護與人員調度，確保行動力與支援效率。",
    openGraph: {
      title: "志工資訊 - 交通資訊",
      description: "媒合交通與運輸志工資源，協助災區物資、救護與人員調度，確保行動力與支援效率。",
      url: `${env.NEXT_PUBLIC_BASE_URL}/volunteer/transportation`,
      type: "website",
    },
  };
};

export default function VolunteerTransportationPage() {
  return (
    <PageLayout>
      <VolunteerInfo initialCategory="交通資訊" />
    </PageLayout>
  );
}
