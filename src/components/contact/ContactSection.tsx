"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Code2, Link, Mail, MessageCircle } from "lucide-react";
import { TechnologiesBackground } from "@/components/technologies/TechnologiesBackground";
import { ContactCard } from "./ContactCard";
import { ContactCTA } from "./ContactCTA";
import { ContactForm } from "./ContactForm";
import { Footer } from "@/components/layout/Footer";
import { contactMethods as staticContactMethods } from "@/lib/technologies-data";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { defaultContactSettings, defaultSections } from "@/lib/cms/defaults";
import { contactSettingsToMethods, splitContactTitle } from "@/lib/cms/contact-utils";
import type { ContactMethod, ContactSettings } from "@/types/cms";

const iconMap = {
  whatsapp: { icon: MessageCircle, color: staticContactMethods[0].color },
  email: { icon: Mail, color: staticContactMethods[1].color },
  linkedin: { icon: Link, color: staticContactMethods[2].color },
  github: { icon: Code2, color: staticContactMethods[3].color },
};

interface ContactSectionProps {
  contactSettings?: ContactSettings;
  contact?: Record<string, unknown>;
  contactMethods?: ContactMethod[];
  footer?: Record<string, unknown>;
}

export function ContactSection({
  contactSettings = defaultContactSettings,
  contact = defaultSections.contact,
  contactMethods = [],
  footer = defaultSections.footer,
}: ContactSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const badge = (contact.badge as string) ?? "LET'S CONNECT";
  const { prefix: titlePrefix, highlight: titleHighlight } = splitContactTitle(
    contactSettings.contact_title || "Let's Work Together"
  );
  const subtitle = contactSettings.contact_subtitle || (contact.subtitle as string) || "";

  const methods =
    contactMethods.length > 0
      ? contactMethods
      : contactSettingsToMethods(contactSettings);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden pb-0 pt-16 md:pt-24"
    >
      <motion.div style={{ y: backgroundY }} className="absolute inset-0">
        <TechnologiesBackground />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.span
              variants={fadeUp}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-violet-400"
            >
              <Mail className="h-3.5 w-3.5" />
              {badge}
            </motion.span>

            <motion.h2
              variants={fadeUp}
              className="mb-5 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
            >
              {titlePrefix}{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
                {titleHighlight}
              </span>
            </motion.h2>

            {subtitle && (
              <motion.p variants={fadeUp} className="mb-8 max-w-md text-base leading-relaxed text-white/50">
                {subtitle}
              </motion.p>
            )}

            <motion.div variants={fadeUp} className="mb-8 grid grid-cols-2 gap-3 sm:gap-4">
              {methods.map((method) => {
                const meta = iconMap[method.type as keyof typeof iconMap] ?? iconMap.email;
                return (
                  <ContactCard
                    key={method.id}
                    label={method.label}
                    value={method.value}
                    sub={method.subtext ?? ""}
                    href={method.href}
                    icon={meta.icon}
                    color={meta.color}
                  />
                );
              })}
            </motion.div>

            <ContactCTA calendlyUrl={contactSettings.calendly_url} />
          </motion.div>

          <ContactForm />
        </div>

        <Footer links={(footer.links as { label: string; href: string }[]) ?? undefined} />
      </div>
    </section>
  );
}
