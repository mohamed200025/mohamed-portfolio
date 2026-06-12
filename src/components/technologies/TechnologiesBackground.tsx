"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const particles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: ((i * 47 + 11) % 100),
  y: ((i * 67 + 23) % 100),
  size: 1 + (i % 3) * 0.5,
  duration: 18 + (i % 6) * 2,
  delay: (i % 5) * 0.8,
}));

export function TechnologiesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 70, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 70, damping: 22 });

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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0a0a1a_0%,#000000_85%)]" />

        <motion.div
          className="absolute inset-0 opacity-60"
          animate={{
            background: [
              "radial-gradient(ellipse 75% 60% at 30% 25%, rgba(34,211,238,0.09) 0%, transparent 55%), radial-gradient(ellipse 65% 55% at 70% 75%, rgba(139,92,246,0.11) 0%, transparent 50%), radial-gradient(ellipse 50% 45% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 45%)",
              "radial-gradient(ellipse 75% 60% at 40% 35%, rgba(168,85,247,0.08) 0%, transparent 55%), radial-gradient(ellipse 65% 55% at 60% 65%, rgba(34,211,238,0.09) 0%, transparent 50%), radial-gradient(ellipse 50% 45% at 45% 55%, rgba(59,130,246,0.07) 0%, transparent 45%)",
              "radial-gradient(ellipse 75% 60% at 30% 25%, rgba(34,211,238,0.09) 0%, transparent 55%), radial-gradient(ellipse 65% 55% at 70% 75%, rgba(139,92,246,0.11) 0%, transparent 50%), radial-gradient(ellipse 50% 45% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 45%)",
            ],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute left-[20%] top-[10%] h-[500px] w-[500px] rounded-full bg-violet-600/12 blur-[120px]"
          animate={{ x: [0, 50, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[5%] right-[15%] h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[110px]"
          animate={{ x: [0, -40, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        <motion.div
          className="absolute h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/6 blur-[90px]"
          style={{ left: springX, top: springY }}
        />

        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 90% 80% at 50% 50%, black 10%, transparent 80%)",
          }}
        />

        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/30"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            animate={{ y: [0, -28, 0], opacity: [0.05, 0.35, 0.05] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: p.delay,
            }}
          />
        ))}

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)]" />
      </div>
    </div>
  );
}
