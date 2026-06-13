"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { AboutSettings, CvFile } from "@/types/cms";
import { defaultAbout } from "@/lib/cms/defaults";
import { AdminFormField, adminInputClass, adminTextareaClass } from "./AdminFormField";
import { Download, Save, Upload } from "lucide-react";

export function AboutEditor() {
  const [form, setForm] = useState<AboutSettings>(defaultAbout);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [activeCv, setActiveCv] = useState<CvFile | null>(null);
  const [message, setMessage] = useState("");

  const load = async () => {
    const supabase = createClient();
    const [aboutRes, cvRes] = await Promise.all([
      supabase.from("about_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("cv_files").select("*").eq("is_active", true).maybeSingle(),
    ]);
    if (aboutRes.data) {
      setForm({
        ...defaultAbout,
        ...(aboutRes.data as AboutSettings),
        who_i_am_paragraphs: (aboutRes.data.who_i_am_paragraphs as string[]) ?? [],
      });
    }
    setActiveCv(cvRes.data ?? null);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setMessage("");
    const supabase = createClient();
    const path = `profile/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("profile-photos").upload(path, file, { upsert: true });
    if (error) {
      setMessage(error.message);
      setUploadingPhoto(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("profile-photos").getPublicUrl(path);
    setForm((f) => ({
      ...f,
      profile_photo_url: urlData.publicUrl,
      profile_photo_storage_path: path,
    }));
    setUploadingPhoto(false);
    setMessage("Photo uploaded — click Save to apply.");
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCv(true);
    const supabase = createClient();
    const path = `cv/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("cv-files").upload(path, file);
    if (error) {
      setMessage(error.message);
      setUploadingCv(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("cv-files").getPublicUrl(path);
    await supabase.from("cv_files").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    const { data } = await supabase
      .from("cv_files")
      .insert({
        file_name: file.name,
        storage_path: path,
        public_url: urlData.publicUrl,
        file_size: file.size,
        is_active: true,
      })
      .select()
      .single();
    setActiveCv(data);
    setUploadingCv(false);
    setMessage("CV uploaded and set as active.");
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.from("about_settings").upsert({
      id: 1,
      ...form,
      who_i_am_paragraphs: form.who_i_am_paragraphs,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    setMessage(error ? error.message : "About section saved successfully!");
  };

  if (loading) return <p className="text-white/50">Loading...</p>;

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-400">Profile</h3>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative h-40 w-32 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
            {form.profile_photo_url ? (
              <Image src={form.profile_photo_url} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-white/30">No photo</div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
              <Upload className="h-4 w-4" />
              {uploadingPhoto ? "Uploading..." : "Upload Profile Photo"}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <AdminFormField label="Name">
                <input className={adminInputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </AdminFormField>
              <AdminFormField label="Job Title">
                <input className={adminInputClass} value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} />
              </AdminFormField>
            </div>
            <AdminFormField label="Status Badge">
              <input className={adminInputClass} value={form.status_badge} onChange={(e) => setForm({ ...form, status_badge: e.target.value })} />
            </AdminFormField>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-400">Section Header</h3>
        <div className="space-y-4">
          <AdminFormField label="Short Bio (subtitle)">
            <textarea className={adminTextareaClass} rows={3} value={form.short_bio} onChange={(e) => setForm({ ...form, short_bio: e.target.value })} />
          </AdminFormField>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <AdminFormField label="Badge">
              <input className={adminInputClass} value={form.section_badge} onChange={(e) => setForm({ ...form, section_badge: e.target.value })} />
            </AdminFormField>
            <AdminFormField label="Title Prefix">
              <input className={adminInputClass} value={form.title_prefix} onChange={(e) => setForm({ ...form, title_prefix: e.target.value })} />
            </AdminFormField>
            <AdminFormField label="Title Highlight">
              <input className={adminInputClass} value={form.title_highlight} onChange={(e) => setForm({ ...form, title_highlight: e.target.value })} />
            </AdminFormField>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-400">Who I Am</h3>
        <div className="space-y-4">
          <AdminFormField label="Title">
            <input className={adminInputClass} value={form.who_i_am_title} onChange={(e) => setForm({ ...form, who_i_am_title: e.target.value })} />
          </AdminFormField>
          <AdminFormField label="Paragraphs (one per line)">
            <textarea
              className={adminTextareaClass}
              rows={5}
              value={form.who_i_am_paragraphs.join("\n")}
              onChange={(e) => setForm({ ...form, who_i_am_paragraphs: e.target.value.split("\n").filter(Boolean) })}
            />
          </AdminFormField>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-400">Statistics</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { label: "Projects Completed", valueKey: "stat_projects_value", suffixKey: "stat_projects_suffix", tagKey: "stat_projects_tag" },
            { label: "Technologies", valueKey: "stat_technologies_value", suffixKey: "stat_technologies_suffix", tagKey: "stat_technologies_tag" },
            { label: "Platforms Built", valueKey: "stat_platforms_value", suffixKey: "stat_platforms_suffix", tagKey: "stat_platforms_tag" },
            { label: "Countries Served", valueKey: "stat_countries_value", suffixKey: "stat_countries_suffix", tagKey: "stat_countries_tag" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <p className="mb-3 text-xs font-medium text-white/50">{stat.label}</p>
              <div className="grid grid-cols-3 gap-2">
                <AdminFormField label="Count">
                  <input
                    type="number"
                    className={adminInputClass}
                    value={form[stat.valueKey as keyof AboutSettings] as number}
                    onChange={(e) => setForm({ ...form, [stat.valueKey]: Number(e.target.value) })}
                  />
                </AdminFormField>
                <AdminFormField label="Suffix">
                  <input
                    className={adminInputClass}
                    value={form[stat.suffixKey as keyof AboutSettings] as string}
                    onChange={(e) => setForm({ ...form, [stat.suffixKey]: e.target.value })}
                  />
                </AdminFormField>
                <AdminFormField label="Tag">
                  <input
                    className={adminInputClass}
                    value={form[stat.tagKey as keyof AboutSettings] as string}
                    onChange={(e) => setForm({ ...form, [stat.tagKey]: e.target.value })}
                  />
                </AdminFormField>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cyan-400">CV Download</h3>
        {activeCv && (
          <div className="mb-4 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <div>
              <p className="font-medium text-white">{activeCv.file_name}</p>
              <p className="text-xs text-white/40">Active CV on About section</p>
            </div>
            <a href={activeCv.public_url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white">
              <Download className="h-4 w-4" />
            </a>
          </div>
        )}
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 text-sm text-white">
          <Upload className="h-4 w-4" />
          {uploadingCv ? "Uploading..." : "Upload CV (PDF)"}
          <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleCvUpload} disabled={uploadingCv} />
        </label>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save About Section"}
      </button>
      {message && <p className="text-sm text-emerald-400">{message}</p>}
    </div>
  );
}
