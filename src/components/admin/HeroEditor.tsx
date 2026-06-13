"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { defaultHero } from "@/lib/cms/defaults";
import { normalizeHeroSettings } from "@/lib/cms/hero-utils";
import type { AppRecord, HeroSettings, ProjectRecord } from "@/types/cms";
import { AdminFormField, adminInputClass, adminTextareaClass } from "./AdminFormField";
import { AdminSelect } from "./AdminSelect";
import { Save } from "lucide-react";

export function HeroEditor() {
  const [form, setForm] = useState<HeroSettings>(defaultHero);
  const [publishedProjects, setPublishedProjects] = useState<ProjectRecord[]>([]);
  const [publishedApps, setPublishedApps] = useState<AppRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const [heroRes, projectsRes, appsRes] = await Promise.all([
        supabase.from("hero_settings").select("*").eq("id", 1).maybeSingle(),
        supabase.from("projects").select("id, title, category").eq("published", true).order("sort_order"),
        supabase.from("apps").select("id, name").eq("published", true).order("sort_order"),
      ]);

      if (heroRes.data) {
        setForm(normalizeHeroSettings(heroRes.data as Record<string, unknown>));
      }
      setPublishedProjects((projectsRes.data ?? []) as ProjectRecord[]);
      setPublishedApps((appsRes.data ?? []) as AppRecord[]);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.from("hero_settings").upsert({
      id: 1,
      status_badge: form.status_badge,
      headline_prefix: form.headline_prefix,
      headline_highlight: form.headline_highlight,
      subheadline_prefix: form.subheadline_prefix,
      subheadline_highlight: form.subheadline_highlight,
      description: form.description,
      primary_cta_text: form.primary_cta_text,
      primary_cta_href: form.primary_cta_href,
      secondary_cta_text: form.secondary_cta_text,
      secondary_cta_href: form.secondary_cta_href,
      tech_stack: form.tech_stack,
      profile_name: form.profile_name,
      profile_title: form.profile_title,
      featured_project_id: form.featured_project_id || null,
      download_app_enabled: form.download_app_enabled,
      download_app_id: form.download_app_enabled ? form.download_app_id || null : null,
      updated_at: new Date().toISOString(),
    });

    setSaving(false);
    setMessage(error ? error.message : "Hero section saved successfully!");
  };

  const projectOptions = publishedProjects.map((project) => ({
    value: project.id,
    label: project.title,
  }));

  const appOptions = publishedApps.map((app) => ({
    value: app.id,
    label: app.name,
  }));

  if (loading) return <p className="text-white/50">Loading...</p>;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h3 className="mb-4 border-b border-white/10 pb-2 text-sm font-semibold uppercase tracking-wider text-cyan-400">
          Download App CTA
        </h3>
        <p className="mb-4 text-sm text-white/45">
          Optionally show a &quot;Download App&quot; button in the hero that links to the selected app product page.
        </p>
        <label className="mb-4 flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            checked={form.download_app_enabled}
            onChange={(e) => setForm({ ...form, download_app_enabled: e.target.checked })}
          />
          Show Download App button in Hero
        </label>
        {form.download_app_enabled && (
          <AdminFormField label="Featured App">
            {appOptions.length === 0 ? (
              <p className="text-sm text-amber-400/90">No published apps yet. Create one in Apps admin.</p>
            ) : (
              <AdminSelect
                value={form.download_app_id ?? publishedApps[0]?.id ?? ""}
                onChange={(download_app_id) => setForm({ ...form, download_app_id })}
                options={appOptions}
                placeholder="Select an app"
              />
            )}
          </AdminFormField>
        )}
      </div>

      <div>
        <h3 className="mb-4 border-b border-white/10 pb-2 text-sm font-semibold uppercase tracking-wider text-cyan-400">
          Featured Showcase Project
        </h3>
        <p className="mb-4 text-sm text-white/45">
          Choose which published project&apos;s screenshots appear in the Home hero device mockups (laptop + phone). Image #1 is the laptop screen; image #2 is the phone screen.
        </p>
        <AdminFormField label="Featured Showcase Project">
          {projectOptions.length === 0 ? (
            <p className="text-sm text-amber-400/90">No published projects yet. Publish a project first.</p>
          ) : (
            <AdminSelect
              value={form.featured_project_id ?? publishedProjects[0]?.id ?? ""}
              onChange={(featured_project_id) => setForm({ ...form, featured_project_id })}
              options={projectOptions}
              placeholder="Select a project"
            />
          )}
        </AdminFormField>
      </div>

      <div>
        <h3 className="mb-4 border-b border-white/10 pb-2 text-sm font-semibold uppercase tracking-wider text-cyan-400">
          Hero Copy
        </h3>
        <div className="space-y-6">
          <AdminFormField label="Status Badge">
            <input className={adminInputClass} value={form.status_badge} onChange={(e) => setForm({ ...form, status_badge: e.target.value })} />
          </AdminFormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AdminFormField label="Headline Prefix">
              <input className={adminInputClass} value={form.headline_prefix} onChange={(e) => setForm({ ...form, headline_prefix: e.target.value })} />
            </AdminFormField>
            <AdminFormField label="Headline Highlight">
              <input className={adminInputClass} value={form.headline_highlight} onChange={(e) => setForm({ ...form, headline_highlight: e.target.value })} />
            </AdminFormField>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </div>
      </div>

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
