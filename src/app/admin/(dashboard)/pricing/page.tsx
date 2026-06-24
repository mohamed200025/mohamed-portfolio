import { WizardPricingManager } from "@/components/admin/WizardPricingManager";

export default function AdminPricingPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Pricing Settings</h1>
      <p className="mb-6 text-sm text-white/50">
        Manage exchange rates, service prices, optional features, timeline multipliers, and
        complexity multipliers. Default currency is DZD.
      </p>
      <WizardPricingManager />
    </div>
  );
}
