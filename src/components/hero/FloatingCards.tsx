"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Zap } from "lucide-react";

const cards = [
  {
    icon: TrendingUp,
    label: "Growth",
    value: "+24%",
    color: "from-emerald-400 to-cyan-400",
    position: "top-[8%] -left-[4%]",
    delay: 0,
  },
  {
    icon: Users,
    label: "Students",
    value: "2.8K",
    color: "from-violet-400 to-blue-400",
    position: "bottom-[18%] -right-[2%]",
    delay: 1,
  },
  {
    icon: Zap,
    label: "Uptime",
    value: "99.9%",
    color: "from-amber-400 to-orange-400",
    position: "top-[42%] -right-[6%]",
    delay: 2,
  },
];

export function FloatingCards() {
  return (
    <>
      {cards.map((card) => (
        <motion.div
          key={card.label}
          className={`absolute ${card.position} z-30 hidden rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 backdrop-blur-xl lg:block`}
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 5 + card.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: card.delay,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${card.color}`}>
              <card.icon className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <p className="text-[9px] text-white/50">{card.label}</p>
              <p className="text-xs font-bold text-white">{card.value}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
}
