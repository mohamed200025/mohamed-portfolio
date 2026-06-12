import { CvManager } from "@/components/admin/CvManager";

export default function AdminCvPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">CV Uploads</h1>
      <p className="mb-6 text-sm text-white/50">Upload and manage your resume. The active CV is linked on the About section.</p>
      <CvManager />
    </div>
  );
}
