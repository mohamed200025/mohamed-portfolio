import { JourneyManager } from "@/components/admin/JourneyManager";

export default function AdminJourneyPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Journey Timeline</h1>
      <p className="mb-6 text-sm text-white/50">Manage career milestones shown in the About section.</p>
      <JourneyManager />
    </div>
  );
}
