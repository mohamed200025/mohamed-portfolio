"use client";

import { motion } from "framer-motion";

const particles = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  x: ((i * 37 + 13) % 100),
  y: ((i * 53 + 7) % 100),
  size: 1 + (i % 3) * 0.5,
  duration: 18 + (i % 5) * 3,
  delay: (i % 4) * 1.2,
}));

export function SectionBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a0a1a_0%,#000000_70%)]" />

      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{
          background: [
            "radial-gradient(ellipse 70% 50% at 15% 20%, rgba(34,211,238,0.06) 0%, transparent 55%), radial-gradient(ellipse 60% 45% at 85% 80%, rgba(139,92,246,0.08) 0%, transparent 50%)",
            "radial-gradient(ellipse 70% 50% at 25% 30%, rgba(59,130,246,0.07) 0%, transparent 55%), radial-gradient(ellipse 60% 45% at 75% 70%, rgba(34,211,238,0.06) 0%, transparent 50%)",
            "radial-gradient(ellipse 70% 50% at 15% 20%, rgba(34,211,238,0.06) 0%, transparent 55%), radial-gradient(ellipse 60% 45% at 85% 80%, rgba(139,92,246,0.08) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/8 blur-[100px]"
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-violet-600/10 blur-[90px]"
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 75%)",
        }}
      />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/25"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -20, 0], opacity: [0.08, 0.35, 0.08] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
