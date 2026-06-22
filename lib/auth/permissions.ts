import type { NavEntry, NavGroup, NavItem } from "@/config/navigation";
import { isNavGroup, navigation } from "@/config/navigation";
import {
  MANAGE_USERS_ROLES,
  OPERATOR_ROLES,
  ROLE_IDS,
} from "@/config/roles";

export { getPrimaryRoleLabel, getRoleLabel } from "@/config/roles";
export { OPERATOR_ROLES } from "@/config/roles";

export function hasAnyRole(userRoles: string[], allowedRoles: string[]) {
  return allowedRoles.some((role) => userRoles.includes(role));
}

export function isOperator(userRoles: string[]) {
  return hasAnyRole(userRoles, [...OPERATOR_ROLES]);
}

/** Usuario con rol Client sin roles operativos (portal de solo lectura). */
export function isClientOnly(userRoles: string[]) {
  return userRoles.includes(ROLE_IDS.Client) && !isOperator(userRoles);
}

function collectNavHrefs(entries: NavEntry[]): string[] {
  return entries.flatMap((entry) => {
    if (isNavGroup(entry)) {
      return entry.items.map((item) => item.href);
    }
    return [entry.href];
  });
}

export function canAccessRoute(pathname: string, userRoles: string[]) {
  if (!isClientOnly(userRoles)) {
    return true;
  }

  const allowedHrefs = collectNavHrefs(filterNavigation(navigation, userRoles));

  return allowedHrefs.some(
    (href) => pathname === href || pathname.startsWith(`${href}/`),
  );
}

export function canManageUsers(userRoles: string[]) {
  return hasAnyRole(userRoles, [...MANAGE_USERS_ROLES]);
}

export function canManageCatalogs(userRoles: string[]) {
  return hasAnyRole(userRoles, [...MANAGE_USERS_ROLES]);
}

export function canAccessNavItem(item: NavItem, userRoles: string[]) {
  if (item.roles?.length && !hasAnyRole(userRoles, item.roles)) {
    return false;
  }

  if (item.policy === "ManageUsers" && !canManageUsers(userRoles)) {
    return false;
  }

  if (item.policy === "ManageCatalogs" && !canManageCatalogs(userRoles)) {
    return false;
  }

  return true;
}

export function filterNavigation(
  entries: NavEntry[],
  userRoles: string[],
): NavEntry[] {
  return entries
    .map((entry) => {
      if (isNavGroup(entry)) {
        const items = entry.items.filter((item) =>
          canAccessNavItem(item, userRoles),
        );

        if (items.length === 0) return null;

        return { ...entry, items } satisfies NavGroup;
      }

      return canAccessNavItem(entry, userRoles) ? entry : null;
    })
    .filter((entry): entry is NavEntry => entry !== null);
}
