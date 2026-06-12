"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Grid3X3,
  Play,
  Send,
  Star,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { ProjectPageData } from "@/lib/cms/projects";
import { getWebsiteUrl, hasUrl, isExternalUrl } from "@/lib/cms/project-utils";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { ProjectPageNav } from "./ProjectPageNav";
import { getStatIcon } from "./stat-icons";
import { MagneticButton, ShimmerButton } from "@/components/ui/MagneticButton";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      variants={fadeUp}
      className="mb-6 text-2xl font-bold tracking-tight text-white sm:text-3xl"
    >
      {children}
    </motion.h2>
  );
}

export function ProjectDetailsPage({ data }: { data: ProjectPageData }) {
  const { project, prev, next } = data;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryPage, setGalleryPage] = useState(0);

  const gallery = useMemo(() => {
    const fromImages = project.images?.map((i) => i.url) ?? [];
    const fromCms = project.gallery_images ?? [];
    return [...new Set([...fromImages, ...fromCms])].filter(Boolean);
  }, [project.images, project.gallery_images]);

  const websiteUrl = getWebsiteUrl(project);
  const liveDemoUrl = project.live_demo_url?.trim() ?? "";
  const stats = project.statistics ?? [];
  const results = project.results ?? [];
  const challenges = project.challenges ?? [];
  const solutions = project.solutions ?? [];

  const galleryPageSize = 4;
  const galleryPages = Math.max(1, Math.ceil(gallery.length / galleryPageSize));
  const visibleGallery = gallery.slice(
    galleryPage * galleryPageSize,
    galleryPage * galleryPageSize + galleryPageSize
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showLightboxPrev = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i - 1 + gallery.length) % gallery.length : null));
  }, [gallery.length]);
  const showLightboxNext = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % gallery.length : null));
  }, [gallery.length]);

  const hasClientInfo =
    project.client_name || project.industry || project.project_duration || project.project_year;

  return (
    <div className="min-h-screen bg-[#050508] text-white">
      <ProjectPageNav />

      <main className="pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden pb-16 pt-8 md:pb-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.12),transparent)]" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
              <Link
                href="/#projects"
                className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/60 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Link>
            </motion.div>

            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col"
              >
                {project.featured && (
                  <motion.span
                    variants={fadeUp}
                    className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-400"
                  >
                    <Star className="h-3 w-3 fill-current" />
                    Featured Project
                  </motion.span>
                )}
                <motion.h1
                  variants={fadeUp}
                  className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                >
                  {project.title}
                </motion.h1>
                <motion.p variants={fadeUp} className="mb-4 text-lg font-medium text-violet-400">
                  {project.category}
                </motion.p>
                <motion.p variants={fadeUp} className="mb-8 max-w-xl text-base leading-relaxed text-white/50">
                  {project.description}
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                  {hasUrl(websiteUrl) && (
                    <ShimmerButton>
                      <MagneticButton
                        href={websiteUrl}
                        variant="primary"
                        external={isExternalUrl(websiteUrl)}
                        className="!px-6 !py-3.5"
                      >
                        Visit Website
                        <ExternalLink className="h-4 w-4" />
                      </MagneticButton>
                    </ShimmerButton>
                  )}
                  {hasUrl(liveDemoUrl) && (
                    <MagneticButton
                      href={liveDemoUrl}
                      variant="secondary"
                      external={isExternalUrl(liveDemoUrl)}
                      className="!px-6 !py-3.5"
                    >
                      <Play className="h-4 w-4" />
                      Live Demo
                    </MagneticButton>
                  )}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProjectShowcase project={project} priority size="large" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        {stats.length > 0 && (
          <section className="border-y border-white/[0.06] bg-white/[0.02] py-12 md:py-16">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 sm:gap-6 lg:grid-cols-4 lg:px-8">
              {stats.map((stat, i) => {
                const Icon = getStatIcon(stat.icon);
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-md sm:p-6"
                  >
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                      <Icon className="h-5 w-5 text-cyan-400" />
                    </div>
                    <p className="text-2xl font-bold text-white sm:text-3xl">{stat.value}</p>
                    <p className="mt-1 text-sm text-white/50">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Overview + sidebar */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
              <motion.div
                className="lg:col-span-2"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
              >
                <SectionTitle>Project Overview</SectionTitle>
                {project.project_overview && (
                  <motion.p variants={fadeUp} className="mb-8 text-base leading-relaxed text-white/60">
                    {project.project_overview}
                  </motion.p>
                )}
                {project.problem_statement && (
                  <motion.div variants={fadeUp} className="mb-6">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-cyan-400">
                      Problem
                    </h3>
                    <p className="text-base leading-relaxed text-white/55">{project.problem_statement}</p>
                  </motion.div>
                )}
                {project.solution && (
                  <motion.div variants={fadeUp} className="mb-6">
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-violet-400">
                      Solution
                    </h3>
                    <p className="text-base leading-relaxed text-white/55">{project.solution}</p>
                  </motion.div>
                )}
                {project.business_impact && (
                  <motion.div variants={fadeUp}>
                    <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-400">
                      Business Impact
                    </h3>
                    <p className="text-base leading-relaxed text-white/55">{project.business_impact}</p>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {project.features.length > 0 && (
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md">
                    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
                      <Zap className="h-5 w-5 text-cyan-400" />
                      Key Features
                    </h3>
                    <ul className="space-y-3">
                      {project.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2.5 text-sm text-white/70">
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                            <Check className="h-3 w-3 text-cyan-400" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.technologies.length > 0 && (
                  <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md">
                    <h3 className="mb-4 text-lg font-bold text-white">Technologies Used</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <motion.span
                          key={tech}
                          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/70"
                          whileHover={{ scale: 1.05, borderColor: "rgba(34,211,238,0.35)" }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {gallery.length > 0 && (
          <section className="border-t border-white/[0.06] py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <SectionTitle>Project Screenshots</SectionTitle>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {visibleGallery.map((url, i) => {
                  const globalIndex = galleryPage * galleryPageSize + i;
                  return (
                    <motion.button
                      key={url}
                      type="button"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setLightboxIndex(globalIndex)}
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                    >
                      <Image
                        src={url}
                        alt={`${project.title} screenshot ${globalIndex + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                    </motion.button>
                  );
                })}
              </div>
              {galleryPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setGalleryPage((p) => Math.max(0, p - 1))}
                    disabled={galleryPage === 0}
                    className="rounded-lg border border-white/10 p-2 text-white/60 disabled:opacity-30"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex gap-2">
                    {Array.from({ length: galleryPages }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setGalleryPage(i)}
                        className={`h-2 rounded-full transition-all ${
                          i === galleryPage ? "w-6 bg-cyan-400" : "w-2 bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setGalleryPage((p) => Math.min(galleryPages - 1, p + 1))}
                    disabled={galleryPage >= galleryPages - 1}
                    className="rounded-lg border border-white/10 p-2 text-white/60 disabled:opacity-30"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Challenges & Solutions */}
        {(challenges.length > 0 || solutions.length > 0) && (
          <section className="py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="grid gap-8 md:grid-cols-2">
                {challenges.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6 sm:p-8"
                  >
                    <h3 className="mb-6 text-xl font-bold text-white">Challenges</h3>
                    <ul className="space-y-4">
                      {challenges.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/65">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                {solutions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 sm:p-8"
                  >
                    <h3 className="mb-6 text-xl font-bold text-white">Solutions</h3>
                    <ul className="space-y-4">
                      {solutions.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/65">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Results */}
        {results.length > 0 && (
          <section className="border-y border-white/[0.06] bg-white/[0.02] py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <SectionTitle>Results & Outcomes</SectionTitle>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((result, i) => (
                  <motion.div
                    key={result.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
                  >
                    <p className="text-3xl font-bold text-cyan-400">{result.value}</p>
                    <p className="mt-1 font-semibold text-white">{result.label}</p>
                    {result.description && (
                      <p className="mt-2 text-sm text-white/50">{result.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Client info */}
        {hasClientInfo && (
          <section className="py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {project.client_name && (
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
                    <Building2 className="mb-2 h-5 w-5 text-cyan-400" />
                    <p className="text-xs text-white/40">Client</p>
                    <p className="font-semibold text-white">{project.client_name}</p>
                  </div>
                )}
                {project.industry && (
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
                    <Briefcase className="mb-2 h-5 w-5 text-violet-400" />
                    <p className="text-xs text-white/40">Industry</p>
                    <p className="font-semibold text-white">{project.industry}</p>
                  </div>
                )}
                {project.project_duration && (
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
                    <Clock className="mb-2 h-5 w-5 text-blue-400" />
                    <p className="text-xs text-white/40">Duration</p>
                    <p className="font-semibold text-white">{project.project_duration}</p>
                  </div>
                )}
                {project.project_year && (
                  <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5">
                    <Calendar className="mb-2 h-5 w-5 text-amber-400" />
                    <p className="text-xs text-white/40">Year</p>
                    <p className="font-semibold text-white">{project.project_year}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-between gap-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-cyan-500/10 via-transparent to-violet-500/10 p-8 sm:flex-row sm:p-12"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600">
                  <Send className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white sm:text-2xl">
                    Interested in a similar project?
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-white/50">
                    Let&apos;s build something amazing together. I&apos;m available for new opportunities
                    and exciting collaborations.
                  </p>
                </div>
              </div>
              <Link
                href="/#contact"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-3.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition-opacity hover:opacity-90"
              >
                Contact Me
                <Send className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Prev / Next */}
        <section className="border-t border-white/[0.06] py-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8">
            {prev ? (
              <Link
                href={`/projects/${prev.slug}`}
                className="group flex flex-col gap-1 text-left"
              >
                <span className="flex items-center gap-1 text-xs text-white/40">
                  <ArrowLeft className="h-3 w-3" /> Previous Project
                </span>
                <span className="text-sm font-semibold text-white group-hover:text-cyan-400">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            <Link
              href="/#projects"
              className="rounded-lg border border-white/10 p-2.5 text-white/50 transition-colors hover:border-cyan-500/30 hover:text-cyan-400"
              aria-label="All projects"
            >
              <Grid3X3 className="h-5 w-5" />
            </Link>
            {next ? (
              <Link
                href={`/projects/${next.slug}`}
                className="group flex flex-col items-end gap-1 text-right"
              >
                <span className="flex items-center gap-1 text-xs text-white/40">
                  Next Project <ArrowRight className="h-3 w-3" />
                </span>
                <span className="text-sm font-semibold text-white group-hover:text-cyan-400">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      </main>

      {/* Lightbox */}
      {lightboxIndex !== null && gallery[lightboxIndex] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full border border-white/20 p-2 text-white"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showLightboxPrev();
            }}
            className="absolute left-4 rounded-full border border-white/20 p-2 text-white"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div
            className="relative max-h-[85vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={gallery[lightboxIndex]}
              alt={`${project.title} full view`}
              width={1200}
              height={800}
              className="h-auto max-h-[85vh] w-full rounded-xl object-contain"
            />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showLightboxNext();
            }}
            className="absolute right-4 rounded-full border border-white/20 p-2 text-white"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
