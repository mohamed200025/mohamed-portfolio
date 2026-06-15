"use client";

import type { PortfolioData } from "@/types/cms";
import { Hero } from "@/components/hero/Hero";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { AboutSection } from "@/components/about/AboutSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { TechnologiesSection } from "@/components/technologies/TechnologiesSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { CalculatorSection } from "@/components/calculator/CalculatorSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { MobilePortfolio } from "@/components/mobile/MobilePortfolio";

export function PortfolioClient({ data }: { data: PortfolioData }) {
  return (
    <>
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
        <CalculatorSection data={data.pricingData} />
        <ContactSection
          contactSettings={data.contactSettings}
          contact={data.sections.contact}
          contactMethods={data.contactMethods}
          footer={data.sections.footer}
        />
      </main>
    </>
  );
}
