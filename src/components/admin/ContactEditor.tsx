"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContactSettings } from "@/types/cms";
import { defaultContactSettings } from "@/lib/cms/defaults";
import { AdminFormField, adminInputClass, adminTextareaClass } from "./AdminFormField";
import { Save } from "lucide-react";

export function ContactEditor() {
  const [form, setForm] = useState<ContactSettings>(defaultContactSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("contact_settings").select("*").eq("id", 1).maybeSingle();
      if (data) {
        setForm({ ...defaultContactSettings, ...(data as ContactSettings) });
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.from("contact_settings").upsert({
      id: 1,
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim(),
      linkedin_url: form.linkedin_url.trim(),
      linkedin_username: form.linkedin_username.trim(),
      github_url: form.github_url.trim(),
      github_username: form.github_username.trim(),
      contact_title: form.contact_title.trim(),
      contact_subtitle: form.contact_subtitle.trim(),
      calendly_url: form.calendly_url.trim(),
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    setMessage(error ? error.message : "Contact section saved successfully!");
  };

  if (loading) return <p className="text-white/50">Loading...</p>;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-400">Section Header</h3>
        <div className="space-y-4">
          <AdminFormField label="Contact Title">
            <input
              className={adminInputClass}
              value={form.contact_title}
              onChange={(e) => setForm({ ...form, contact_title: e.target.value })}
              placeholder="Let's Work Together"
            />
            <p className="mt-1 text-xs text-white/40">First word is plain text; remaining words use the gradient highlight.</p>
          </AdminFormField>
          <AdminFormField label="Contact Subtitle">
            <textarea
              className={adminTextareaClass}
              rows={3}
              value={form.contact_subtitle}
              onChange={(e) => setForm({ ...form, contact_subtitle: e.target.value })}
            />
          </AdminFormField>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-400">Contact Methods</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminFormField label="WhatsApp Number">
            <input
              className={adminInputClass}
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="+213 XXX XXX XXX"
            />
          </AdminFormField>
          <AdminFormField label="Email Address">
            <input
              type="email"
              className={adminInputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="contact@example.com"
            />
          </AdminFormField>
          <AdminFormField label="LinkedIn URL">
            <input
              type="url"
              className={adminInputClass}
              value={form.linkedin_url}
              onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/username"
            />
          </AdminFormField>
          <AdminFormField label="LinkedIn Username">
            <input
              className={adminInputClass}
              value={form.linkedin_username}
              onChange={(e) => setForm({ ...form, linkedin_username: e.target.value })}
              placeholder="mohamed-ournani"
            />
          </AdminFormField>
          <AdminFormField label="GitHub URL">
            <input
              type="url"
              className={adminInputClass}
              value={form.github_url}
              onChange={(e) => setForm({ ...form, github_url: e.target.value })}
              placeholder="https://github.com/username"
            />
          </AdminFormField>
          <AdminFormField label="GitHub Username">
            <input
              className={adminInputClass}
              value={form.github_username}
              onChange={(e) => setForm({ ...form, github_username: e.target.value })}
              placeholder="mohamedournani"
            />
          </AdminFormField>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-400">Call to Action</h3>
        <AdminFormField label="Calendly / Meeting URL">
          <input
            type="url"
            className={adminInputClass}
            value={form.calendly_url}
            onChange={(e) => setForm({ ...form, calendly_url: e.target.value })}
            placeholder="https://calendly.com/your-link"
          />
          <p className="mt-1 text-xs text-white/40">Powers the &quot;Schedule a Meeting&quot; button. Leave empty to scroll to the contact form.</p>
        </AdminFormField>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save"}
      </button>
      {message && <p className="text-sm text-emerald-400">{message}</p>}
    </div>
  );
}
