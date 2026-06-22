"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/config/navigation";
import { INSIDE_COLORS } from "@/config/constants";
import { cn } from "@/lib/utils/cn";

type SidebarNavLinkProps = {
  item: NavItem;
  onNavigate?: () => void;
};

export function SidebarNavLink({ item, onNavigate }: SidebarNavLinkProps) {
  const pathname = usePathname();
  const Icon = item.icon;

  const isActive =
    !item.disabled &&
    (item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`));

  const className = cn(
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
    item.disabled
      ? "cursor-not-allowed text-white/40"
      : isActive
        ? "text-white"
        : "text-white/70 hover:bg-white/5 hover:text-white",
  );

  const content = (
    <>
      <Icon className="size-4 shrink-0" />
      <span className="flex-1">{item.title}</span>
      {item.badge ? (
        <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300">
          {item.badge}
        </span>
      ) : null}
    </>
  );

  if (item.disabled) {
    return (
      <div
        className={className}
        title="Módulo en desarrollo"
        aria-disabled="true"
      >
        {content}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={className}
      style={isActive ? { backgroundColor: INSIDE_COLORS.accent } : undefined}
      onClick={onNavigate}
    >
      {content}
    </Link>
  );
}
