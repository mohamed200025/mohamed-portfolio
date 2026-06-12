"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import type { Service } from "@/lib/services-data";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <motion.div
      variants={fadeUp}
      animate={{ y: [0, -4, 0] }}
      transition={{
        y: { duration: 5 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.5 },
      }}
    >
      <motion.div
        className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-md transition-shadow duration-500 sm:p-7 ${service.accent.border} ${service.accent.glow} hover:shadow-xl`}
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div
          className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-b opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${service.accent.gradient}`}
        />

        <div className="relative flex flex-1 flex-col">
          <div className="mb-6 flex items-start justify-between">
            <motion.div
              className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg ${service.accent.iconBg}`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Icon className="h-6 w-6 text-white" />
              <motion.div
                className="absolute inset-0 rounded-xl bg-white/10"
                animate={{ opacity: [0, 0.4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
              />
            </motion.div>
            <span className={`text-2xl font-bold ${service.accent.number}`}>
              {service.number}
            </span>
          </div>

          <h3 className="mb-3 text-lg font-bold text-white">{service.title}</h3>
          <p className="mb-6 text-sm leading-relaxed text-white/45">
            {service.description}
          </p>

          <ul className="mb-8 flex-1 space-y-2.5">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-cyan-500/20">
                  <Check className="h-2.5 w-2.5 text-cyan-400" />
                </div>
                <span className="text-sm text-white/65">{feature}</span>
              </li>
            ))}
          </ul>

          <motion.a
            href="#contact"
            className="group/link inline-flex items-center gap-2 text-sm font-medium text-cyan-400 transition-colors hover:text-cyan-300"
            whileHover={{ x: 4 }}
          >
            Learn More
            <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
          </motion.a>
        </div>
      </motion.div>
    </motion.div>
  );
}
