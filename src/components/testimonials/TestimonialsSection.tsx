"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import type { Testimonial } from "@/types/cms";

export function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Testimonials
          </span>
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            What Clients{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Say
            </span>
          </h2>
        </motion.div>

        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={fadeUp}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md"
            >
              <Quote className="mb-4 h-8 w-8 text-cyan-400/40" />
              <p className="mb-4 text-sm leading-relaxed text-white/60">{t.content}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-white/40">
                    {t.role}
                    {t.company && ` · ${t.company}`}
                  </p>
                </div>
                {t.rating && (
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
