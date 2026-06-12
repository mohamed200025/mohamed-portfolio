"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { footerLinks as defaultFooterLinks } from "@/lib/technologies-data";

export function Footer({ links = defaultFooterLinks }: { links?: { label: string; href: string }[] }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.footer
      className="relative mt-20 border-t border-white/[0.06] py-10 md:mt-28 md:py-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
        {/* Left */}
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-600 shadow-lg shadow-blue-500/20">
            <span className="text-sm font-bold text-white">MO</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Mohamed Ournani</p>
            <p className="text-xs text-white/40">Full Stack & Flutter Developer</p>
          </div>
        </div>

        {/* Center */}
        <div className="text-center">
          <p className="text-xs text-white/40">
            © 2026 Mohamed Ournani. All rights reserved.
          </p>
          <p className="mt-1 text-[11px] text-white/25">
            Built with Next.js & Tailwind CSS
          </p>
        </div>

        {/* Right nav */}
        <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-5">
          {links.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              className="text-xs text-white/40 transition-colors hover:text-cyan-400"
              whileHover={{ y: -2 }}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>
      </div>

      {/* Back to top */}
      <motion.button
        onClick={scrollToTop}
        className="absolute -top-5 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/60 backdrop-blur-sm transition-colors hover:border-cyan-500/30 hover:text-cyan-400 md:right-6"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Back to top"
      >
        <ArrowUp className="h-4 w-4" />
      </motion.button>
    </motion.footer>
  );
}
