import { Metadata } from "next";
import { env } from "@/config/env";

export async function generateSiteMetadata(): Promise<Metadata> {
  const metaTitleDefault = "光復超人";
  const metaTitleTemplate = "光復超人 - %s";
  const metaSiteName = "光復超人";
  const metaDescription = "光復超人｜2025 花蓮光復水災資訊整合平台，提供災民支援、物資媒合、志工招募、蜜蜂接送與救災協作服務。";
  const metaAppleMobileWebAppTitle = "光復超人";

  const currentUrl = env.NEXT_PUBLIC_BASE_URL;

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
    title: {
      default: metaTitleDefault,
      template: metaTitleTemplate,
    },
    description: metaDescription,
    authors: [{ name: metaSiteName }],
    creator: metaSiteName,
    publisher: metaSiteName,
    openGraph: {
      siteName: metaSiteName,
      title: metaTitleDefault,
      description: metaDescription,
      url: currentUrl,
      type: "website",
    },
    alternates: {
      canonical: currentUrl,
    },
    appleWebApp: {
      title: metaAppleMobileWebAppTitle,
      capable: true,
      statusBarStyle: "default",
    },
  };
}
