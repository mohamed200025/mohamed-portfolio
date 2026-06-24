"use client";

import type { PortfolioData } from "@/types/cms";
import { Hero } from "@/components/hero/Hero";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { AboutSection } from "@/components/about/AboutSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { TechnologiesSection } from "@/components/technologies/TechnologiesSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { PricingSection } from "@/components/pricing/PricingSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { MobilePortfolio } from "@/components/mobile/MobilePortfolio";
import { PricingConfigProvider } from "@/components/pricing/PricingConfigProvider";

export function PortfolioClient({ data }: { data: PortfolioData }) {
  return (
    <PricingConfigProvider>
      <MobilePortfolio data={data} />
      <main className="hidden bg-black lg:block">
        <Hero hero={data.hero} featuredProject={data.featuredProject} downloadApp={data.downloadApp} />
        <ProjectsSection
          projects={data.projects}
          projectStats={data.projectStats}
          header={data.sections.projects_header}
          apps={data.apps}
        />
        {data.testimonials.length > 0 && (
          <TestimonialsSection testimonials={data.testimonials} />
        )}
        <AboutSection
          about={data.about}
          aboutStatistics={data.aboutStatistics}
          journey={data.journey}
          activeCv={data.activeCv}
        />
        <ServicesSection services={data.sections.services} />
        <TechnologiesSection technologies={data.sections.technologies} />
        <PricingSection />
        <ContactSection
          contactSettings={data.contactSettings}
          contact={data.sections.contact}
          contactMethods={data.contactMethods}
          footer={data.sections.footer}
        />
      </main>
    </PricingConfigProvider>
  );
}
