import { ContactEditor } from "@/components/admin/ContactEditor";

export default function AdminContactPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Contact Section</h1>
      <p className="mb-6 text-sm text-white/50">
        Manage contact methods, section copy, and meeting link.
      </p>
      <ContactEditor />
    </div>
  );
}
