"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { defaultHero } from "@/lib/cms/defaults";
import type { HeroSettings } from "@/types/cms";
import { AdminFormField, adminInputClass, adminTextareaClass } from "./AdminFormField";
import { Save } from "lucide-react";

export function HeroEditor() {
  const [form, setForm] = useState<HeroSettings>(defaultHero);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("hero_settings").select("*").eq("id", 1).maybeSingle();
      if (data) setForm(data as HeroSettings);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase
      .from("hero_settings")
      .upsert({ id: 1, ...form, updated_at: new Date().toISOString() });

    setSaving(false);
    setMessage(error ? error.message : "Hero section saved successfully!");
  };

  if (loading) return <p className="text-white/50">Loading...</p>;

  return (
    <div className="max-w-3xl space-y-6">
      <AdminFormField label="Status Badge">
        <input className={adminInputClass} value={form.status_badge} onChange={(e) => setForm({ ...form, status_badge: e.target.value })} />
      </AdminFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField label="Headline Prefix">
          <input className={adminInputClass} value={form.headline_prefix} onChange={(e) => setForm({ ...form, headline_prefix: e.target.value })} />
        </AdminFormField>
        <AdminFormField label="Headline Highlight">
          <input className={adminInputClass} value={form.headline_highlight} onChange={(e) => setForm({ ...form, headline_highlight: e.target.value })} />
        </AdminFormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField label="Subheadline Prefix">
          <input className={adminInputClass} value={form.subheadline_prefix} onChange={(e) => setForm({ ...form, subheadline_prefix: e.target.value })} />
        </AdminFormField>
        <AdminFormField label="Subheadline Highlight">
          <input className={adminInputClass} value={form.subheadline_highlight} onChange={(e) => setForm({ ...form, subheadline_highlight: e.target.value })} />
        </AdminFormField>
      </div>

      <AdminFormField label="Description">
        <textarea className={adminTextareaClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </AdminFormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField label="Primary CTA Text">
          <input className={adminInputClass} value={form.primary_cta_text} onChange={(e) => setForm({ ...form, primary_cta_text: e.target.value })} />
        </AdminFormField>
        <AdminFormField label="Primary CTA Link">
          <input className={adminInputClass} value={form.primary_cta_href} onChange={(e) => setForm({ ...form, primary_cta_href: e.target.value })} />
        </AdminFormField>
        <AdminFormField label="Secondary CTA Text">
          <input className={adminInputClass} value={form.secondary_cta_text} onChange={(e) => setForm({ ...form, secondary_cta_text: e.target.value })} />
        </AdminFormField>
        <AdminFormField label="Secondary CTA Link">
          <input className={adminInputClass} value={form.secondary_cta_href} onChange={(e) => setForm({ ...form, secondary_cta_href: e.target.value })} />
        </AdminFormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AdminFormField label="Profile Name">
          <input className={adminInputClass} value={form.profile_name} onChange={(e) => setForm({ ...form, profile_name: e.target.value })} />
        </AdminFormField>
        <AdminFormField label="Profile Title">
          <input className={adminInputClass} value={form.profile_title} onChange={(e) => setForm({ ...form, profile_title: e.target.value })} />
        </AdminFormField>
      </div>

      <AdminFormField label="Tech Stack (comma-separated)">
        <input
          className={adminInputClass}
          value={form.tech_stack.map((t) => t.name).join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              tech_stack: e.target.value.split(",").map((name) => ({ name: name.trim() })).filter((t) => t.name),
            })
          }
        />
      </AdminFormField>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save Hero"}
      </button>

      {message && (
        <p className={`text-sm ${message.includes("success") ? "text-emerald-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
