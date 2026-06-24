import { ProposalsManager } from "@/components/admin/ProposalsManager";

export default function AdminProposalsPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-white">Quote Requests</h1>
      <p className="mb-6 text-sm text-white/45">
        Wizard submissions from Request Final Quote — filter by status and open proposal PDFs.
      </p>
      <ProposalsManager />
    </div>
  );
}
