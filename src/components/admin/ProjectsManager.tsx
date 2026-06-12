"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { ProjectImage, ProjectRecord } from "@/types/cms";
import { AdminFormField, adminInputClass, adminTextareaClass } from "./AdminFormField";
import { Plus, Save, Trash2, Upload } from "lucide-react";

const emptyProject = (): Partial<ProjectRecord> => ({
  slug: "",
  title: "",
  category: "",
  description: "",
  features: [],
  technologies: [],
  primary_button_label: "View Project",
  primary_button_href: "#",
  primary_button_external: false,
  secondary_button_label: "Case Study",
  secondary_button_href: "#",
  featured: false,
  accent: "cyan",
  showcase_type: "custom",
  icon_name: "BookOpen",
  sort_order: 0,
  published: true,
});

export function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [selected, setSelected] = useState<ProjectRecord | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadProjects = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    setProjects((data as ProjectRecord[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const loadImages = async (projectId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("project_images")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order");
    setImages(data ?? []);
  };

  const selectProject = (p: ProjectRecord | null) => {
    setSelected(p);
    setMessage("");
    if (p?.id) loadImages(p.id);
    else setImages([]);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setMessage("");
    const supabase = createClient();
    const payload = {
      slug: selected.slug,
      title: selected.title,
      category: selected.category,
      description: selected.description,
      features: selected.features,
      technologies: selected.technologies,
      primary_button_label: selected.primary_button_label,
      primary_button_href: selected.primary_button_href,
      primary_button_external: selected.primary_button_external,
      secondary_button_label: selected.secondary_button_label,
      secondary_button_href: selected.secondary_button_href,
      featured: selected.featured,
      accent: selected.accent,
      showcase_type: selected.showcase_type,
      icon_name: selected.icon_name,
      sort_order: selected.sort_order,
      published: selected.published,
      updated_at: new Date().toISOString(),
    };

    if (selected.id && !selected.id.startsWith("new-")) {
      const { error } = await supabase.from("projects").update(payload).eq("id", selected.id);
      setMessage(error ? error.message : "Project updated!");
    } else {
      const { data, error } = await supabase.from("projects").insert(payload).select().single();
      if (data) selectProject(data as ProjectRecord);
      setMessage(error ? error.message : "Project created!");
      loadProjects();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    const supabase = createClient();
    await supabase.from("projects").delete().eq("id", id);
    selectProject(null);
    loadProjects();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selected?.id || selected.id.startsWith("new-") || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const supabase = createClient();
    const path = `${selected.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(path, file);

    if (uploadError) {
      setMessage(uploadError.message);
      return;
    }

    const { data: urlData } = supabase.storage.from("project-images").getPublicUrl(path);

    await supabase.from("project_images").insert({
      project_id: selected.id,
      url: urlData.publicUrl,
      storage_path: path,
      alt_text: file.name,
      sort_order: images.length,
      is_cover: images.length === 0,
    });

    loadImages(selected.id);
  };

  const deleteImage = async (img: ProjectImage) => {
    const supabase = createClient();
    if (img.storage_path) {
      await supabase.storage.from("project-images").remove([img.storage_path]);
    }
    await supabase.from("project_images").delete().eq("id", img.id);
    if (selected?.id) loadImages(selected.id);
  };

  if (loading) return <p className="text-white/50">Loading projects...</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      <div className="space-y-2">
        <button
          onClick={() => selectProject({ ...emptyProject(), id: `new-${Date.now()}` } as ProjectRecord)}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-2.5 text-sm text-white/60 hover:border-cyan-500/40 hover:text-cyan-400"
        >
          <Plus className="h-4 w-4" /> New Project
        </button>
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => selectProject(p)}
            className={`w-full rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
              selected?.id === p.id
                ? "border-cyan-500/40 bg-cyan-500/10 text-white"
                : "border-white/10 bg-white/[0.02] text-white/70 hover:bg-white/5"
            }`}
          >
            {p.title}
            {!p.published && <span className="ml-2 text-xs text-amber-400">(draft)</span>}
          </button>
        ))}
      </div>

      {selected ? (
        <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField label="Title">
              <input className={adminInputClass} value={selected.title} onChange={(e) => setSelected({ ...selected, title: e.target.value })} />
            </AdminFormField>
            <AdminFormField label="Slug">
              <input className={adminInputClass} value={selected.slug} onChange={(e) => setSelected({ ...selected, slug: e.target.value })} />
            </AdminFormField>
          </div>

          <AdminFormField label="Category">
            <input className={adminInputClass} value={selected.category} onChange={(e) => setSelected({ ...selected, category: e.target.value })} />
          </AdminFormField>

          <AdminFormField label="Description">
            <textarea className={adminTextareaClass} rows={3} value={selected.description} onChange={(e) => setSelected({ ...selected, description: e.target.value })} />
          </AdminFormField>

          <AdminFormField label="Features (one per line)">
            <textarea
              className={adminTextareaClass}
              rows={4}
              value={selected.features.join("\n")}
              onChange={(e) => setSelected({ ...selected, features: e.target.value.split("\n").filter(Boolean) })}
            />
          </AdminFormField>

          <AdminFormField label="Technologies (comma-separated)">
            <input
              className={adminInputClass}
              value={selected.technologies.join(", ")}
              onChange={(e) => setSelected({ ...selected, technologies: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
            />
          </AdminFormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <AdminFormField label="Showcase Type">
              <select
                className={adminInputClass}
                value={selected.showcase_type}
                onChange={(e) => setSelected({ ...selected, showcase_type: e.target.value as ProjectRecord["showcase_type"] })}
              >
                <option value="eduvera">Eduvera</option>
                <option value="muhlentechnik">Muhlentechnik</option>
                <option value="custom">Custom</option>
              </select>
            </AdminFormField>
            <AdminFormField label="Accent">
              <select className={adminInputClass} value={selected.accent} onChange={(e) => setSelected({ ...selected, accent: e.target.value as "cyan" | "blue" })}>
                <option value="cyan">Cyan</option>
                <option value="blue">Blue</option>
              </select>
            </AdminFormField>
            <AdminFormField label="Sort Order">
              <input type="number" className={adminInputClass} value={selected.sort_order} onChange={(e) => setSelected({ ...selected, sort_order: Number(e.target.value) })} />
            </AdminFormField>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={selected.featured} onChange={(e) => setSelected({ ...selected, featured: e.target.checked })} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input type="checkbox" checked={selected.published} onChange={(e) => setSelected({ ...selected, published: e.target.checked })} />
              Published
            </label>
          </div>

          {selected.id && !selected.id.startsWith("new-") && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-white">Project Images</h3>
              <div className="mb-3 flex flex-wrap gap-3">
                {images.map((img) => (
                  <div key={img.id} className="relative h-20 w-28 overflow-hidden rounded-lg border border-white/10">
                    <Image src={img.url} alt={img.alt_text ?? ""} fill className="object-cover" />
                    <button onClick={() => deleteImage(img)} className="absolute right-1 top-1 rounded bg-red-500/80 p-1">
                      <Trash2 className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5">
                <Upload className="h-4 w-4" />
                Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50">
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </button>
            {selected.id && !selected.id.startsWith("new-") && (
              <button onClick={() => handleDelete(selected.id)} className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-2.5 text-sm text-red-400 hover:bg-red-500/10">
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            )}
          </div>
          {message && <p className="text-sm text-emerald-400">{message}</p>}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-xl border border-dashed border-white/10 p-12 text-white/40">
          Select a project or create a new one
        </div>
      )}
    </div>
  );
}
