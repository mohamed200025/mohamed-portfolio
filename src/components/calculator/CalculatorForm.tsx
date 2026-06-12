"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, Clock, Send } from "lucide-react";
import type { PricingData } from "@/types/cms";
import { calculatePricingEstimate, formatPriceRange } from "@/lib/cms/pricing-utils";
import { getIcon } from "@/lib/icons";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { CalculatorEstimatePanel } from "./CalculatorEstimatePanel";

interface CalculatorFormProps {
  data: PricingData;
  projectTypeId: string;
  featureIds: string[];
  timelineId: string;
  currencyCode: string;
  onProjectTypeChange: (id: string) => void;
  onFeatureToggle: (id: string) => void;
  onTimelineChange: (id: string) => void;
  onCurrencyChange: (code: string) => void;
}

export function CalculatorForm({
  data,
  projectTypeId,
  featureIds,
  timelineId,
  currencyCode,
  onProjectTypeChange,
  onFeatureToggle,
  onTimelineChange,
  onCurrencyChange,
}: CalculatorFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const enabledCurrencies = data.currencies.filter((c) => c.enabled);

  const estimate = useMemo(
    () => calculatePricingEstimate(data, projectTypeId, featureIds, timelineId, currencyCode),
    [data, projectTypeId, featureIds, timelineId, currencyCode]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/pricing-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          whatsapp: whatsapp.trim() || null,
          project_type: estimate.projectTypeTitle,
          estimated_min: estimate.estimateMin,
          estimated_max: estimate.estimateMax,
          currency: currencyCode,
          message: [
            description.trim(),
            estimate.timelineTitle ? `Timeline: ${estimate.timelineTitle}` : "",
            estimate.selectedFeatures.length
              ? `Features: ${estimate.selectedFeatures.map((f) => f.title).join(", ")}`
              : "",
            `Complexity: ${estimate.complexityLabel}`,
          ].filter(Boolean).join("\n") || null,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setName("");
      setEmail("");
      setWhatsapp("");
      setDescription("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-6">
      {enabledCurrencies.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {enabledCurrencies.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => onCurrencyChange(c.code)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                currencyCode === c.code
                  ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-400"
                  : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20"
              }`}
            >
              {c.code} ({c.symbol})
            </button>
          ))}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-10">
          <motion.div variants={fadeUp}>
            <StepHeading number={1} title="Choose Project Type" />
            <div className="grid gap-3 sm:grid-cols-2">
              {data.projectTypes.map((type) => {
                const Icon = getIcon(type.icon);
                const selected = projectTypeId === type.id;
                const price = formatPriceRange(
                  Math.round(Number(type.min_price) * Number(estimate.currency.exchange_rate)),
                  Math.round(Number(type.max_price) * Number(estimate.currency.exchange_rate)),
                  estimate.currency
                );
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => onProjectTypeChange(type.id)}
                    className={`relative rounded-xl border p-4 text-left transition-all ${
                      selected
                        ? "border-cyan-500/50 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                        : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    }`}
                  >
                    {selected && (
                      <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500">
                        <Check className="h-3 w-3 text-white" />
                      </span>
                    )}
                    <Icon className={`mb-3 h-5 w-5 ${selected ? "text-cyan-400" : "text-white/50"}`} />
                    <p className="font-semibold text-white">{type.title}</p>
                    <p className="mt-1 text-xs text-white/45">{type.description}</p>
                    <p className="mt-2 text-sm font-medium text-cyan-400/90">{price}</p>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <StepHeading number={2} title="Select Features" />
            <div className="grid gap-2 sm:grid-cols-2">
              {data.features.map((feature) => {
                const checked = featureIds.includes(feature.id);
                const price = formatPriceRange(
                  Math.round(Number(feature.min_price) * Number(estimate.currency.exchange_rate)),
                  Math.round(Number(feature.max_price) * Number(estimate.currency.exchange_rate)),
                  estimate.currency
                );
                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => onFeatureToggle(feature.id)}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                      checked ? "border-cyan-500/40 bg-cyan-500/10" : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? "border-cyan-500 bg-cyan-500" : "border-white/20"}`}>
                      {checked && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{feature.title}</p>
                      <p className="text-xs text-white/40">{price}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <StepHeading number={3} title="Project Timeline" />
            <div className="grid gap-3 sm:grid-cols-3">
              {data.timelineOptions.map((timeline) => {
                const selected = timelineId === timeline.id;
                const mod = Number(timeline.percentage_modifier);
                const label = mod > 0 ? `+${mod}%` : mod < 0 ? `${mod}%` : "×1.00";
                return (
                  <button
                    key={timeline.id}
                    type="button"
                    onClick={() => onTimelineChange(timeline.id)}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      selected ? "border-violet-500/50 bg-violet-500/10" : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Clock className={`h-4 w-4 ${selected ? "text-violet-400" : "text-white/40"}`} />
                      <span className="text-xs font-medium text-white/50">{label}</span>
                    </div>
                    <p className="font-semibold text-white">{timeline.title}</p>
                    <p className="mt-1 text-xs text-white/45">{label} adjustment</p>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={fadeUp}>
            <StepHeading number={4} title="Request Detailed Quote" />
            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <input required placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/40" />
                <input required type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/40" />
              </div>
              <input placeholder="WhatsApp Number" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/40" />
              <textarea placeholder="Project Description (optional)" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none focus:border-cyan-500/40" />
              {status === "success" && <p className="text-sm text-emerald-400">Quote request sent!</p>}
              {status === "error" && <p className="text-sm text-red-400">Failed to submit. Please try again.</p>}
              <motion.button type="submit" disabled={status === "loading"} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 px-6 py-3.5 text-sm font-medium text-white shadow-lg shadow-blue-500/25 disabled:opacity-50" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Send className="h-4 w-4" />
                {status === "loading" ? "Sending..." : "Request Detailed Quote"}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>

        <CalculatorEstimatePanel estimate={estimate} />
      </div>
    </div>
  );
}

function StepHeading({ number, title }: { number: number; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-xs font-bold text-cyan-400">{number}</span>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
  );
}
