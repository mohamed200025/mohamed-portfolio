"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { footerLinks as defaultFooterLinks } from "@/lib/technologies-data";

export function Footer({ links = defaultFooterLinks }: { links?: { label: string; href: string }[] }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      className="relative mt-10 border-t border-white/[0.06] py-6 md:mt-12 md:py-7"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-wrap items-center justify-center gap-6 md:flex-nowrap md:justify-between">
        <div className="flex flex-wrap items-center justify-center gap-6 md:flex-nowrap">
          <BrandLogo
            href="#home"
            imageClassName="h-[50px] sm:h-[55px] md:h-[60px]"
          />

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {links.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="text-xs text-white/40 transition-colors hover:text-cyan-400"
                whileHover={{ y: -1 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>
        </div>

        <p className="shrink-0 text-center text-xs text-white/40 md:text-right">
          © 2026 Mohamed Ournani. All rights reserved.
        </p>
      </div>

      <motion.button
        onClick={scrollToTop}
        className="absolute -top-4 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 backdrop-blur-sm transition-colors hover:border-cyan-500/30 hover:text-cyan-400 md:right-0"
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Back to top"
      >
        <ArrowUp className="h-3.5 w-3.5" />
      </motion.button>
    </motion.footer>
  );
}
