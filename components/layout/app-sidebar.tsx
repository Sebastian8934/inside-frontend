"use client";

import { Building2 } from "lucide-react";
import {
  isNavGroup,
  navigation,
  type NavEntry,
} from "@/config/navigation";
import { APP_NAME, INSIDE_COLORS } from "@/config/constants";
import { filterNavigation, getPrimaryRoleLabel } from "@/lib/auth/permissions";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/stores/auth-store";
import { SidebarNavLink } from "@/components/layout/sidebar-nav-link";

type AppSidebarProps = {
  className?: string;
  onNavigate?: () => void;
};

export function AppSidebar({ className, onNavigate }: AppSidebarProps) {
  const user = useAuthStore((state) => state.user);
  const userRoles = user?.roles ?? [];
  const visibleNavigation = filterNavigation(navigation, userRoles);

  return (
    <aside
      className={cn("flex h-full w-64 shrink-0 flex-col text-white", className)}
      style={{ backgroundColor: INSIDE_COLORS.sidebar }}
    >
      <div className="border-b border-white/10 p-6">
        <div className="flex items-center gap-2">
          <Building2
            className="size-8 shrink-0"
            style={{ color: INSIDE_COLORS.accent }}
          />
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold">{APP_NAME}</h1>
            <p className="text-xs text-white/60">SAS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {visibleNavigation.map((entry, index) => (
          <NavigationEntry
            key={getEntryKey(entry, index)}
            entry={entry}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="text-xs text-white/60">
          <div className="truncate">Usuario: {user?.fullName ?? "—"}</div>
          <div className="mt-1">
            Rol: {getPrimaryRoleLabel(userRoles)}
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavigationEntry({
  entry,
  onNavigate,
}: {
  entry: NavEntry;
  onNavigate?: () => void;
}) {
  if (isNavGroup(entry)) {
    return (
      <div className="mb-4">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
          {entry.title}
        </div>
        <div className="space-y-1">
          {entry.items.map((item) => (
            <SidebarNavLink
              key={item.href}
              item={item}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    );
  }

  return <SidebarNavLink item={entry} onNavigate={onNavigate} />;
}

function getEntryKey(entry: NavEntry, index: number) {
  if (isNavGroup(entry)) return `group-${entry.title}`;
  return entry.href || `item-${index}`;
}
