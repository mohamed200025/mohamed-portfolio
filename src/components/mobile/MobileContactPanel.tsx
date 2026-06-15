"use client";

import { Code2, Link, Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { contactMethods as staticContactMethods } from "@/lib/technologies-data";
import { defaultContactSettings } from "@/lib/cms/defaults";
import { contactSettingsToMethods } from "@/lib/cms/contact-utils";
import type { ContactMethod, ContactSettings } from "@/types/cms";

const iconMap = {
  whatsapp: { icon: MessageCircle, color: staticContactMethods[0].color },
  email: { icon: Mail, color: staticContactMethods[1].color },
  linkedin: { icon: Link, color: staticContactMethods[2].color },
  github: { icon: Code2, color: staticContactMethods[3].color },
};

interface MobileContactPanelProps {
  contactSettings?: ContactSettings;
  contactMethods?: ContactMethod[];
}

export function MobileContactPanel({
  contactSettings = defaultContactSettings,
  contactMethods = [],
}: MobileContactPanelProps) {
  const methods =
    contactMethods.length > 0 ? contactMethods : contactSettingsToMethods(contactSettings);

  return (
    <div className="space-y-5 px-5 pb-6">
      <div className="grid grid-cols-2 gap-3">
        {methods.map((method) => {
          const meta = iconMap[method.type as keyof typeof iconMap];
          const Icon = meta?.icon ?? Mail;
          const color = meta?.color ?? "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/20";
          return (
            <a
              key={method.id}
              href={method.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex min-h-[88px] flex-col justify-between rounded-2xl border bg-gradient-to-br p-4 backdrop-blur-sm transition-transform active:scale-[0.98] ${color}`}
            >
              <Icon className="h-5 w-5" />
              <div>
                <p className="text-[10px] font-medium text-white/50">{method.label}</p>
                <p className="mt-0.5 truncate text-sm font-semibold text-white">{method.value}</p>
              </div>
            </a>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm">
        <h3 className="mb-4 text-sm font-semibold text-white">Send a message</h3>
        <ContactForm />
      </div>
    </div>
  );
}
