import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppStorePage } from "@/components/apps/AppStorePage";
import { fetchAppBySlug } from "@/lib/cms/apps";
import { fetchPortfolioData } from "@/lib/cms/fetch";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchAppBySlug(slug);
  if (!data) return { title: "App Not Found" };

  const portfolio = await fetchPortfolioData();
  return {
    title: `${data.app.name} | ${portfolio.seo.site_title.split("|")[0]?.trim() ?? "Apps"}`,
    description: data.app.short_description,
    openGraph: {
      title: data.app.name,
      description: data.app.short_description,
      images: data.app.logo_url ? [data.app.logo_url] : undefined,
    },
  };
}

export default async function AppPage({ params }: PageProps) {
  const { slug } = await params;
  const [data, portfolio] = await Promise.all([fetchAppBySlug(slug), fetchPortfolioData()]);
  if (!data) notFound();

  const developer = {
    name: portfolio.about.name || portfolio.hero.profile_name || "Mohamed Ournani",
    title: portfolio.about.job_title || portfolio.hero.profile_title || "Full Stack & Flutter Developer",
    photoUrl: portfolio.about.profile_photo_url,
  };

  return <AppStorePage data={data} developer={developer} />;
}
