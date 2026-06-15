"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PortfolioData } from "@/types/cms";
import { MobileProfileHeader } from "./MobileProfileHeader";
import { MobileSegmentTabs, type MobileSegment } from "./MobileSegmentTabs";
import { MobileHorizontalCarousel, MobileCarouselEmpty } from "./MobileHorizontalCarousel";
import { MobileAppShowcaseCard } from "./MobileAppShowcaseCard";
import { MobileProjectShowcaseCard } from "./MobileProjectShowcaseCard";
import { MobileBottomNav, type MobileNavTab } from "./MobileBottomNav";
import { MobileServicesPanel } from "./MobileServicesPanel";
import { MobileTechnologiesPanel } from "./MobileTechnologiesPanel";
import { MobileContactPanel } from "./MobileContactPanel";
import { MobileTermsSheet } from "./MobileTermsSheet";
import { MobileWhatsAppFab } from "./MobileWhatsAppFab";

const sectionTitles: Record<Exclude<MobileNavTab, "home">, string> = {
  projects: "Web Projects",
  technologies: "Technologies",
  services: "Services",
  contact: "Contact",
};

const sectionSubtitles: Record<Exclude<MobileNavTab, "home">, string> = {
  projects: "Full-stack & web applications",
  technologies: "Stack & tools I work with",
  services: "What I can build for you",
  contact: "Let's start a conversation",
};

interface MobilePortfolioProps {
  data: PortfolioData;
}

export function MobilePortfolio({ data }: MobilePortfolioProps) {
  const [navTab, setNavTab] = useState<MobileNavTab>("home");
  const [termsOpen, setTermsOpen] = useState(false);

  const publishedApps = useMemo(
    () => data.apps.filter((app) => app.published).sort((a, b) => a.sort_order - b.sort_order),
    [data.apps]
  );

  const publishedProjects = useMemo(
    () => data.projects.filter((p) => p.published).sort((a, b) => a.sort_order - b.sort_order),
    [data.projects]
  );

  const profileName = data.about.name || data.hero.profile_name || "Mohamed Ournani";
  const profileTitle = "Full Stack & Flutter Developer";
  const profileBio =
    data.about.short_bio ||
    data.hero.description ||
    "I build scalable, high-performance digital solutions that deliver exceptional user experiences across web and mobile platforms.";
  const profilePhoto = data.about.profile_photo_url;
  const cvUrl = data.activeCv?.public_url ?? null;

  const whatsappHref = useMemo(() => {
    const digits = data.contactSettings.whatsapp.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : null;
  }, [data.contactSettings.whatsapp]);

  const handleNavChange = (tab: MobileNavTab) => {
    setTermsOpen(false);
    setNavTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTermsClick = () => {
    setTermsOpen((open) => !open);
  };

  const activeSegment: MobileSegment =
    navTab === "projects" ? "projects" : navTab === "services" ? "services" : "apps";

  const handleSegmentChange = (segment: MobileSegment) => {
    if (segment === "apps") handleNavChange("home");
    else if (segment === "projects") handleNavChange("projects");
    else handleNavChange("services");
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#030306] text-white lg:hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-cyan-500/[0.07] blur-[110px]" />
        <div className="absolute -right-20 top-1/4 h-64 w-64 rounded-full bg-violet-600/[0.06] blur-[100px]" />
        <div className="absolute bottom-40 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-blue-500/[0.05] blur-[90px]" />
      </div>

      <div className="relative mx-auto min-h-[100dvh] max-w-lg pb-[calc(80px+env(safe-area-inset-bottom))]">
        <AnimatePresence mode="wait">
          {navTab === "home" ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MobileProfileHeader
                name={profileName}
                title={profileTitle}
                bio={profileBio}
                photoUrl={profilePhoto}
                cvUrl={cvUrl}
              />

              <MobileSegmentTabs active={activeSegment} onChange={handleSegmentChange} />

              <MobileHorizontalCarousel
                id="mobile-apps"
                className="mt-2"
                title="Featured Apps"
                subtitle="Mobile applications I've built"
              >
                {publishedApps.length > 0 ? (
                  publishedApps.map((app) => <MobileAppShowcaseCard key={app.id} app={app} />)
                ) : (
                  <MobileCarouselEmpty message="No apps published yet." />
                )}
              </MobileHorizontalCarousel>
            </motion.div>
          ) : (
            <motion.div
              key={navTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="pt-[max(1rem,env(safe-area-inset-top))]"
            >
              <header className="px-5 pb-4 pt-4">
                <h1 className="text-xl font-bold text-white">{sectionTitles[navTab]}</h1>
                <p className="mt-1 text-[13px] text-white/40">{sectionSubtitles[navTab]}</p>
              </header>

              {navTab === "projects" && (
                <div className="flex flex-col gap-3 px-5 pb-6">
                  {publishedProjects.length > 0 ? (
                    publishedProjects.map((project) => (
                      <MobileProjectShowcaseCard key={project.id} project={project} fullWidth />
                    ))
                  ) : (
                    <MobileCarouselEmpty message="No projects published yet." />
                  )}
                </div>
              )}

              {navTab === "technologies" && (
                <MobileTechnologiesPanel technologies={data.sections.technologies} />
              )}
              {navTab === "services" && (
                <MobileServicesPanel services={data.sections.services} />
              )}
              {navTab === "contact" && (
                <MobileContactPanel
                  contactSettings={data.contactSettings}
                  contactMethods={data.contactMethods}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileBottomNav
        active={navTab}
        termsOpen={termsOpen}
        onChange={handleNavChange}
        onTermsClick={handleTermsClick}
      />
      <MobileTermsSheet open={termsOpen} onClose={() => setTermsOpen(false)} />
      {whatsappHref && (
        <MobileWhatsAppFab href={whatsappHref} hidden={termsOpen} />
      )}
    </div>
  );
}
