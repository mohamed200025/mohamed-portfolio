"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { AppRecord, AppScreenshot } from "@/types/cms";
import {
  buildAppPayload,
  normalizeApp,
  parseCommaList,
  parseLinesList,
} from "@/lib/cms/app-utils";
import { AdminFormField, adminInputClass, adminTextareaClass } from "./AdminFormField";
import { ApkUploadPanel } from "./ApkUploadPanel";
import { Plus, Save, Trash2, Upload } from "lucide-react";

const BUCKET = "app-assets";

const emptyApp = (): Partial<AppRecord> => ({
  slug: "",
  name: "",
  short_description: "",
  description: "",
  logo_url: null,
  apk_url: null,
  play_store_url: "",
  version: "1.0.0",
  file_size: "",
  last_updated: "",
  downloads_count: 0,
  technologies: [],
  features: [],
  rating: 4.5,
  sort_order: 0,
  published: true,
});

export function AppsManager() {
  const [apps, setApps] = useState<AppRecord[]>([]);
  const [selected, setSelected] = useState<AppRecord | null>(null);
  const [screenshots, setScreenshots] = useState<AppScreenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [apkUploading, setApkUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleApkUploadingChange = useCallback((uploading: boolean) => {
    setApkUploading(uploading);
  }, []);

  const loadApps = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("apps").select("*").order("sort_order");
    setApps((data ?? []).map((row) => normalizeApp(row as Record<string, unknown>)));
    setLoading(false);
  };

  useEffect(() => { loadApps(); }, []);

  const loadScreenshots = async (appId: string) => {
    const supabase = createClient();
    const { data } = await supabase.from("app_screenshots").select("*").eq("app_id", appId).order("sort_order");
    setScreenshots(data ?? []);
  };

  const selectApp = (app: AppRecord | null) => {
    setSelected(app);
    setMessage("");
    if (app?.id && !app.id.startsWith("new-")) loadScreenshots(app.id);
    else setScreenshots([]);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const payload = buildAppPayload(selected);

    if (selected.id && !selected.id.startsWith("new-")) {
      const { error } = await supabase.from("apps").update(payload).eq("id", selected.id);
      if (error) { setSaving(false); setMessage(error.message); return; }
      await loadApps();
      setMessage("App saved!");
    } else {
      const { data, error } = await supabase.from("apps").insert(payload).select("*");
      if (error) { setSaving(false); setMessage(error.message); return; }
      const row = data?.[0];
      if (row) selectApp(normalizeApp(row as Record<string, unknown>));
      await loadApps();
      setMessage("App created!");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this app and all screenshots?")) return;
    const supabase = createClient();
    await supabase.from("apps").delete().eq("id", id);
    selectApp(null);
    loadApps();
  };

  const uploadFile = async (
    file: File,
    folder: "logos" | "screenshots" | "apks",
    onUrl: (url: string, storagePath: string) => void
  ) => {
    if (!selected?.id || selected.id.startsWith("new-")) {
      setMessage("Save the app first before uploading files.");
      return;
    }
    const supabase = createClient();
    const path = `${folder}/${selected.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (error) { setMessage(error.message); return; }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    onUrl(data.publicUrl, path);
  };

  const uploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selected) return;
    await uploadFile(file, "logos", (url, storagePath) => {
      setSelected({ ...selected, logo_url: url, logo_storage_path: storagePath });
    });
    e.target.value = "";
  };

  const handleApkUploadComplete = (url: string, storagePath: string, fileSize: string) => {
    if (!selected) return;
    setSelected({
      ...selected,
      apk_url: url,
      apk_storage_path: storagePath,
      file_size: fileSize,
    });
    setMessage("APK uploaded — click Save App to persist changes.");
  };

  const uploadScreenshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selected?.id || selected.id.startsWith("new-")) return;
    const supabase = createClient();
    const path = `screenshots/${selected.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file);
    if (error) { setMessage(error.message); return; }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    await supabase.from("app_screenshots").insert({
      app_id: selected.id,
      url: urlData.publicUrl,
      storage_path: path,
      alt_text: file.name,
      sort_order: screenshots.length,
    });
    loadScreenshots(selected.id);
    e.target.value = "";
  };

  const deleteScreenshot = async (shot: AppScreenshot) => {
    const supabase = createClient();
    if (shot.storage_path) await supabase.storage.from(BUCKET).remove([shot.storage_path]);
    await supabase.from("app_screenshots").delete().eq("id", shot.id);
    if (selected?.id) loadScreenshots(selected.id);
  };

  if (loading) return <p className="text-white/50">Loading apps...</p>;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="space-y-2">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => selectApp(app)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
              selected?.id === app.id ? "border-cyan-500/40 bg-cyan-500/10 text-white" : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/20"
            }`}
          >
            <p className="font-medium">{app.name}</p>
            <p className="text-xs text-white/40">/{app.slug}</p>
          </button>
        ))}
        <button
          onClick={() => selectApp({ ...emptyApp(), id: `new-${Date.now()}` } as AppRecord)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-3 text-sm text-white/50 hover:border-cyan-500/40 hover:text-cyan-400"
        >
          <Plus className="h-4 w-4" /> New App
        </button>
      </div>

      {selected ? (
        <div className="space-y-6 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:p-6 min-w-0">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AdminFormField label="App Name">
              <input className={adminInputClass} value={selected.name} onChange={(e) => setSelected({ ...selected, name: e.target.value })} />
            </AdminFormField>
            <AdminFormField label="Slug (URL)">
              <input className={adminInputClass} value={selected.slug} onChange={(e) => setSelected({ ...selected, slug: e.target.value })} placeholder="eduvera" />
            </AdminFormField>
          </div>

          <AdminFormField label="Short Description">
            <input className={adminInputClass} value={selected.short_description} onChange={(e) => setSelected({ ...selected, short_description: e.target.value })} />
          </AdminFormField>

          <AdminFormField label="Full Description">
            <textarea className={adminTextareaClass} rows={4} value={selected.description} onChange={(e) => setSelected({ ...selected, description: e.target.value })} />
          </AdminFormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AdminFormField label="Version">
              <input className={adminInputClass} value={selected.version} onChange={(e) => setSelected({ ...selected, version: e.target.value })} />
            </AdminFormField>
            <AdminFormField label="File Size">
              <input className={adminInputClass} value={selected.file_size} onChange={(e) => setSelected({ ...selected, file_size: e.target.value })} placeholder="12.5 MB" />
            </AdminFormField>
            <AdminFormField label="Last Updated">
              <input className={adminInputClass} value={selected.last_updated} onChange={(e) => setSelected({ ...selected, last_updated: e.target.value })} placeholder="Mar 2026" />
            </AdminFormField>
            <AdminFormField label="Rating (0-5)">
              <input type="number" step="0.1" min={0} max={5} className={adminInputClass} value={selected.rating} onChange={(e) => setSelected({ ...selected, rating: Number(e.target.value) })} />
            </AdminFormField>
          </div>

          <AdminFormField label="Technologies (comma-separated)">
            <input className={adminInputClass} value={selected.technologies.join(", ")} onChange={(e) => setSelected({ ...selected, technologies: parseCommaList(e.target.value) })} />
          </AdminFormField>

          <AdminFormField label="Features (one per line)">
            <textarea className={adminTextareaClass} rows={4} value={selected.features.join("\n")} onChange={(e) => setSelected({ ...selected, features: parseLinesList(e.target.value) })} />
          </AdminFormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AdminFormField label="Play Store URL">
              <input className={adminInputClass} value={selected.play_store_url ?? ""} onChange={(e) => setSelected({ ...selected, play_store_url: e.target.value })} placeholder="https://play.google.com/..." />
            </AdminFormField>
            <AdminFormField label="APK URL (or upload below)">
              <input className={adminInputClass} value={selected.apk_url ?? ""} onChange={(e) => setSelected({ ...selected, apk_url: e.target.value })} />
            </AdminFormField>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium text-white/60">App Logo</p>
              {selected.logo_url && (
                <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-xl border border-white/10">
                  <Image src={selected.logo_url} alt="" fill className="object-cover" sizes="80px" />
                </div>
              )}
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-cyan-500/30 px-3 py-2 text-xs text-cyan-400 hover:bg-cyan-500/10">
                <Upload className="h-3.5 w-3.5" /> Upload Logo
                <input type="file" accept="image/*" className="hidden" onChange={uploadLogo} disabled={apkUploading} />
              </label>
            </div>
            {selected.id && !selected.id.startsWith("new-") ? (
              <ApkUploadPanel
                appId={selected.id}
                currentApkUrl={selected.apk_url}
                onUploadComplete={handleApkUploadComplete}
                onUploadingChange={handleApkUploadingChange}
              />
            ) : (
              <div>
                <p className="mb-2 text-xs font-medium text-white/60">APK File</p>
                <p className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400/90">
                  Save the app first, then upload an APK (up to 300 MB).
                </p>
              </div>
            )}
          </div>

          {selected.id && !selected.id.startsWith("new-") && (
            <div>
              <p className="mb-3 text-xs font-medium text-white/60">Screenshots</p>
              <div className="mb-3 flex flex-wrap gap-3">
                {screenshots.map((shot) => (
                  <div key={shot.id} className="relative">
                    <div className="relative h-24 w-14 overflow-hidden rounded-lg border border-white/10">
                      <Image src={shot.url} alt="" fill className="object-cover" sizes="56px" />
                    </div>
                    <button type="button" onClick={() => deleteScreenshot(shot)} className="absolute -right-2 -top-2 rounded-full bg-red-500/90 p-1 text-white">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/60 hover:bg-white/5">
                <Upload className="h-3.5 w-3.5" /> Add Screenshot
                <input type="file" accept="image/*" className="hidden" onChange={uploadScreenshot} />
              </label>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={selected.published} onChange={(e) => setSelected({ ...selected, published: e.target.checked })} />
              Published
            </label>
            <input type="number" className={`${adminInputClass} w-24`} value={selected.sort_order} onChange={(e) => setSelected({ ...selected, sort_order: Number(e.target.value) })} title="Sort order" />
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row">
            <button
              onClick={handleSave}
              disabled={saving || apkUploading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Save className="h-4 w-4" />
              {apkUploading ? "Upload in progress…" : saving ? "Saving..." : "Save App"}
            </button>
            {selected.id && !selected.id.startsWith("new-") && (
              <button onClick={() => handleDelete(selected.id)} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 px-5 py-2.5 text-sm text-red-400 sm:w-auto">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            )}
          </div>
          {message && <p className={`text-sm ${message.includes("error") || message.includes("Save") === false && message.includes("!") ? "text-emerald-400" : message.includes("first") ? "text-amber-400" : "text-red-400"}`}>{message}</p>}
        </div>
      ) : (
        <p className="text-white/40">Select an app or create a new one</p>
      )}
    </div>
  );
}
