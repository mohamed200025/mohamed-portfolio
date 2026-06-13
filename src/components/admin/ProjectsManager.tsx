"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { AppRecord, ProjectImage, ProjectRecord } from "@/types/cms";
import {
  buildCaseStudyPayload,
  buildCoreProjectPayload,
  formatResultsInput,
  formatStatisticsInput,
  isMissingColumnError,
  isSingleRowCoercionError,
  normalizeProject,
  parseLinesInput,
  parseResultsInput,
  parseStatisticsInput,
  pickSavedProjectRow,
} from "@/lib/cms/project-utils";
import { AdminFormField, adminInputClass, adminTextareaClass } from "./AdminFormField";
import { AdminSelect } from "./AdminSelect";
import { Plus, Save, Trash2, Upload } from "lucide-react";

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="border-b border-white/10 pb-2 text-sm font-semibold uppercase tracking-wider text-cyan-400">
      {children}
    </h3>
  );
}

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
  website_url: "",
  details_url: "",
  live_demo_url: "",
  project_overview: "",
  problem_statement: "",
  solution: "",
  business_impact: "",
  project_year: "",
  project_duration: "",
  client_name: "",
  industry: "",
  gallery_images: [],
  statistics: [],
  results: [],
  challenges: [],
  solutions: [],
  app_id: null,
  featured: false,
  accent: "cyan",
  showcase_type: "custom",
  icon_name: "BookOpen",
  sort_order: 0,
  published: true,
});

export function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [apps, setApps] = useState<AppRecord[]>([]);
  const [selected, setSelected] = useState<ProjectRecord | null>(null);
  const [images, setImages] = useState<ProjectImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadProjects = async () => {
    const supabase = createClient();
    const [projectsRes, appsRes] = await Promise.all([
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("apps").select("id, name").order("sort_order"),
    ]);
    setProjects((projectsRes.data ?? []).map((row) => normalizeProject(row as Record<string, unknown>)));
    setApps((appsRes.data ?? []) as AppRecord[]);
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
    const corePayload = buildCoreProjectPayload(selected);
    const caseStudyPayload = buildCaseStudyPayload(selected);

    const persistCaseStudy = async (projectId: string) => {
      const { error } = await supabase
        .from("projects")
        .update(caseStudyPayload)
        .eq("id", projectId);

      if (!error) return null;
      if (isMissingColumnError(error)) {
        return "Project links saved. Run supabase/migrations/20250612_project_case_study_fields.sql to enable case study fields.";
      }
      return `Project links saved. Case study fields failed: ${error.message}`;
    };

    if (selected.id && !selected.id.startsWith("new-")) {
      console.info("[ProjectsManager] save update", {
        projectId: selected.id,
        payload: corePayload,
      });

      const { data: savedRows, error } = await supabase
        .from("projects")
        .update(corePayload)
        .eq("id", selected.id)
        .select("*");

      console.info("[ProjectsManager] save update result", {
        projectId: selected.id,
        rowCount: savedRows?.length ?? 0,
        error: error?.message ?? null,
      });

      if (error && !isSingleRowCoercionError(error)) {
        setMessage(error.message);
        setSaving(false);
        return;
      }

      const saved = pickSavedProjectRow(
        savedRows as Record<string, unknown>[] | null,
        selected.id
      );

      if (!saved) {
        setMessage("Update failed — no rows returned. Sign in again and retry.");
        setSaving(false);
        return;
      }

      const caseStudyMessage = await persistCaseStudy(selected.id);
      const normalized = normalizeProject(saved);
      selectProject(normalized);
      await loadProjects();
      setMessage(caseStudyMessage ?? "Project updated!");
    } else {
      console.info("[ProjectsManager] save insert", {
        projectId: selected.id,
        payload: corePayload,
      });

      const { data: createdRows, error } = await supabase
        .from("projects")
        .insert(corePayload)
        .select("*");

      console.info("[ProjectsManager] save insert result", {
        projectId: selected.id,
        rowCount: createdRows?.length ?? 0,
        error: error?.message ?? null,
      });

      if (error && !isSingleRowCoercionError(error)) {
        setMessage(error.message);
        setSaving(false);
        return;
      }

      const created = pickSavedProjectRow(createdRows as Record<string, unknown>[] | null);

      if (!created) {
        setMessage("Create failed — no row returned.");
        setSaving(false);
        return;
      }

      const caseStudyMessage = await persistCaseStudy(created.id as string);
      const normalized = normalizeProject(created);
      selectProject(normalized);
      await loadProjects();
      setMessage(caseStudyMessage ?? "Project created!");
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

          <SectionHeading>Links &amp; CTAs</SectionHeading>
          <p className="text-xs text-white/40">
            Project Details opens at /projects/[slug] automatically. Set Website URL and optional Live Demo below.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AdminFormField label="Website URL">
              <input
                type="url"
                className={adminInputClass}
                value={selected.website_url ?? ""}
                onChange={(e) => setSelected({ ...selected, website_url: e.target.value })}
                placeholder="https://example.com"
              />
            </AdminFormField>
            <AdminFormField label="Live Demo URL">
              <input
                type="url"
                className={adminInputClass}
                value={selected.live_demo_url ?? ""}
                onChange={(e) => setSelected({ ...selected, live_demo_url: e.target.value })}
                placeholder="https://demo.example.com"
              />
            </AdminFormField>
          </div>

          <SectionHeading>Case Study Content</SectionHeading>

          <AdminFormField label="Project Overview">
            <textarea
              className={adminTextareaClass}
              rows={4}
              value={selected.project_overview ?? ""}
              onChange={(e) => setSelected({ ...selected, project_overview: e.target.value })}
            />
          </AdminFormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AdminFormField label="Problem Statement">
              <textarea
                className={adminTextareaClass}
                rows={4}
                value={selected.problem_statement ?? ""}
                onChange={(e) => setSelected({ ...selected, problem_statement: e.target.value })}
              />
            </AdminFormField>
            <AdminFormField label="Solution">
              <textarea
                className={adminTextareaClass}
                rows={4}
                value={selected.solution ?? ""}
                onChange={(e) => setSelected({ ...selected, solution: e.target.value })}
              />
            </AdminFormField>
          </div>

          <AdminFormField label="Business Impact">
            <textarea
              className={adminTextareaClass}
              rows={3}
              value={selected.business_impact ?? ""}
              onChange={(e) => setSelected({ ...selected, business_impact: e.target.value })}
            />
          </AdminFormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AdminFormField label="Client Name">
              <input className={adminInputClass} value={selected.client_name ?? ""} onChange={(e) => setSelected({ ...selected, client_name: e.target.value })} />
            </AdminFormField>
            <AdminFormField label="Industry">
              <input className={adminInputClass} value={selected.industry ?? ""} onChange={(e) => setSelected({ ...selected, industry: e.target.value })} />
            </AdminFormField>
            <AdminFormField label="Project Year">
              <input className={adminInputClass} value={selected.project_year ?? ""} onChange={(e) => setSelected({ ...selected, project_year: e.target.value })} />
            </AdminFormField>
            <AdminFormField label="Project Duration">
              <input className={adminInputClass} value={selected.project_duration ?? ""} onChange={(e) => setSelected({ ...selected, project_duration: e.target.value })} />
            </AdminFormField>
          </div>

          <AdminFormField label="Statistics (one per line: Label | Value | icon)">
            <textarea
              className={adminTextareaClass}
              rows={5}
              value={formatStatisticsInput(selected.statistics ?? [])}
              onChange={(e) => setSelected({ ...selected, statistics: parseStatisticsInput(e.target.value) })}
              placeholder={"Total Students | 2,847+ | users\nActive Courses | 48 | book"}
            />
          </AdminFormField>

          <AdminFormField label="Results (one per line: Label | Value | description)">
            <textarea
              className={adminTextareaClass}
              rows={4}
              value={formatResultsInput(selected.results ?? [])}
              onChange={(e) => setSelected({ ...selected, results: parseResultsInput(e.target.value) })}
              placeholder={"User Growth | +340% | Increased enrollment"}
            />
          </AdminFormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AdminFormField label="Challenges (one per line)">
              <textarea
                className={adminTextareaClass}
                rows={5}
                value={(selected.challenges ?? []).join("\n")}
                onChange={(e) => setSelected({ ...selected, challenges: parseLinesInput(e.target.value) })}
              />
            </AdminFormField>
            <AdminFormField label="Solutions (one per line)">
              <textarea
                className={adminTextareaClass}
                rows={5}
                value={(selected.solutions ?? []).join("\n")}
                onChange={(e) => setSelected({ ...selected, solutions: parseLinesInput(e.target.value) })}
              />
            </AdminFormField>
          </div>

          <AdminFormField label="Gallery Image URLs (one per line, in addition to uploads)">
            <textarea
              className={adminTextareaClass}
              rows={3}
              value={(selected.gallery_images ?? []).join("\n")}
              onChange={(e) => setSelected({ ...selected, gallery_images: parseLinesInput(e.target.value) })}
            />
          </AdminFormField>

          <AdminFormField label="Linked App Page (optional)">
            <AdminSelect
              value={selected.app_id ?? ""}
              onChange={(app_id) => setSelected({ ...selected, app_id: app_id || null })}
              options={[
                { value: "", label: "None" },
                ...apps.map((a) => ({ value: a.id, label: a.name })),
              ]}
              placeholder="None"
            />
          </AdminFormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <AdminFormField label="Showcase Type">
              <AdminSelect
                value={selected.showcase_type}
                onChange={(showcase_type) =>
                  setSelected({ ...selected, showcase_type: showcase_type as ProjectRecord["showcase_type"] })
                }
                options={[
                  { value: "eduvera", label: "Eduvera" },
                  { value: "muhlentechnik", label: "Muhlentechnik" },
                  { value: "custom", label: "Custom" },
                ]}
              />
            </AdminFormField>
            <AdminFormField label="Accent">
              <AdminSelect
                value={selected.accent}
                onChange={(accent) => setSelected({ ...selected, accent: accent as "cyan" | "blue" })}
                options={[
                  { value: "cyan", label: "Cyan" },
                  { value: "blue", label: "Blue" },
                ]}
              />
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

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button onClick={handleSave} disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50 sm:w-auto">
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
