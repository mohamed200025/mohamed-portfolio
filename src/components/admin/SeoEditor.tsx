"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { defaultSeo } from "@/lib/cms/defaults";
import type { SeoSettings } from "@/types/cms";
import { AdminFormField, adminInputClass, adminTextareaClass } from "./AdminFormField";
import { Save } from "lucide-react";

export function SeoEditor() {
  const [form, setForm] = useState<SeoSettings>(defaultSeo);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("seo_settings").select("*").eq("id", 1).maybeSingle();
      if (data) setForm(data as SeoSettings);
      setLoading(false);
    };
    load();
  }, []);

  const save = async () => {
    const supabase = createClient();
    const { error } = await supabase.from("seo_settings").upsert({
      id: 1,
      ...form,
      updated_at: new Date().toISOString(),
    });
    setMessage(error ? error.message : "SEO settings saved!");
  };

  if (loading) return <p className="text-white/50">Loading...</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <AdminFormField label="Site Title">
        <input className={adminInputClass} value={form.site_title} onChange={(e) => setForm({ ...form, site_title: e.target.value })} />
      </AdminFormField>
      <AdminFormField label="Meta Description">
        <textarea className={adminTextareaClass} rows={3} value={form.site_description} onChange={(e) => setForm({ ...form, site_description: e.target.value })} />
      </AdminFormField>
      <AdminFormField label="Keywords (comma-separated)">
        <input className={adminInputClass} value={form.keywords.join(", ")} onChange={(e) => setForm({ ...form, keywords: e.target.value.split(",").map((k) => k.trim()).filter(Boolean) })} />
      </AdminFormField>
      <AdminFormField label="OG Image URL">
        <input className={adminInputClass} value={form.og_image_url ?? ""} onChange={(e) => setForm({ ...form, og_image_url: e.target.value })} />
      </AdminFormField>
      <AdminFormField label="Twitter Handle">
        <input className={adminInputClass} value={form.twitter_handle ?? ""} onChange={(e) => setForm({ ...form, twitter_handle: e.target.value })} />
      </AdminFormField>
      <AdminFormField label="Canonical URL">
        <input className={adminInputClass} value={form.canonical_url ?? ""} onChange={(e) => setForm({ ...form, canonical_url: e.target.value })} />
      </AdminFormField>
      <button onClick={save} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 text-sm text-white">
        <Save className="h-4 w-4" /> Save SEO
      </button>
      {message && <p className="text-sm text-emerald-400">{message}</p>}
    </div>
  );
}
