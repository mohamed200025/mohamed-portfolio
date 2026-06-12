import { AboutEditor } from "@/components/admin/AboutEditor";

export default function AdminAboutPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">About Section</h1>
      <p className="mb-6 text-sm text-white/50">Manage profile, bio, statistics, and CV download.</p>
      <AboutEditor />
    </div>
  );
}
