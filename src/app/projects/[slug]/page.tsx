import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectDetailsPage } from "@/components/project-details/ProjectDetailsPage";
import { fetchPortfolioData } from "@/lib/cms/fetch";
import { fetchProjectBySlug } from "@/lib/cms/projects";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchProjectBySlug(slug);
  if (!data) return { title: "Project Not Found" };

  const { project } = data;
  const portfolio = await fetchPortfolioData();

  return {
    title: `${project.title} | ${portfolio.seo.site_title.split("|")[0]?.trim() ?? "Portfolio"}`,
    description: project.description,
    openGraph: {
      title: `${project.title} — Case Study`,
      description: project.project_overview ?? project.description,
      images: project.images?.[0]?.url ? [project.images[0].url] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const [data, portfolio] = await Promise.all([fetchProjectBySlug(slug), fetchPortfolioData()]);

  if (!data) notFound();

  return <ProjectDetailsPage data={data} />;
}
