"use client";

import type { PortfolioData } from "@/types/cms";
import { Hero } from "@/components/hero/Hero";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { AboutSection } from "@/components/about/AboutSection";
import { ServicesSection } from "@/components/services/ServicesSection";
import { TechnologiesSection } from "@/components/technologies/TechnologiesSection";
import { ContactSection } from "@/components/contact/ContactSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

export function PortfolioClient({ data }: { data: PortfolioData }) {
  return (
    <>
      <AnalyticsTracker />
      <main className="bg-black">
        <Hero hero={data.hero} />
        <ProjectsSection
          projects={data.projects}
          projectStats={data.projectStats}
          header={data.sections.projects_header}
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
        <ContactSection
          contact={data.sections.contact}
          contactMethods={data.contactMethods}
          footer={data.sections.footer}
        />
      </main>
    </>
  );
}
