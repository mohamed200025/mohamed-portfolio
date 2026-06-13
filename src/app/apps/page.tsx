import type { Metadata } from "next";
import { AppsMarketplace } from "@/components/apps/AppsMarketplace";
import { fetchAllPublishedApps } from "@/lib/cms/apps";
import { fetchPortfolioData } from "@/lib/cms/fetch";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const portfolio = await fetchPortfolioData();
  const siteName = portfolio.seo.site_title.split("|")[0]?.trim() ?? "Portfolio";

  return {
    title: `Mobile Applications | ${siteName}`,
    description: "Browse and download all published applications.",
    openGraph: {
      title: "Mobile Applications",
      description: "Browse and download all published applications.",
    },
  };
}

export default async function AppsPage() {
  const apps = await fetchAllPublishedApps();
  return <AppsMarketplace apps={apps} />;
}
