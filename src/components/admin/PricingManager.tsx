"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  PricingCurrency,
  PricingFeature,
  PricingProjectType,
  PricingSettings,
  PricingTimelineOption,
} from "@/types/cms";
import { defaultPricingData } from "@/lib/cms/defaults";
import {
  normalizePricingCurrency,
  normalizePricingFeature,
  normalizePricingProjectType,
  normalizePricingSettings,
  normalizePricingTimeline,
} from "@/lib/cms/pricing-normalize";
import { AdminFormField, adminInputClass, adminTextareaClass } from "./AdminFormField";
import { AdminSelect } from "./AdminSelect";
import { Database, Pencil, Plus, Save, Trash2, X } from "lucide-react";

const ICON_OPTIONS = [
  "Globe", "Monitor", "ShoppingCart", "Layers", "Sparkles", "Smartphone",
  "LayoutDashboard", "User", "BookOpen", "Code2", "CreditCard", "Bell", "Search",
];

const thClass = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50";
const tdClass = "px-4 py-3 align-middle";
const tableClass = "w-full min-w-[640px] border-collapse text-sm";
const cardClass = "rounded-xl border border-white/10 bg-white/[0.02]";
const tableCardClass = "overflow-x-auto rounded-xl border border-white/10 bg-white/[0.02]";

export function PricingManager() {
  const [settings, setSettings] = useState<PricingSettings>(defaultPricingData.settings);
  const [currencies, setCurrencies] = useState<PricingCurrency[]>([]);
  const [projectTypes, setProjectTypes] = useState<PricingProjectType[]>([]);
  const [features, setFeatures] = useState<PricingFeature[]>([]);
  const [timelines, setTimelines] = useState<PricingTimelineOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [needsSeed, setNeedsSeed] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();

    const [s, c, p, f, t] = await Promise.all([
      supabase.from("pricing_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("pricing_currencies").select("*").order("sort_order"),
      supabase.from("pricing_project_types").select("*").order("sort_order"),
      supabase.from("pricing_features").select("*").order("sort_order"),
      supabase.from("pricing_timeline_options").select("*").order("sort_order"),
    ]);

    const tableErrors = [c.error, p.error, f.error, t.error].filter(Boolean);
    if (tableErrors.length > 0) {
      setError(
        tableErrors[0]?.message ??
          "Pricing tables not found. Run supabase/migrations/20250614_create_pricing_tables.sql in Supabase."
      );
      setNeedsSeed(true);
    }

    if (s.data) setSettings(normalizePricingSettings(s.data as Record<string, unknown>));

    const loadedCurrencies = ((c.data as Record<string, unknown>[]) ?? []).map(normalizePricingCurrency);
    const loadedProjectTypes = ((p.data as Record<string, unknown>[]) ?? []).map(normalizePricingProjectType);
    const loadedFeatures = ((f.data as Record<string, unknown>[]) ?? []).map(normalizePricingFeature);
    const loadedTimelines = ((t.data as Record<string, unknown>[]) ?? []).map(normalizePricingTimeline);

    setCurrencies(loadedCurrencies);
    setProjectTypes(loadedProjectTypes);
    setFeatures(loadedFeatures);
    setTimelines(loadedTimelines);
    setNeedsSeed(
      !tableErrors.length &&
        (loadedCurrencies.length === 0 ||
          loadedProjectTypes.length === 0 ||
          loadedFeatures.length === 0 ||
          loadedTimelines.length === 0)
    );
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showMessage = (text: string, isError = false) => {
    if (isError) {
      setError(text);
      setMessage("");
    } else {
      setMessage(text);
      setError("");
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    const supabase = createClient();
    const { error: saveError } = await supabase.from("pricing_settings").upsert({
      id: 1,
      badge: settings.badge,
      title_prefix: settings.title_prefix,
      title_highlight: settings.title_highlight,
      subtitle: settings.subtitle,
      default_currency: settings.default_currency,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    showMessage(saveError ? saveError.message : "Section header saved.", Boolean(saveError));
  };

  const setDefaultCurrency = async (code: string) => {
    const next = { ...settings, default_currency: code };
    setSettings(next);
    const supabase = createClient();
    const { error: saveError } = await supabase.from("pricing_settings").upsert({
      id: 1,
      badge: next.badge,
      title_prefix: next.title_prefix,
      title_highlight: next.title_highlight,
      subtitle: next.subtitle,
      default_currency: next.default_currency,
      updated_at: new Date().toISOString(),
    });
    showMessage(saveError ? saveError.message : `Default currency set to ${code}.`, Boolean(saveError));
  };

  const saveCurrency = async (currency: PricingCurrency) => {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      code: currency.code.trim().toUpperCase(),
      symbol: currency.symbol.trim(),
      exchange_rate: Number(currency.exchange_rate) || 1,
      enabled: currency.enabled,
      sort_order: currency.sort_order,
    };

    const { error: saveError } = currency.id.startsWith("new-")
      ? await supabase.from("pricing_currencies").insert(payload)
      : await supabase.from("pricing_currencies").update(payload).eq("id", currency.id);

    setSaving(false);
    if (!saveError) {
      setEditingCurrency(null);
      await load();
    }
    showMessage(saveError ? saveError.message : `${currency.code} saved.`, Boolean(saveError));
  };

  const saveProjectType = async (item: PricingProjectType) => {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      title: item.title.trim(),
      description: item.description.trim(),
      min_price: Number(item.min_price) || 0,
      max_price: Number(item.max_price) || 0,
      icon: item.icon,
      sort_order: Number(item.sort_order) || 0,
      published: item.published,
    };
    const { error: saveError } = item.id.startsWith("new-")
      ? await supabase.from("pricing_project_types").insert(payload)
      : await supabase.from("pricing_project_types").update(payload).eq("id", item.id);

    setSaving(false);
    if (!saveError) await load();
    showMessage(saveError ? saveError.message : "Project type saved.", Boolean(saveError));
  };

  const saveFeature = async (item: PricingFeature) => {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      title: item.title.trim(),
      description: item.description?.trim() ?? "",
      min_price: Number(item.min_price) || 0,
      max_price: Number(item.max_price) || 0,
      icon: item.icon || "Code2",
      sort_order: Number(item.sort_order) || 0,
      published: item.published,
    };
    const { error: saveError } = item.id.startsWith("new-")
      ? await supabase.from("pricing_features").insert(payload)
      : await supabase.from("pricing_features").update(payload).eq("id", item.id);

    setSaving(false);
    if (!saveError) await load();
    showMessage(saveError ? saveError.message : "Feature saved.", Boolean(saveError));
  };

  const saveTimeline = async (item: PricingTimelineOption) => {
    setSaving(true);
    const supabase = createClient();
    const payload = {
      title: item.title.trim(),
      percentage_modifier: Number(item.percentage_modifier) || 0,
      sort_order: Number(item.sort_order) || 0,
      published: item.published,
    };
    const { error: saveError } = item.id.startsWith("new-")
      ? await supabase.from("pricing_timeline_options").insert(payload)
      : await supabase.from("pricing_timeline_options").update(payload).eq("id", item.id);

    setSaving(false);
    if (!saveError) await load();
    showMessage(saveError ? saveError.message : "Timeline option saved.", Boolean(saveError));
  };

  const deleteRow = async (table: string, id: string, label: string) => {
    if (id.startsWith("new-")) {
      if (table === "pricing_project_types") setProjectTypes((rows) => rows.filter((r) => r.id !== id));
      if (table === "pricing_features") setFeatures((rows) => rows.filter((r) => r.id !== id));
      if (table === "pricing_timeline_options") setTimelines((rows) => rows.filter((r) => r.id !== id));
      return;
    }
    if (!confirm(`Delete "${label}"?`)) return;
    const supabase = createClient();
    const { error: deleteError } = await supabase.from(table).delete().eq("id", id);
    if (!deleteError) await load();
    showMessage(deleteError ? deleteError.message : "Deleted.", Boolean(deleteError));
  };

  const seedDefaults = async () => {
    setSeeding(true);
    const supabase = createClient();
    const d = defaultPricingData;

    const { error: settingsError } = await supabase.from("pricing_settings").upsert({
      id: 1,
      badge: d.settings.badge,
      title_prefix: d.settings.title_prefix,
      title_highlight: d.settings.title_highlight,
      subtitle: d.settings.subtitle,
      default_currency: d.settings.default_currency,
      updated_at: new Date().toISOString(),
    });
    if (settingsError) {
      setSeeding(false);
      showMessage(settingsError.message, true);
      return;
    }

    if (currencies.length === 0) {
      const { error: currenciesError } = await supabase.from("pricing_currencies").insert(
        d.currencies.map(({ code, symbol, exchange_rate, enabled, sort_order }) => ({
          code, symbol, exchange_rate, enabled, sort_order,
        }))
      );
      if (currenciesError) {
        setSeeding(false);
        showMessage(currenciesError.message, true);
        return;
      }
    }

    if (projectTypes.length === 0) {
      const { error: typesError } = await supabase.from("pricing_project_types").insert(
        d.projectTypes.map(({ title, description, min_price, max_price, icon, sort_order, published }) => ({
          title, description, min_price, max_price, icon, sort_order, published,
        }))
      );
      if (typesError) {
        setSeeding(false);
        showMessage(typesError.message, true);
        return;
      }
    }

    if (features.length === 0) {
      const { error: featuresError } = await supabase.from("pricing_features").insert(
        d.features.map(({ title, description, min_price, max_price, icon, sort_order, published }) => ({
          title, description, min_price, max_price, icon, sort_order, published,
        }))
      );
      if (featuresError) {
        setSeeding(false);
        showMessage(featuresError.message, true);
        return;
      }
    }

    if (timelines.length === 0) {
      const { error: timelinesError } = await supabase.from("pricing_timeline_options").insert(
        d.timelineOptions.map(({ title, percentage_modifier, sort_order, published }) => ({
          title, percentage_modifier, sort_order, published,
        }))
      );
      if (timelinesError) {
        setSeeding(false);
        showMessage(timelinesError.message, true);
        return;
      }
    }

    setSeeding(false);
    showMessage("Default pricing data initialized.");
    await load();
  };

  const addProjectType = () =>
    setProjectTypes([
      ...projectTypes,
      {
        id: `new-${Date.now()}`,
        title: "",
        description: "",
        min_price: 0,
        max_price: 0,
        icon: "Globe",
        sort_order: projectTypes.length,
        published: true,
      },
    ]);

  const addFeature = () =>
    setFeatures([
      ...features,
      {
        id: `new-${Date.now()}`,
        title: "",
        description: "",
        min_price: 0,
        max_price: 0,
        icon: "Code2",
        sort_order: features.length,
        published: true,
      },
    ]);

  const addTimeline = () =>
    setTimelines([
      ...timelines,
      {
        id: `new-${Date.now()}`,
        title: "",
        percentage_modifier: 0,
        sort_order: timelines.length,
        published: true,
      },
    ]);

  if (loading) return <p className="text-white/50">Loading pricing CMS...</p>;

  return (
    <div className="max-w-6xl space-y-10 pb-12">
      {(error || needsSeed) && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-200">
            {error ||
              "Pricing tables are empty. Initialize default currencies, project types, features, and timelines to get started."}
          </p>
          <button
            type="button"
            onClick={seedDefaults}
            disabled={seeding}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-100 hover:bg-amber-500/30 disabled:opacity-50"
          >
            <Database className="h-4 w-4" />
            {seeding ? "Initializing..." : "Initialize Default Data"}
          </button>
        </div>
      )}

      {/* ── Section Header ── */}
      <AdminSection title="Section Header">
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminFormField label="Badge">
            <input className={adminInputClass} value={settings.badge} onChange={(e) => setSettings({ ...settings, badge: e.target.value })} />
          </AdminFormField>
          <AdminFormField label="Title Prefix">
            <input className={adminInputClass} value={settings.title_prefix} onChange={(e) => setSettings({ ...settings, title_prefix: e.target.value })} />
          </AdminFormField>
          <AdminFormField label="Title Highlight">
            <input className={adminInputClass} value={settings.title_highlight} onChange={(e) => setSettings({ ...settings, title_highlight: e.target.value })} />
          </AdminFormField>
        </div>
        <AdminFormField label="Subtitle">
          <textarea className={adminTextareaClass} rows={2} value={settings.subtitle} onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })} />
        </AdminFormField>
        <ActionButton onClick={saveSettings} disabled={saving} label="Save Header" />
      </AdminSection>

      {/* ── Currencies ── */}
      <AdminSection
        title="Currencies"
        description="Base prices are stored in EUR. Set exchange rates for USD and DZD. Select the default currency shown on the calculator."
      >
        <div className={tableCardClass}>
          <table className={tableClass}>
            <thead className="border-b border-white/10 bg-white/[0.03]">
              <tr>
                <th className={thClass}>Code</th>
                <th className={thClass}>Symbol</th>
                <th className={thClass}>Exchange Rate</th>
                <th className={thClass}>Enabled</th>
                <th className={thClass}>Default</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currencies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-white/40">
                    No currencies yet. Click &quot;Initialize Default Data&quot; above.
                  </td>
                </tr>
              ) : (
                currencies.map((currency, index) => {
                  const editing = editingCurrency === currency.id;
                  return (
                    <tr key={currency.id} className="hover:bg-white/[0.02]">
                      <td className={tdClass}>
                        {editing ? (
                          <input className={adminInputClass} value={currency.code} onChange={(e) => { const n = [...currencies]; n[index] = { ...currency, code: e.target.value }; setCurrencies(n); }} />
                        ) : (
                          <span className="font-medium text-white">{currency.code}</span>
                        )}
                      </td>
                      <td className={tdClass}>
                        {editing ? (
                          <input className={adminInputClass} value={currency.symbol} onChange={(e) => { const n = [...currencies]; n[index] = { ...currency, symbol: e.target.value }; setCurrencies(n); }} />
                        ) : (
                          <span className="text-white/80">{currency.symbol}</span>
                        )}
                      </td>
                      <td className={tdClass}>
                        {editing ? (
                          <input type="number" step="0.01" className={adminInputClass} value={currency.exchange_rate} onChange={(e) => { const n = [...currencies]; n[index] = { ...currency, exchange_rate: Number(e.target.value) }; setCurrencies(n); }} />
                        ) : (
                          <span className="text-white/80">{currency.exchange_rate}</span>
                        )}
                      </td>
                      <td className={tdClass}>
                        <input
                          type="checkbox"
                          checked={currency.enabled}
                          disabled={!editing}
                          onChange={(e) => { const n = [...currencies]; n[index] = { ...currency, enabled: e.target.checked }; setCurrencies(n); }}
                          className="h-4 w-4 rounded border-white/20"
                        />
                      </td>
                      <td className={tdClass}>
                        <input
                          type="radio"
                          name="default_currency"
                          checked={settings.default_currency === currency.code}
                          onChange={() => setDefaultCurrency(currency.code)}
                          className="h-4 w-4"
                        />
                      </td>
                      <td className={`${tdClass} text-right`}>
                        <div className="flex justify-end gap-2">
                          {editing ? (
                            <>
                              <IconButton onClick={() => saveCurrency(currency)} icon={Save} label="Save" variant="save" />
                              <IconButton onClick={() => { setEditingCurrency(null); load(); }} icon={X} label="Cancel" />
                            </>
                          ) : (
                            <IconButton onClick={() => setEditingCurrency(currency.id)} icon={Pencil} label="Edit" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </AdminSection>

      {/* ── Project Types ── */}
      <AdminSection
        title="Project Types"
        description="Define base price ranges in EUR for each project category."
        action={
          <button type="button" onClick={addProjectType} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 px-3 py-1.5 text-xs font-medium text-cyan-400 hover:bg-cyan-500/10">
            <Plus className="h-3.5 w-3.5" /> Add Project Type
          </button>
        }
      >
        <div className="space-y-4">
          {projectTypes.length === 0 ? (
            <EmptyBlock message="No project types yet." />
          ) : (
            projectTypes.map((item, index) => (
              <div key={item.id} className={`${cardClass} p-5`}>
                <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <AdminFormField label="Title">
                    <input className={adminInputClass} value={item.title} onChange={(e) => { const n = [...projectTypes]; n[index] = { ...item, title: e.target.value }; setProjectTypes(n); }} placeholder="Landing Page" />
                  </AdminFormField>
                  <AdminFormField label="Min Price (EUR)">
                    <input type="number" className={adminInputClass} value={item.min_price} onChange={(e) => { const n = [...projectTypes]; n[index] = { ...item, min_price: Number(e.target.value) }; setProjectTypes(n); }} />
                  </AdminFormField>
                  <AdminFormField label="Max Price (EUR)">
                    <input type="number" className={adminInputClass} value={item.max_price} onChange={(e) => { const n = [...projectTypes]; n[index] = { ...item, max_price: Number(e.target.value) }; setProjectTypes(n); }} />
                  </AdminFormField>
                  <AdminFormField label="Description">
                    <input className={adminInputClass} value={item.description} onChange={(e) => { const n = [...projectTypes]; n[index] = { ...item, description: e.target.value }; setProjectTypes(n); }} placeholder="Single page website" />
                  </AdminFormField>
                  <AdminFormField label="Icon">
                    <AdminSelect
                      value={item.icon}
                      onChange={(icon) => {
                        const n = [...projectTypes];
                        n[index] = { ...item, icon };
                        setProjectTypes(n);
                      }}
                      options={ICON_OPTIONS.map((ic) => ({ value: ic, label: ic }))}
                      placeholder="Select icon"
                    />
                  </AdminFormField>
                  <AdminFormField label="Sort Order">
                    <input type="number" className={adminInputClass} value={item.sort_order} onChange={(e) => { const n = [...projectTypes]; n[index] = { ...item, sort_order: Number(e.target.value) }; setProjectTypes(n); }} />
                  </AdminFormField>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <label className="flex items-center gap-2 text-sm text-white/60">
                    <input type="checkbox" checked={item.published} onChange={(e) => { const n = [...projectTypes]; n[index] = { ...item, published: e.target.checked }; setProjectTypes(n); }} />
                    Published on calculator
                  </label>
                  <div className="flex gap-2">
                    <ActionButton onClick={() => saveProjectType(item)} disabled={saving} label="Save" small />
                    <button type="button" onClick={() => deleteRow("pricing_project_types", item.id, item.title)} className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10">
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </AdminSection>

      {/* ── Features ── */}
      <AdminSection
        title="Features"
        description="Add-on features with additional EUR price ranges."
        action={
          <button type="button" onClick={addFeature} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 px-3 py-1.5 text-xs font-medium text-cyan-400 hover:bg-cyan-500/10">
            <Plus className="h-3.5 w-3.5" /> Add Feature
          </button>
        }
      >
        <div className={tableCardClass}>
          <table className={tableClass}>
            <thead className="border-b border-white/10 bg-white/[0.03]">
              <tr>
                <th className={thClass}>Title</th>
                <th className={thClass}>Description</th>
                <th className={thClass}>Min Price (EUR)</th>
                <th className={thClass}>Max Price (EUR)</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {features.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-white/40">No features yet.</td>
                </tr>
              ) : (
                features.map((item, index) => (
                  <tr key={item.id} className="hover:bg-white/[0.02]">
                    <td className={tdClass}>
                      <input className={adminInputClass} value={item.title} onChange={(e) => { const n = [...features]; n[index] = { ...item, title: e.target.value }; setFeatures(n); }} placeholder="Authentication" />
                    </td>
                    <td className={tdClass}>
                      <input className={adminInputClass} value={item.description} onChange={(e) => { const n = [...features]; n[index] = { ...item, description: e.target.value }; setFeatures(n); }} placeholder="Optional description" />
                    </td>
                    <td className={tdClass}>
                      <input type="number" className={adminInputClass} value={item.min_price} onChange={(e) => { const n = [...features]; n[index] = { ...item, min_price: Number(e.target.value) }; setFeatures(n); }} />
                    </td>
                    <td className={tdClass}>
                      <input type="number" className={adminInputClass} value={item.max_price} onChange={(e) => { const n = [...features]; n[index] = { ...item, max_price: Number(e.target.value) }; setFeatures(n); }} />
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex justify-end gap-2">
                        <ActionButton onClick={() => saveFeature(item)} disabled={saving} label="Save" small />
                        <button type="button" onClick={() => deleteRow("pricing_features", item.id, item.title)} className="rounded-lg border border-red-500/30 p-2 text-red-400 hover:bg-red-500/10">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminSection>

      {/* ── Timeline Multipliers ── */}
      <AdminSection
        title="Timeline Multipliers"
        description="Percentage adjustments applied to the final estimate. Example: Urgent +30%, Standard 0%, Flexible -10%."
        action={
          <button type="button" onClick={addTimeline} className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 px-3 py-1.5 text-xs font-medium text-cyan-400 hover:bg-cyan-500/10">
            <Plus className="h-3.5 w-3.5" /> Add Timeline
          </button>
        }
      >
        <div className={tableCardClass}>
          <table className={tableClass}>
            <thead className="border-b border-white/10 bg-white/[0.03]">
              <tr>
                <th className={thClass}>Title</th>
                <th className={thClass}>Percentage Modifier (%)</th>
                <th className={`${thClass} text-right`}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {timelines.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-sm text-white/40">No timeline options yet.</td>
                </tr>
              ) : (
                timelines.map((item, index) => (
                  <tr key={item.id} className="hover:bg-white/[0.02]">
                    <td className={tdClass}>
                      <input className={adminInputClass} value={item.title} onChange={(e) => { const n = [...timelines]; n[index] = { ...item, title: e.target.value }; setTimelines(n); }} placeholder="Standard" />
                    </td>
                    <td className={tdClass}>
                      <input type="number" className={adminInputClass} value={item.percentage_modifier} onChange={(e) => { const n = [...timelines]; n[index] = { ...item, percentage_modifier: Number(e.target.value) }; setTimelines(n); }} placeholder="0" />
                    </td>
                    <td className={`${tdClass} text-right`}>
                      <div className="flex justify-end gap-2">
                        <ActionButton onClick={() => saveTimeline(item)} disabled={saving} label="Save" small />
                        <button type="button" onClick={() => deleteRow("pricing_timeline_options", item.id, item.title)} className="rounded-lg border border-red-500/30 p-2 text-red-400 hover:bg-red-500/10">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminSection>

      {message && <p className="text-sm text-emerald-400">{message}</p>}
    </div>
  );
}

function AdminSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400">{title}</h3>
          {description && <p className="mt-1 text-xs text-white/45">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function EmptyBlock({ message }: { message: string }) {
  return (
    <div className={`${cardClass} px-4 py-10 text-center text-sm text-white/40`}>{message}</div>
  );
}

function ActionButton({
  onClick,
  disabled,
  label,
  small,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  small?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-600 font-medium text-white disabled:opacity-50 ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}`}
    >
      <Save className={small ? "h-3.5 w-3.5" : "h-4 w-4"} />
      {label}
    </button>
  );
}

function IconButton({
  onClick,
  icon: Icon,
  label,
  variant,
}: {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  variant?: "save";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`rounded-lg border px-2.5 py-1.5 text-xs ${
        variant === "save"
          ? "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          : "border-white/10 text-white/60 hover:bg-white/5"
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}
