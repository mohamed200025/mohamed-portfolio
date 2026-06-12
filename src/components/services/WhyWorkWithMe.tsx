"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { benefits as defaultBenefits } from "@/lib/services-data";

export function WhyWorkWithMe({ benefits = defaultBenefits }: { benefits?: typeof defaultBenefits }) {
  return (
    <motion.div
      className="relative mt-16 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md sm:p-8 md:mt-20 md:p-10"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-500/5 via-transparent to-cyan-500/5" />

      <h3 className="relative mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
        Why Work With Me?
      </h3>

      <motion.div
        className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-6"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {benefits.map((benefit, i) => (
          <motion.div
            key={benefit.title}
            variants={fadeUp}
            className="group flex flex-col items-center text-center"
            animate={{ y: [0, -3, 0] }}
            transition={{
              y: { duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 },
            }}
            whileHover={{ y: -6, scale: 1.05 }}
          >
            <motion.div
              className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.bg} border border-white/[0.06] transition-shadow duration-300 group-hover:shadow-lg group-hover:shadow-cyan-500/10`}
              whileHover={{ scale: 1.1 }}
            >
              <benefit.icon className={`h-5 w-5 ${benefit.color}`} />
            </motion.div>
            <p className="text-sm font-semibold text-white">{benefit.title}</p>
            <p className="mt-0.5 text-[11px] text-white/40">{benefit.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
