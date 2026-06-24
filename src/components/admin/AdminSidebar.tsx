"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  Calculator,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  Search,
  Sparkles,
  Star,
  Smartphone,
  UserCircle,
  Route,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero", icon: Sparkles },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/apps", label: "Apps", icon: Smartphone },
  { href: "/admin/about", label: "About", icon: UserCircle },
  { href: "/admin/journey", label: "Journey", icon: Route },
  { href: "/admin/contact", label: "Contact", icon: Mail },
  { href: "/admin/pricing", label: "Pricing", icon: Calculator },
  { href: "/admin/leads", label: "Leads", icon: BarChart3 },
  { href: "/admin/proposals", label: "Quote Requests", icon: FileText },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/cv", label: "CV Uploads", icon: FileText },
  { href: "/admin/sections", label: "Sections", icon: Home },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

interface AdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ open = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 max-w-[min(85vw,16rem)] flex-col border-r border-white/10 bg-[#0a0a12] transition-transform duration-300 ease-out lg:static lg:z-auto lg:max-w-none lg:shrink-0 lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="border-b border-white/10 p-5 lg:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">Portfolio CMS</p>
              <p className="truncate text-[11px] text-white/40">Admin Dashboard</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/60 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          onClick={onClose}
          className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"
        >
          <Home className="h-4 w-4 shrink-0" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
