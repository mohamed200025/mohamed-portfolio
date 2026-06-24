"use client";

import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { usePricingConfig } from "./PricingConfigProvider";

export function PricingConfigGate({ children }: { children: ReactNode }) {
  const { loading, error } = usePricingConfig();

  if (loading) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        <p className="text-sm text-white/50">Loading pricing configuration…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-6 py-10 text-center">
        <p className="text-sm text-rose-200">{error}</p>
      </div>
    );
  }

  return <>{children}</>;
}
