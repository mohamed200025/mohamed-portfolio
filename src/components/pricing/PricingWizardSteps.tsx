"use client";

import { CategorySelectionStep } from "./steps/CategorySelectionStep";
import { IndustrySelectionStep } from "./steps/IndustrySelectionStep";
import { RequirementsSelectionStep } from "./steps/RequirementsSelectionStep";
import { ProjectDetailsStep } from "./steps/ProjectDetailsStep";
import { ClientInformationStep } from "./steps/ClientInformationStep";
import { ProposalReviewStep } from "./steps/ProposalReviewStep";
import { ProposalGenerateStep } from "./steps/ProposalGenerateStep";
import type { PricingWizardController } from "./usePricingWizard";
import type { useProposalSubmission } from "./useProposalSubmission";

type ProposalSubmission = ReturnType<typeof useProposalSubmission>;

interface PricingWizardStepsProps {
  wizard: PricingWizardController;
  layout?: "mobile" | "desktop";
  submission?: ProposalSubmission;
}

export function PricingWizardSteps({
  wizard,
  layout = "mobile",
  submission,
}: PricingWizardStepsProps) {
  const {
    flow,
    catalog,
    clientValidation,
    clientValidationAttempted,
    timelineMultiplier,
    selectCategory,
    selectIndustry,
    toggleRequirement,
    setProjectName,
    setProjectDescription,
    setTargetAudience,
    setTimeline,
    updateClient,
    setProposalConfirmed,
  } = wizard;

  if (!catalog) return null;

  return (
    <>
      {flow.step === 1 && (
        <CategorySelectionStep
          selectedCategoryId={flow.categoryId}
          onSelectCategory={selectCategory}
        />
      )}

      {flow.step === 2 && (
        <IndustrySelectionStep
          selectedIndustryId={flow.industryId}
          onSelectIndustry={selectIndustry}
        />
      )}

      {flow.step === 3 && flow.categoryId && (
        <RequirementsSelectionStep
          catalog={catalog}
          categoryId={flow.categoryId}
          selectedRequirements={flow.requirements}
          onToggleRequirement={toggleRequirement}
        />
      )}

      {flow.step === 4 && (
        <ProjectDetailsStep
          catalog={catalog}
          projectName={flow.projectName}
          projectDescription={flow.projectDescription}
          targetAudience={flow.targetAudience}
          timelineId={flow.timelineId}
          complexityScore={flow.complexityScore}
          complexityLevel={flow.complexityLevel}
          deliveryDuration={flow.deliveryDuration}
          baseTotalUsd={flow.estimatedTotal}
          finalTotalUsd={flow.finalEstimatedTotal}
          timelineMultiplier={timelineMultiplier}
          currency={flow.currency}
          onProjectNameChange={setProjectName}
          onProjectDescriptionChange={setProjectDescription}
          onTargetAudienceChange={setTargetAudience}
          onTimelineChange={setTimeline}
        />
      )}

      {flow.step === 5 && (
        <ClientInformationStep
          client={flow.client}
          validationErrors={clientValidation.errors}
          showValidation={clientValidationAttempted}
          onChange={updateClient}
        />
      )}

      {flow.step === 6 && (
        <ProposalReviewStep
          catalog={catalog}
          categoryId={flow.categoryId}
          industryId={flow.industryId}
          projectName={flow.projectName}
          projectDescription={flow.projectDescription}
          priceBreakdown={flow.priceBreakdown}
          timelineId={flow.timelineId}
          deliveryDuration={flow.deliveryDuration}
          baseTotalUsd={flow.estimatedTotal}
          finalTotalUsd={flow.finalEstimatedTotal}
          timelineMultiplier={timelineMultiplier}
          complexityLevel={flow.complexityLevel}
          currency={flow.currency}
          client={flow.client}
          proposalConfirmed={flow.proposalConfirmed}
          onProposalConfirmedChange={setProposalConfirmed}
        />
      )}

      {flow.step === 7 && (
        <ProposalGenerateStep flow={flow} layout={layout} submission={submission} />
      )}
    </>
  );
}
