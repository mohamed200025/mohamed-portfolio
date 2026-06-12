"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ServicesBackground } from "./ServicesBackground";
import { ServicesHeader } from "./ServicesHeader";
import { ServiceCard } from "./ServiceCard";
import { WhyWorkWithMe } from "./WhyWorkWithMe";
import { CTASection } from "./CTASection";
import { services as defaultServiceCards, benefits as defaultBenefits } from "@/lib/services-data";
import { staggerContainer } from "@/lib/animations";
import { defaultSections } from "@/lib/cms/defaults";

interface ServicesSectionProps {
  services?: Record<string, unknown>;
}

export function ServicesSection({ services = defaultSections.services }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  const cards = (services.cards as typeof defaultServiceCards) ?? defaultServiceCards;
  const benefits = (services.benefits as typeof defaultBenefits) ?? defaultBenefits;
  const cta = services.cta as Record<string, string> | undefined;

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
    >
      <motion.div style={{ y: backgroundY }} className="absolute inset-0">
        <ServicesBackground />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <ServicesHeader services={services} />

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {cards.map((service, index) => (
            <ServiceCard key={service.number} service={service} index={index} />
          ))}
        </motion.div>

        <WhyWorkWithMe benefits={benefits} />
        <CTASection cta={cta} />
      </div>
    </section>
  );
}
