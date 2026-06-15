"use client";

import { services as defaultServices } from "@/lib/services-data";

interface MobileServicesPanelProps {
  services?: Record<string, unknown>;
  embedded?: boolean;
}

export function MobileServicesPanel({ services = {}, embedded }: MobileServicesPanelProps) {
  const cards = (services.cards as typeof defaultServices) ?? defaultServices;

  return (
    <div className={`space-y-3 ${embedded ? "" : "px-5 pb-6"}`}>
      {cards.map((service) => {
        const Icon = service.icon;
        return (
          <article
            key={service.number}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20">
                <Icon className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white">{service.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-white/45">{service.description}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
