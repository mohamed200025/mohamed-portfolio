import { LeadsManager } from "@/components/admin/LeadsManager";

export default function AdminLeadsPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Quote Leads</h1>
      <p className="mb-6 text-sm text-white/50">View all calculator quote requests.</p>
      <LeadsManager />
    </div>
  );
}
