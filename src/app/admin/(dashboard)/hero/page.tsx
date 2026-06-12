import { HeroEditor } from "@/components/admin/HeroEditor";

export default function AdminHeroPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Hero Section</h1>
      <p className="mb-6 text-sm text-white/50">Manage hero copy and the showcase project images shown in the device mockups.</p>
      <HeroEditor />
    </div>
  );
}
