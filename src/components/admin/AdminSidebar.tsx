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
  UserCircle,
  Route,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero", icon: Sparkles },
  { href: "/admin/projects", label: "Projects", icon: Briefcase },
  { href: "/admin/about", label: "About", icon: UserCircle },
  { href: "/admin/journey", label: "Journey", icon: Route },
  { href: "/admin/contact", label: "Contact", icon: Mail },
  { href: "/admin/pricing", label: "Pricing", icon: Calculator },
  { href: "/admin/leads", label: "Leads", icon: BarChart3 },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/cv", label: "CV Uploads", icon: FileText },
  { href: "/admin/sections", label: "Sections", icon: Home },
  { href: "/admin/seo", label: "SEO", icon: Search },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-white/10 bg-[#0a0a12]">
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600">
            <MessageSquare className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Portfolio CMS</p>
            <p className="text-[11px] text-white/40">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          href="/"
          target="_blank"
          className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/5 hover:text-white"
        >
          <Home className="h-4 w-4" />
          View Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
