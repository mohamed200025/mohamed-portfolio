export type PreferredContactMethod = "whatsapp" | "phone" | "email";

export type ProjectBudgetRange =
  | ""
  | "under-500"
  | "500-1000"
  | "1000-3000"
  | "3000-5000"
  | "5000-plus";

export type ProjectStartDate =
  | ""
  | "immediately"
  | "within-2-weeks"
  | "within-1-month"
  | "within-3-months"
  | "just-exploring";

export interface ClientInformation {
  fullName: string;
  phoneCountryCode: string;
  phoneNumber: string;
  email: string;
  companyName: string;
  country: string;
  preferredContactMethod: PreferredContactMethod;
  budgetRange: ProjectBudgetRange;
  projectStartDate: ProjectStartDate;
  additionalNotes: string;
}

export const DEFAULT_CLIENT_INFORMATION: ClientInformation = {
  fullName: "",
  phoneCountryCode: "+213",
  phoneNumber: "",
  email: "",
  companyName: "",
  country: "",
  preferredContactMethod: "whatsapp",
  budgetRange: "",
  projectStartDate: "",
  additionalNotes: "",
};

export const PREFERRED_CONTACT_OPTIONS: {
  id: PreferredContactMethod;
  label: string;
  icon: "whatsapp" | "phone" | "email";
}[] = [
  { id: "whatsapp", label: "WhatsApp", icon: "whatsapp" },
  { id: "phone", label: "Phone Call", icon: "phone" },
  { id: "email", label: "Email", icon: "email" },
];

export const BUDGET_RANGE_OPTIONS: { id: ProjectBudgetRange; label: string }[] = [
  { id: "under-500", label: "Under €500" },
  { id: "500-1000", label: "€500 – €1,000" },
  { id: "1000-3000", label: "€1,000 – €3,000" },
  { id: "3000-5000", label: "€3,000 – €5,000" },
  { id: "5000-plus", label: "€5,000+" },
];

export const PROJECT_START_OPTIONS: { id: ProjectStartDate; label: string }[] = [
  { id: "immediately", label: "Immediately" },
  { id: "within-2-weeks", label: "Within 2 Weeks" },
  { id: "within-1-month", label: "Within 1 Month" },
  { id: "within-3-months", label: "Within 3 Months" },
  { id: "just-exploring", label: "Just Exploring" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ClientValidationResult {
  valid: boolean;
  errors: {
    fullName?: string;
    phoneNumber?: string;
    email?: string;
  };
}

export function validateClientInformation(client: ClientInformation): ClientValidationResult {
  const errors: ClientValidationResult["errors"] = {};
  const name = client.fullName.trim();

  if (name.length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  }

  const digits = client.phoneNumber.replace(/\D/g, "");
  if (digits.length < 6) {
    errors.phoneNumber = "Enter a valid phone number.";
  }

  const email = client.email.trim();
  if (email && !EMAIL_REGEX.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatClientPhone(client: ClientInformation): string {
  const digits = client.phoneNumber.replace(/\D/g, "");
  if (!digits) return "";
  return `${client.phoneCountryCode} ${digits}`;
}

export function getContactMethodLabel(method: PreferredContactMethod): string {
  return PREFERRED_CONTACT_OPTIONS.find((o) => o.id === method)?.label ?? method;
}

export function getBudgetRangeLabel(range: ProjectBudgetRange): string {
  if (!range) return "";
  return BUDGET_RANGE_OPTIONS.find((o) => o.id === range)?.label ?? range;
}

export function getProjectStartLabel(start: ProjectStartDate): string {
  if (!start) return "";
  return PROJECT_START_OPTIONS.find((o) => o.id === start)?.label ?? start;
}

export function hasClientSummaryData(client: ClientInformation): boolean {
  return (
    client.fullName.trim().length > 0 ||
    client.phoneNumber.trim().length > 0 ||
    client.email.trim().length > 0
  );
}
