"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { services as defaultSkills } from "@/lib/about-data";
import type { Service } from "@/lib/about-data";

export function SkillsGrid({ skills = defaultSkills }: { skills?: Service[] }) {
  return (
    <div className="mt-16 md:mt-24">
      <motion.div
        className="mb-10 flex items-center justify-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <Sparkles className="h-5 w-5 text-cyan-400" />
        <h3 className="text-xl font-bold text-white sm:text-2xl">What I Do</h3>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {skills.map((service) => (
          <motion.div
            key={service.title}
            variants={fadeUp}
            className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md transition-shadow duration-300 hover:shadow-lg ${service.glow}`}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Animated border gradient */}
            <motion.div
              className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${service.gradient}`}
            />

            <div className="relative">
              <motion.div
                className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${service.gradient}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <service.icon className="h-5 w-5 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <h4 className="mb-2 text-base font-bold text-white">{service.title}</h4>
              <p className="text-sm leading-relaxed text-white/45">{service.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
