import { PricingManager } from "@/components/admin/PricingManager";

export default function AdminPricingPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Pricing Calculator</h1>
      <p className="mb-6 text-sm text-white/50">Manage currencies, project types, features, and timeline multipliers. Base prices are in EUR.</p>
      <PricingManager />
    </div>
  );
}
