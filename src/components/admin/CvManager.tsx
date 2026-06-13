"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CvFile } from "@/types/cms";
import { Download, Upload } from "lucide-react";

export function CvManager() {
  const [files, setFiles] = useState<CvFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("cv_files").select("*").order("uploaded_at", { ascending: false });
    setFiles(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const path = `cv/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage.from("cv-files").upload(path, file);
    if (error) {
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("cv-files").getPublicUrl(path);

    await supabase.from("cv_files").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("cv_files").insert({
      file_name: file.name,
      storage_path: path,
      public_url: urlData.publicUrl,
      file_size: file.size,
      is_active: true,
    });

    setUploading(false);
    load();
  };

  const setActive = async (id: string) => {
    const supabase = createClient();
    await supabase.from("cv_files").update({ is_active: false }).neq("id", "00000000-0000-0000-0000-000000000000");
    await supabase.from("cv_files").update({ is_active: true }).eq("id", id);
    load();
  };

  if (loading) return <p className="text-white/50">Loading...</p>;

  return (
    <div className="min-w-0 w-full">
      <label className="mb-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 text-sm text-white sm:w-auto sm:justify-start">
        <Upload className="h-4 w-4" />
        {uploading ? "Uploading..." : "Upload New CV"}
        <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleUpload} disabled={uploading} />
      </label>

      <div className="space-y-3">
        {files.map((f) => (
          <div key={f.id} className={`flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${f.is_active ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-white/[0.03]"}`}>
            <div className="min-w-0">
              <p className="font-medium text-white">{f.file_name}</p>
              <p className="text-xs text-white/40">{new Date(f.uploaded_at).toLocaleString()}</p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {f.is_active ? (
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">Active</span>
              ) : (
                <button onClick={() => setActive(f.id)} className="text-xs text-cyan-400 hover:underline">Set Active</button>
              )}
              <a href={f.public_url} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/10 p-2 text-white/60 hover:text-white">
                <Download className="h-4 w-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
