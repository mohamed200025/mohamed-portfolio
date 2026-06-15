"use client";

import { useMemo, useState } from "react";
import { Calculator, Check } from "lucide-react";
import { defaultPricingData } from "@/lib/cms/defaults";
import { calculatePricingEstimate, formatPriceRange } from "@/lib/cms/pricing-utils";
import { getIcon } from "@/lib/icons";
import type { PricingData } from "@/types/cms";

interface MobilePricingPanelProps {
  data?: PricingData;
}

export function MobilePricingPanel({ data = defaultPricingData }: MobilePricingPanelProps) {
  const defaultCurrency =
    data.currencies.find((c) => c.code === data.settings.default_currency && c.enabled) ??
    data.currencies.find((c) => c.enabled) ??
    data.currencies[0];

  const [projectTypeId, setProjectTypeId] = useState(data.projectTypes[0]?.id ?? "");
  const [featureIds, setFeatureIds] = useState<string[]>([]);
  const [timelineId, setTimelineId] = useState(
    data.timelineOptions.find((t) => t.title === "Standard")?.id ?? data.timelineOptions[0]?.id ?? ""
  );
  const [currencyCode, setCurrencyCode] = useState(defaultCurrency?.code ?? "EUR");

  const estimate = useMemo(
    () => calculatePricingEstimate(data, projectTypeId, featureIds, timelineId, currencyCode),
    [data, projectTypeId, featureIds, timelineId, currencyCode]
  );

  const toggleFeature = (id: string) => {
    setFeatureIds((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  };

  const enabledCurrencies = data.currencies.filter((c) => c.enabled);

  return (
    <div className="space-y-5 px-5 pb-6">
      <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 p-5">
        <div className="mb-1 flex items-center gap-2 text-xs text-white/50">
          <Calculator className="h-3.5 w-3.5 text-emerald-400" />
          Estimated range
        </div>
        <p className="text-2xl font-bold text-white">
          {formatPriceRange(estimate.estimateMin, estimate.estimateMax, estimate.currency)}
        </p>
        <p className="mt-1 text-xs text-white/40">{estimate.complexityLabel} · {estimate.timelineTitle}</p>
      </div>

      {enabledCurrencies.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {enabledCurrencies.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => setCurrencyCode(c.code)}
              className={`min-h-[44px] rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                currencyCode === c.code
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : "border-white/10 bg-white/[0.03] text-white/60"
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>
      )}

      <section>
        <h3 className="mb-3 text-sm font-semibold text-white/70">Project type</h3>
        <div className="grid gap-2">
          {data.projectTypes.filter((p) => p.published).map((type) => {
            const Icon = getIcon(type.icon);
            const selected = projectTypeId === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setProjectTypeId(type.id)}
                className={`flex min-h-[52px] items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  selected
                    ? "border-emerald-500/40 bg-emerald-500/10"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${selected ? "text-emerald-400" : "text-white/40"}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">{type.title}</p>
                  <p className="truncate text-xs text-white/40">{type.description}</p>
                </div>
                {selected && <Check className="h-4 w-4 shrink-0 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-white/70">Add-ons</h3>
        <div className="flex flex-wrap gap-2">
          {data.features.filter((f) => f.published).map((feature) => {
            const selected = featureIds.includes(feature.id);
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => toggleFeature(feature.id)}
                className={`min-h-[44px] rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                  selected
                    ? "border-cyan-500/40 bg-cyan-500/15 text-cyan-300"
                    : "border-white/10 bg-white/[0.03] text-white/55"
                }`}
              >
                {feature.title}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-white/70">Timeline</h3>
        <div className="grid gap-2">
          {data.timelineOptions.map((option) => {
            const selected = timelineId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTimelineId(option.id)}
                className={`min-h-[44px] rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                  selected
                    ? "border-violet-500/40 bg-violet-500/10 text-violet-300"
                    : "border-white/10 bg-white/[0.03] text-white/60"
                }`}
              >
                {option.title}
                {option.percentage_modifier !== 0 && (
                  <span className="ml-2 text-xs text-white/35">
                    {option.percentage_modifier > 0 ? "+" : ""}
                    {option.percentage_modifier}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
