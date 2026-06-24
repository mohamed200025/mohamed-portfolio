interface PricingProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function PricingProgress({ currentStep, totalSteps }: PricingProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400/80">
          Project estimate
        </span>
        <span className="text-[11px] font-medium text-white/40">
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
