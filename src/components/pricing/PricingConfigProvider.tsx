"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { buildPricingCatalog, type PricingCatalog } from "@/lib/pricing/catalog";
import { fetchPricingWizardConfig } from "@/lib/pricing/fetch-config";
import type { PricingWizardConfig } from "@/lib/pricing/wizard-types";
import type { WizardCurrency } from "./types";

interface PricingConfigContextValue {
  config: PricingWizardConfig | null;
  catalog: PricingCatalog | null;
  loading: boolean;
  error: string | null;
  currency: WizardCurrency;
  setCurrency: (currency: WizardCurrency) => void;
  refresh: () => Promise<void>;
}

const PricingConfigContext = createContext<PricingConfigContextValue | null>(null);

export function PricingConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<PricingWizardConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrencyState] = useState<WizardCurrency>("DZD");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const data = await fetchPricingWizardConfig();
    if (!data) {
      setConfig(null);
      setError("Pricing configuration is unavailable. Please try again later.");
      setLoading(false);
      return;
    }
    setConfig(data);
    setCurrencyState(data.settings.default_currency);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const setCurrency = useCallback((next: WizardCurrency) => {
    setCurrencyState(next);
  }, []);

  const catalog = useMemo(
    () => (config ? buildPricingCatalog(config, currency) : null),
    [config, currency],
  );

  const value = useMemo(
    () => ({
      config,
      catalog,
      loading,
      error,
      currency,
      setCurrency,
      refresh: load,
    }),
    [config, catalog, loading, error, currency, setCurrency, load],
  );

  return (
    <PricingConfigContext.Provider value={value}>{children}</PricingConfigContext.Provider>
  );
}

export function usePricingConfig() {
  const ctx = useContext(PricingConfigContext);
  if (!ctx) {
    throw new Error("usePricingConfig must be used within PricingConfigProvider");
  }
  return ctx;
}
