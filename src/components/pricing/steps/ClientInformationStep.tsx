"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Calendar,
  FileText,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  User,
  Wallet,
} from "lucide-react";
import { ClientPhoneInput } from "../ClientPhoneInput";
import { CountrySearchSelect } from "../CountrySearchSelect";
import {
  BUDGET_RANGE_OPTIONS,
  PREFERRED_CONTACT_OPTIONS,
  PROJECT_START_OPTIONS,
  type ClientInformation,
  type ClientValidationResult,
} from "../client-info";
import { PricingProgress } from "../PricingProgress";
import { PRICING_WIZARD_TOTAL_STEPS } from "../types";
import { WIZARD_STEP_BOTTOM_PADDING } from "../wizard-layout";

const inputClassName =
  "w-full rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-3 text-[14px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-cyan-500/40 focus:bg-white/[0.06]";

function FieldLabel({
  htmlFor,
  icon: Icon,
  label,
  required,
}: {
  htmlFor: string;
  icon: LucideIcon;
  label: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-2 text-[12px] font-medium text-white/60">
      <Icon className="h-3.5 w-3.5 text-cyan-400/70" />
      {label}
      {required ? <span className="text-rose-400">*</span> : <span className="text-white/30">(optional)</span>}
    </label>
  );
}

interface ClientInformationStepProps {
  client: ClientInformation;
  validationErrors: ClientValidationResult["errors"];
  showValidation: boolean;
  onChange: (patch: Partial<ClientInformation>) => void;
}

export function ClientInformationStep({
  client,
  validationErrors,
  showValidation,
  onChange,
}: ClientInformationStepProps) {
  const nameError = showValidation ? validationErrors.fullName : undefined;
  const emailError = showValidation ? validationErrors.email : undefined;

  return (
    <div className={`px-5 pt-[max(1rem,env(safe-area-inset-top))] ${WIZARD_STEP_BOTTOM_PADDING}`}>
      <PricingProgress currentStep={5} totalSteps={PRICING_WIZARD_TOTAL_STEPS} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <h1 className="text-[22px] font-bold leading-tight tracking-tight text-white">
          Client Information
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-white/45">
          Enter your contact details so we can generate a personalized project proposal and quotation.
        </p>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mt-6 space-y-4"
      >
        <div>
          <FieldLabel htmlFor="client-full-name" icon={User} label="Full Name" required />
          <input
            id="client-full-name"
            type="text"
            autoComplete="name"
            value={client.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            placeholder="e.g. Mohamed Ournani"
            className={`${inputClassName} ${nameError ? "border-rose-500/40" : ""}`}
          />
          {nameError && <p className="mt-1 text-[11px] text-rose-400">{nameError}</p>}
        </div>

        <div>
          <FieldLabel htmlFor="client-phone" icon={Phone} label="Phone Number" required />
          <ClientPhoneInput
            countryCode={client.phoneCountryCode}
            phoneNumber={client.phoneNumber}
            onCountryCodeChange={(phoneCountryCode) => onChange({ phoneCountryCode })}
            onPhoneNumberChange={(phoneNumber) => onChange({ phoneNumber })}
            error={showValidation ? validationErrors.phoneNumber : undefined}
          />
        </div>

        <div>
          <FieldLabel htmlFor="client-email" icon={Mail} label="Email Address" />
          <input
            id="client-email"
            type="email"
            autoComplete="email"
            value={client.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="you@company.com"
            className={`${inputClassName} ${emailError ? "border-rose-500/40" : ""}`}
          />
          {emailError && <p className="mt-1 text-[11px] text-rose-400">{emailError}</p>}
        </div>

        <div>
          <FieldLabel htmlFor="client-company" icon={Building2} label="Company Name" />
          <input
            id="client-company"
            type="text"
            autoComplete="organization"
            value={client.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="Your company or startup"
            className={inputClassName}
          />
        </div>

        <div>
          <FieldLabel htmlFor="client-country" icon={Globe} label="Country" />
          <CountrySearchSelect
            value={client.country}
            onChange={(country) => onChange({ country })}
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 text-[12px] font-medium text-white/60">
            <MessageCircle className="h-3.5 w-3.5 text-cyan-400/70" />
            Preferred Contact Method
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PREFERRED_CONTACT_OPTIONS.map((option) => {
              const selected = client.preferredContactMethod === option.id;
              return (
                <motion.button
                  key={option.id}
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onChange({ preferredContactMethod: option.id })}
                  className={`rounded-xl border px-2 py-2.5 text-[11px] font-semibold transition-all ${
                    selected
                      ? "border-cyan-400/50 bg-gradient-to-br from-cyan-500/15 to-violet-600/10 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.12)]"
                      : "border-white/[0.08] bg-white/[0.03] text-white/45 hover:border-white/[0.14]"
                  }`}
                >
                  {option.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="client-budget" icon={Wallet} label="Project Budget Range" />
          <select
            id="client-budget"
            value={client.budgetRange}
            onChange={(e) =>
              onChange({ budgetRange: e.target.value as ClientInformation["budgetRange"] })
            }
            className={`${inputClassName} appearance-none`}
          >
            <option value="" className="bg-[#0a0a12]">
              Select a range (optional)
            </option>
            {BUDGET_RANGE_OPTIONS.map((option) => (
              <option key={option.id} value={option.id} className="bg-[#0a0a12]">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel htmlFor="client-start" icon={Calendar} label="Project Start Date" />
          <select
            id="client-start"
            value={client.projectStartDate}
            onChange={(e) =>
              onChange({ projectStartDate: e.target.value as ClientInformation["projectStartDate"] })
            }
            className={`${inputClassName} appearance-none`}
          >
            <option value="" className="bg-[#0a0a12]">
              When would you like to start? (optional)
            </option>
            {PROJECT_START_OPTIONS.map((option) => (
              <option key={option.id} value={option.id} className="bg-[#0a0a12]">
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <FieldLabel htmlFor="client-notes" icon={FileText} label="Additional Notes" />
          <textarea
            id="client-notes"
            rows={4}
            value={client.additionalNotes}
            onChange={(e) => onChange({ additionalNotes: e.target.value })}
            placeholder="Any extra details, references, examples, or special requirements..."
            className={`${inputClassName} min-h-[100px] resize-y`}
          />
        </div>
      </motion.section>
    </div>
  );
}
