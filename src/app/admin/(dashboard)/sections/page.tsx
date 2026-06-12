import { SectionsEditor } from "@/components/admin/SectionsEditor";

export default function AdminSectionsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Section Content</h1>
      <p className="mb-6 text-sm text-white/50">Edit JSON content for About, Services, Technologies, Contact and more.</p>
      <SectionsEditor />
    </div>
  );
}
