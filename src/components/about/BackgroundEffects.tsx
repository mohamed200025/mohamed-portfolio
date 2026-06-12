"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: ((i * 41 + 19) % 100),
  y: ((i * 59 + 11) % 100),
  size: 1 + (i % 3) * 0.4,
  duration: 16 + (i % 6) * 2,
  delay: (i % 5) * 0.9,
}));

export function BackgroundEffects() {
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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#0a0a1a_0%,#000000_80%)]" />

      <motion.div
        className="absolute inset-0 opacity-55"
        animate={{
          background: [
            "radial-gradient(ellipse 65% 55% at 20% 25%, rgba(34,211,238,0.07) 0%, transparent 55%), radial-gradient(ellipse 55% 50% at 80% 75%, rgba(139,92,246,0.09) 0%, transparent 50%), radial-gradient(ellipse 45% 40% at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 45%)",
            "radial-gradient(ellipse 65% 55% at 30% 35%, rgba(59,130,246,0.06) 0%, transparent 55%), radial-gradient(ellipse 55% 50% at 70% 65%, rgba(34,211,238,0.08) 0%, transparent 50%), radial-gradient(ellipse 45% 40% at 45% 55%, rgba(168,85,247,0.06) 0%, transparent 45%)",
            "radial-gradient(ellipse 65% 55% at 20% 25%, rgba(34,211,238,0.07) 0%, transparent 55%), radial-gradient(ellipse 55% 50% at 80% 75%, rgba(139,92,246,0.09) 0%, transparent 50%), radial-gradient(ellipse 45% 40% at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 45%)",
          ],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute left-[10%] top-[20%] h-[420px] w-[420px] rounded-full bg-cyan-500/8 blur-[110px]"
        animate={{ x: [0, 35, 0], y: [0, -25, 0] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[15%] right-[10%] h-[380px] w-[380px] rounded-full bg-violet-600/10 blur-[100px]"
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <motion.div
        className="absolute left-[50%] top-[60%] h-[280px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/6 blur-[90px]"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mouse-reactive spotlight */}
      <motion.div
        className="absolute h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[80px]"
        style={{ left: springX, top: springY }}
      />

      <div
        className="absolute inset-0 opacity-[0.1]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 50%, black 15%, transparent 80%)",
        }}
      />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/25"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -22, 0], opacity: [0.06, 0.3, 0.06] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />
      </div>
    </div>
  );
}
