import { AppsManager } from "@/components/admin/AppsManager";

export default function AdminAppsPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Apps</h1>
      <p className="mb-6 text-sm text-white/50">Manage Android app product pages, APK downloads, and Play Store links.</p>
      <AppsManager />
    </div>
  );
}
