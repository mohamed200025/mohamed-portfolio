"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: ((i * 43 + 17) % 100),
  y: ((i * 61 + 9) % 100),
  size: 1 + (i % 3) * 0.45,
  duration: 17 + (i % 5) * 2.5,
  delay: (i % 4) * 1.1,
}));

export function ServicesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a0a1a_0%,#000000_75%)]" />

        <motion.div
          className="absolute inset-0 opacity-50"
          animate={{
            background: [
              "radial-gradient(ellipse 70% 55% at 25% 20%, rgba(139,92,246,0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 75% 80%, rgba(34,211,238,0.07) 0%, transparent 50%), radial-gradient(ellipse 50% 45% at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 45%)",
              "radial-gradient(ellipse 70% 55% at 35% 30%, rgba(59,130,246,0.07) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 65% 70%, rgba(168,85,247,0.08) 0%, transparent 50%), radial-gradient(ellipse 50% 45% at 55% 45%, rgba(34,211,238,0.06) 0%, transparent 45%)",
              "radial-gradient(ellipse 70% 55% at 25% 20%, rgba(139,92,246,0.08) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 75% 80%, rgba(34,211,238,0.07) 0%, transparent 50%), radial-gradient(ellipse 50% 45% at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 45%)",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute left-[15%] top-[15%] h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[110px]"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[10%] right-[15%] h-[400px] w-[400px] rounded-full bg-cyan-500/8 blur-[100px]"
          animate={{ x: [0, -35, 0], y: [0, 35, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        <motion.div
          className="absolute h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[85px]"
          style={{ left: springX, top: springY }}
        />

        <div
          className="absolute inset-0 opacity-[0.11]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            maskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, black 12%, transparent 78%)",
          }}
        />

        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/25"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -24, 0], opacity: [0.06, 0.32, 0.06] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>
    </div>
  );
}
