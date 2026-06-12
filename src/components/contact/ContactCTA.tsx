"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar } from "lucide-react";
import { MagneticButton, ShimmerButton } from "@/components/ui/MagneticButton";
import { fadeUp } from "@/lib/animations";

export function ContactCTA({ calendlyUrl = "" }: { calendlyUrl?: string }) {
  const meetingHref = calendlyUrl.trim() || "#contact";
  const meetingExternal = Boolean(calendlyUrl.trim());

  return (
    <motion.div
      variants={fadeUp}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <ShimmerButton>
        <MagneticButton href="#contact" variant="primary" className="w-full sm:w-auto !px-6 !py-3.5">
          Start a Project
          <ArrowRight className="h-4 w-4" />
        </MagneticButton>
      </ShimmerButton>
      <MagneticButton
        href={meetingHref}
        variant="secondary"
        className="w-full sm:w-auto !px-6 !py-3.5"
        external={meetingExternal}
      >
        <Calendar className="h-4 w-4" />
        Schedule a Meeting
      </MagneticButton>
    </motion.div>
  );
}
