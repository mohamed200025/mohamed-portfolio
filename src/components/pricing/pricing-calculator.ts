import type { WizardCurrency } from "./types";

export function formatWizardCurrency(amount: number, currency: WizardCurrency): string {
  if (currency === "EUR") {
    return `€${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)}`;
  }

  if (currency === "DZD") {
    return `${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)} DA`;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** @deprecated Use formatWizardCurrency — amounts are already in display currency */
export function formatUsd(amount: number): string {
  return formatWizardCurrency(amount, "USD");
}
