"use client";

import { useMemo, useState } from "react";
import { validateClientInformation } from "./client-info";
import {
  buildFinalTotalUpdate,
  buildPricingDeliveryUpdate,
  getDefaultDeliveryDuration,
} from "./complexity-engine";
import { getTimelineMultiplier } from "./timelines";
import { getAllRequirementIds } from "./requirements";
import { usePricingConfig } from "./PricingConfigProvider";
import {
  INITIAL_PRICING_FLOW_STATE,
  type ClientInformation,
  type PricingCategoryId,
  type PricingFlowState,
  type PricingFlowStep,
  type PricingIndustryId,
  type WizardCurrency,
  type WizardTimelineId,
} from "./types";

export function usePricingWizard() {
  const { catalog, currency, setCurrency: setGlobalCurrency, loading, error } = usePricingConfig();
  const [flow, setFlow] = useState<PricingFlowState>(() => ({
    ...INITIAL_PRICING_FLOW_STATE,
    currency: "DZD",
  }));
  const [clientValidationAttempted, setClientValidationAttempted] = useState(false);

  const activeCurrency = flow.currency || currency;

  const clientValidation = useMemo(
    () => validateClientInformation(flow.client),
    [flow.client],
  );

  const timelineMultiplier = catalog
    ? getTimelineMultiplier(catalog, flow.timelineId)
    : 1;

  const recalcWithCatalog = (
    updater: (prev: PricingFlowState) => PricingFlowState,
  ): PricingFlowState | null => {
    if (!catalog) return null;
    return updater(flow);
  };

  const selectCategory = (categoryId: PricingCategoryId) => {
    if (!catalog) return;
    setFlow((prev) => {
      const categoryChanged = prev.categoryId !== categoryId;
      if (categoryChanged) {
        return {
          ...prev,
          categoryId,
          ...buildPricingDeliveryUpdate(catalog, [], prev.timelineId),
        };
      }
      return { ...prev, categoryId };
    });
  };

  const selectIndustry = (industryId: PricingIndustryId) => {
    setFlow((prev) => ({ ...prev, industryId }));
  };

  const setCurrency = (next: WizardCurrency) => {
    if (!catalog) return;
    setGlobalCurrency(next);
    setFlow((prev) => {
      const withCurrency = { ...prev, currency: next };
      if (prev.requirements.length === 0) return withCurrency;
      return {
        ...withCurrency,
        ...buildPricingDeliveryUpdate(catalog, prev.requirements, prev.timelineId),
      };
    });
  };

  const toggleRequirement = (id: string) => {
    if (!catalog) return;
    setFlow((prev) => {
      const requirements = prev.requirements.includes(id)
        ? prev.requirements.filter((r) => r !== id)
        : [...prev.requirements, id];
      return { ...prev, ...buildPricingDeliveryUpdate(catalog, requirements, prev.timelineId) };
    });
  };

  const setProjectName = (projectName: string) => {
    setFlow((prev) => ({ ...prev, projectName }));
  };

  const setProjectDescription = (projectDescription: string) => {
    setFlow((prev) => ({ ...prev, projectDescription }));
  };

  const setTargetAudience = (targetAudience: string) => {
    setFlow((prev) => ({ ...prev, targetAudience }));
  };

  const setTimeline = (timelineId: WizardTimelineId) => {
    if (!catalog) return;
    setFlow((prev) => ({
      ...prev,
      timelineId,
      ...buildFinalTotalUpdate(catalog, prev.estimatedTotal, prev.requirements, timelineId),
    }));
  };

  const updateClient = (patch: Partial<ClientInformation>) => {
    setFlow((prev) => ({
      ...prev,
      client: { ...prev.client, ...patch },
    }));
  };

  const setProposalConfirmed = (proposalConfirmed: boolean) => {
    setFlow((prev) => ({ ...prev, proposalConfirmed }));
  };

  const goToStep = (step: PricingFlowStep) => {
    setFlow((prev) => ({ ...prev, step }));
  };

  const handleContinue = () => {
    if (!catalog) return;
    switch (flow.step) {
      case 1:
        if (flow.categoryId) goToStep(2);
        break;
      case 2:
        if (flow.industryId) goToStep(3);
        break;
      case 3:
        if (flow.requirements.length > 0 && flow.estimatedTotal > 0) {
          setFlow((prev) => ({
            ...prev,
            step: 4,
            ...buildFinalTotalUpdate(catalog, prev.estimatedTotal, prev.requirements, prev.timelineId),
          }));
        }
        break;
      case 4:
        if (flow.projectName.trim() && flow.projectDescription.trim()) {
          goToStep(5);
        }
        break;
      case 5:
        setClientValidationAttempted(true);
        if (clientValidation.valid) {
          setFlow((prev) => ({ ...prev, step: 6, proposalConfirmed: false }));
        }
        break;
      case 6:
        if (flow.proposalConfirmed) {
          goToStep(7);
        }
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    if (!catalog) return;
    const prevStep = Math.max(1, flow.step - 1) as PricingFlowStep;
    if (flow.step === 5) setClientValidationAttempted(false);
    if (flow.step === 6) {
      setFlow((prev) => ({ ...prev, proposalConfirmed: false }));
    }
    setFlow((prev) => {
      if (prevStep === 2 && prev.categoryId) {
        const validIds = new Set(getAllRequirementIds(catalog, prev.categoryId));
        const requirements = prev.requirements.filter((id) => validIds.has(id));
        return {
          ...prev,
          step: prevStep,
          ...buildPricingDeliveryUpdate(catalog, requirements, prev.timelineId),
        };
      }
      return { ...prev, step: prevStep };
    });
  };

  const canContinue =
    !catalog
      ? false
      : flow.step === 1
        ? flow.categoryId !== null
        : flow.step === 2
          ? flow.industryId !== null
          : flow.step === 3
            ? flow.requirements.length > 0 && flow.estimatedTotal > 0
            : flow.step === 4
              ? flow.projectName.trim().length > 0 &&
                flow.projectDescription.trim().length > 0 &&
                flow.estimatedTotal > 0
              : flow.step === 5
                ? true
                : flow.step === 6
                  ? flow.proposalConfirmed
                  : false;

  const defaultDelivery = catalog ? getDefaultDeliveryDuration(catalog) : "";

  return {
    flow: {
      ...flow,
      currency: activeCurrency,
      deliveryDuration: flow.deliveryDuration || defaultDelivery,
    },
    catalog,
    configLoading: loading,
    configError: error,
    clientValidation,
    clientValidationAttempted,
    timelineMultiplier,
    canContinue,
    selectCategory,
    selectIndustry,
    setCurrency,
    toggleRequirement,
    setProjectName,
    setProjectDescription,
    setTargetAudience,
    setTimeline,
    updateClient,
    setProposalConfirmed,
    handleContinue,
    handleBack,
    recalcWithCatalog,
  };
}

export type PricingWizardController = ReturnType<typeof usePricingWizard>;
