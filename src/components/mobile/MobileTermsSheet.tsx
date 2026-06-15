"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";

const TERMS_ITEMS = [
  "50% advance payment is required before project development begins.",
  "Official invoice is provided for every project.",
  "Free post-launch support and maintenance for 6 months.",
  "The client is entitled to a refund if I fail to deliver according to the agreed project scope and written agreement.",
  "Project timeline, features, and deliverables are clearly defined before development starts.",
  "Continuous communication and progress updates throughout the project.",
];

interface MobileTermsSheetProps {
  open: boolean;
  onClose: () => void;
}

export function MobileTermsSheet({ open, onClose }: MobileTermsSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close terms"
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-sheet-title"
            className="fixed inset-x-0 bottom-0 z-[70] mx-auto max-w-lg px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36 }}
          >
            <div className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-[#0a0a12]/95 shadow-[0_-8px_60px_rgba(6,182,212,0.12)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

              <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 pb-4 pt-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-400/80">
                    Legal
                  </p>
                  <h2 id="terms-sheet-title" className="mt-1 text-lg font-bold text-white">
                    Project Terms & Conditions
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/50 transition-colors active:bg-white/[0.08] active:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <ul className="max-h-[min(60vh,420px)] space-y-4 overflow-y-auto px-5 py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {TERMS_ITEMS.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.15)]">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                    <p className="text-[13px] leading-relaxed text-white/65">{item}</p>
                  </li>
                ))}
              </ul>

              <div className="border-t border-white/[0.06] px-5 py-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex min-h-[48px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(6,182,212,0.25)] transition-transform active:scale-[0.98]"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
