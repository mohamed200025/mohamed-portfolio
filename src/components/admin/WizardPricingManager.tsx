"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchPricingWizardConfigAdmin } from "@/lib/pricing/fetch-config";
import type {
  PricingComplexitySettingRow,
  PricingServiceRow,
  PricingTimelineSettingRow,
  PricingWizardConfig,
  PricingWizardFeatureRow,
  PricingWizardSettings,
} from "@/lib/pricing/wizard-types";
import { AdminFormField, adminInputClass } from "./AdminFormField";
import { Save } from "lucide-react";

type Tab = "settings" | "services" | "features" | "timeline" | "complexity";

const thClass = "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-white/50";
const tdClass = "px-3 py-2 align-middle";
const tableClass = "w-full min-w-[720px] border-collapse text-sm";
const cardClass = "rounded-xl border border-white/10 bg-white/[0.02] p-4";

function numInput(value: number) {
  return Number.isFinite(value) ? value : 0;
}

export function WizardPricingManager() {
  const [tab, setTab] = useState<Tab>("settings");
  const [config, setConfig] = useState<PricingWizardConfig | null>(null);
  const [settings, setSettings] = useState<PricingWizardSettings | null>(null);
  const [services, setServices] = useState<PricingServiceRow[]>([]);
  const [features, setFeatures] = useState<PricingWizardFeatureRow[]>([]);
  const [timelines, setTimelines] = useState<PricingTimelineSettingRow[]>([]);
  const [complexityLevels, setComplexityLevels] = useState<PricingComplexitySettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalProposals: 0,
    averageValue: 0,
    topService: "—",
    topCurrency: "—",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const data = await fetchPricingWizardConfigAdmin(supabase);

    if (!data) {
      setError(
        "Pricing CMS tables not found. Paste supabase/migrations/20250624_pricing_wizard_cms.sql into Supabase SQL Editor and run it.",
      );
      setLoading(false);
      return;
    }

    setConfig(data);
    setSettings(data.settings);
    setServices(data.services);
    setFeatures(data.features);
    setTimelines(data.timelines);
    setComplexityLevels(data.complexityLevels);

    const { data: proposals } = await supabase
      .from("pricing_proposals")
      .select("final_price, currency, selected_services");

    const rows = proposals ?? [];
    const serviceCounts = new Map<string, number>();
    const currencyCounts = new Map<string, number>();
    let sum = 0;

    for (const row of rows) {
      sum += Number(row.final_price) || 0;
      const cur = String(row.currency ?? "DZD");
      currencyCounts.set(cur, (currencyCounts.get(cur) ?? 0) + 1);
      const servicesJson = row.selected_services;
      if (Array.isArray(servicesJson)) {
        for (const item of servicesJson) {
          const id = typeof item === "object" && item && "id" in item ? String(item.id) : "";
          const label =
            typeof item === "object" && item && "label" in item ? String(item.label) : id;
          if (label) serviceCounts.set(label, (serviceCounts.get(label) ?? 0) + 1);
        }
      }
    }

    const topService =
      [...serviceCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const topCurrency =
      [...currencyCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    setStats({
      totalProposals: rows.length,
      averageValue: rows.length ? Math.round(sum / rows.length) : 0,
      topService,
      topCurrency,
    });

    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "settings", label: "Exchange Rates" },
    { id: "services", label: "Services" },
    { id: "features", label: "Features" },
    { id: "timeline", label: "Timeline" },
    { id: "complexity", label: "Complexity" },
  ];

  const saveSettings = async () => {
    if (!settings) return;
    setSaving(true);
    const supabase = createClient();
    const { error: saveError } = await supabase.from("pricing_settings").upsert({
      id: 1,
      usd_to_dzd: settings.usd_to_dzd,
      eur_to_dzd: settings.eur_to_dzd,
      default_currency: "DZD",
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (saveError) setError(saveError.message);
    else {
      setMessage("Exchange rates saved.");
      void load();
    }
  };

  const saveServices = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error: saveError } = await supabase.from("pricing_services").upsert(
      services.map((s) => ({
        ...s,
        updated_at: new Date().toISOString(),
      })),
    );
    setSaving(false);
    if (saveError) setError(saveError.message);
    else {
      setMessage("Services saved.");
      void load();
    }
  };

  const saveFeatures = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error: saveError } = await supabase.from("pricing_features").upsert(
      features.map((f) => ({
        ...f,
        updated_at: new Date().toISOString(),
      })),
    );
    setSaving(false);
    if (saveError) setError(saveError.message);
    else {
      setMessage("Features saved.");
      void load();
    }
  };

  const saveTimelines = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error: saveError } = await supabase.from("pricing_timeline_options").upsert(
      timelines.map((t) => ({
        ...t,
        updated_at: new Date().toISOString(),
      })),
    );
    setSaving(false);
    if (saveError) setError(saveError.message);
    else {
      setMessage("Timeline settings saved.");
      void load();
    }
  };

  const saveComplexity = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error: saveError } = await supabase.from("pricing_complexity_options").upsert(
      complexityLevels.map((c) => ({
        ...c,
        updated_at: new Date().toISOString(),
      })),
    );
    setSaving(false);
    if (saveError) setError(saveError.message);
    else {
      setMessage("Complexity settings saved.");
      void load();
    }
  };

  const statCards = useMemo(
    () => [
      { label: "Total proposals", value: String(stats.totalProposals) },
      { label: "Average proposal value", value: String(stats.averageValue) },
      { label: "Most selected service", value: stats.topService },
      { label: "Most selected currency", value: stats.topCurrency },
    ],
    [stats],
  );

  if (loading) {
    return <p className="text-sm text-white/50">Loading pricing CMS…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className={cardClass}>
            <p className="text-xs uppercase tracking-wider text-white/40">{card.label}</p>
            <p className="mt-2 text-xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          {message}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-cyan-500/15 text-cyan-300"
                : "bg-white/[0.04] text-white/60 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "settings" && settings && (
        <div className={cardClass}>
          <h2 className="mb-4 text-lg font-semibold text-white">Currency Exchange Rates</h2>
          <p className="mb-4 text-sm text-white/45">
            Default currency is <strong className="text-white">DZD</strong>. Rates express how many
            DZD equal 1 USD or 1 EUR.
          </p>
          <div className="grid max-w-lg gap-4 sm:grid-cols-2">
            <AdminFormField label="USD → DZD rate">
              <input
                type="number"
                className={adminInputClass}
                value={settings.usd_to_dzd}
                onChange={(e) =>
                  setSettings({ ...settings, usd_to_dzd: numInput(Number(e.target.value)) })
                }
              />
            </AdminFormField>
            <AdminFormField label="EUR → DZD rate">
              <input
                type="number"
                className={adminInputClass}
                value={settings.eur_to_dzd}
                onChange={(e) =>
                  setSettings({ ...settings, eur_to_dzd: numInput(Number(e.target.value)) })
                }
              />
            </AdminFormField>
          </div>
          <button
            type="button"
            disabled={saving}
            onClick={() => void saveSettings()}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            Save rates
          </button>
        </div>
      )}

      {tab === "services" && (
        <div className={cardClass}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Pricing Services</h2>
            <button
              type="button"
              disabled={saving}
              onClick={() => void saveServices()}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr className="border-b border-white/10">
                  <th className={thClass}>Service</th>
                  <th className={thClass}>DZD</th>
                  <th className={thClass}>EUR</th>
                  <th className={thClass}>USD</th>
                  <th className={thClass}>Active</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={service.id} className="border-b border-white/[0.06]">
                    <td className={tdClass}>
                      <input
                        className={adminInputClass}
                        value={service.name}
                        onChange={(e) => {
                          const next = [...services];
                          next[index] = { ...service, name: e.target.value };
                          setServices(next);
                        }}
                      />
                    </td>
                    {(["price_dzd", "price_eur", "price_usd"] as const).map((field) => (
                      <td key={field} className={tdClass}>
                        <input
                          type="number"
                          className={adminInputClass}
                          value={service[field]}
                          onChange={(e) => {
                            const next = [...services];
                            next[index] = { ...service, [field]: numInput(Number(e.target.value)) };
                            setServices(next);
                          }}
                        />
                      </td>
                    ))}
                    <td className={tdClass}>
                      <input
                        type="checkbox"
                        checked={service.active}
                        onChange={(e) => {
                          const next = [...services];
                          next[index] = { ...service, active: e.target.checked };
                          setServices(next);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "features" && (
        <div className={cardClass}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Pricing Features</h2>
            <button
              type="button"
              disabled={saving}
              onClick={() => void saveFeatures()}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr className="border-b border-white/10">
                  <th className={thClass}>Feature</th>
                  <th className={thClass}>DZD</th>
                  <th className={thClass}>EUR</th>
                  <th className={thClass}>USD</th>
                  <th className={thClass}>Active</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={feature.id} className="border-b border-white/[0.06]">
                    <td className={tdClass}>
                      <input
                        className={adminInputClass}
                        value={feature.name}
                        onChange={(e) => {
                          const next = [...features];
                          next[index] = { ...feature, name: e.target.value };
                          setFeatures(next);
                        }}
                      />
                    </td>
                    {(["price_dzd", "price_eur", "price_usd"] as const).map((field) => (
                      <td key={field} className={tdClass}>
                        <input
                          type="number"
                          className={adminInputClass}
                          value={feature[field]}
                          onChange={(e) => {
                            const next = [...features];
                            next[index] = { ...feature, [field]: numInput(Number(e.target.value)) };
                            setFeatures(next);
                          }}
                        />
                      </td>
                    ))}
                    <td className={tdClass}>
                      <input
                        type="checkbox"
                        checked={feature.active}
                        onChange={(e) => {
                          const next = [...features];
                          next[index] = { ...feature, active: e.target.checked };
                          setFeatures(next);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "timeline" && (
        <div className={cardClass}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Timeline Multipliers</h2>
            <button
              type="button"
              disabled={saving}
              onClick={() => void saveTimelines()}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
          <div className="space-y-3">
            {timelines.map((timeline, index) => (
              <div
                key={timeline.id}
                className="grid gap-3 rounded-lg border border-white/[0.06] p-3 md:grid-cols-[1fr_120px_80px]"
              >
                <div>
                  <p className="font-medium text-white">{timeline.name}</p>
                  <p className="text-xs text-white/40">{timeline.description}</p>
                </div>
                <AdminFormField label="Multiplier">
                  <input
                    type="number"
                    step="0.1"
                    className={adminInputClass}
                    value={timeline.multiplier}
                    onChange={(e) => {
                      const next = [...timelines];
                      next[index] = { ...timeline, multiplier: numInput(Number(e.target.value)) };
                      setTimelines(next);
                    }}
                  />
                </AdminFormField>
                <label className="flex items-center gap-2 self-end text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={timeline.active}
                    onChange={(e) => {
                      const next = [...timelines];
                      next[index] = { ...timeline, active: e.target.checked };
                      setTimelines(next);
                    }}
                  />
                  Active
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "complexity" && (
        <div className={cardClass}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-white">Complexity Multipliers</h2>
            <button
              type="button"
              disabled={saving}
              onClick={() => void saveComplexity()}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save
            </button>
          </div>
          <div className="space-y-3">
            {complexityLevels.map((level, index) => (
              <div
                key={level.id}
                className="grid gap-3 rounded-lg border border-white/[0.06] p-3 md:grid-cols-2"
              >
                <AdminFormField label="Level">
                  <input
                    className={adminInputClass}
                    value={level.name}
                    onChange={(e) => {
                      const next = [...complexityLevels];
                      next[index] = { ...level, name: e.target.value };
                      setComplexityLevels(next);
                    }}
                  />
                </AdminFormField>
                <AdminFormField label="Price multiplier">
                  <input
                    type="number"
                    step="0.1"
                    className={adminInputClass}
                    value={level.price_multiplier}
                    onChange={(e) => {
                      const next = [...complexityLevels];
                      next[index] = {
                        ...level,
                        price_multiplier: numInput(Number(e.target.value)),
                      };
                      setComplexityLevels(next);
                    }}
                  />
                </AdminFormField>
              </div>
            ))}
          </div>
        </div>
      )}

      {!config && (
        <p className="text-sm text-white/50">
          No wizard pricing configuration loaded.
        </p>
      )}
    </div>
  );
}
