import { ProjectsManager } from "@/components/admin/ProjectsManager";

export default function AdminProjectsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Projects</h1>
      <ProjectsManager />
    </div>
  );
}
