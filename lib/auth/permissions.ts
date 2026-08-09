import type { NavEntry, NavGroup, NavItem } from "@/config/navigation";
import { isNavGroup, navigation } from "@/config/navigation";
import { PERMISSION_CODES } from "@/config/permissions";
import {
  OPERATOR_ROLES,
  ROLE_IDS,
} from "@/config/roles";

export { getPrimaryRoleLabel, getRoleLabel } from "@/config/roles";
export { OPERATOR_ROLES } from "@/config/roles";
export { PERMISSION_CODES } from "@/config/permissions";

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

export function isSuperUser(userRoles: string[]) {
  return userRoles.includes(ROLE_IDS.SuperUser);
}

export function hasPermission(
  userPermissions: string[] | undefined | null,
  permissionCode: string,
  _userRoles: string[] = [],
) {
  // Los permisos efectivos vienen del login /api/permissions/me (RolePermission).
  // SuperUser ya no bypasa el menú: si quitas un permiso del rol y refrescas, se oculta.
  return Boolean(userPermissions?.includes(permissionCode));
}

export function hasAnyPermission(
  userPermissions: string[] | undefined | null,
  permissionCodes: string[],
  _userRoles: string[] = [],
) {
  return permissionCodes.some((code) => userPermissions?.includes(code));
}

function collectNavHrefs(entries: NavEntry[]): string[] {
  return entries.flatMap((entry) => {
    if (isNavGroup(entry)) {
      return entry.items.map((item) => item.href);
    }
    return [entry.href];
  });
}

/**
 * Rutas de módulos activos (Module.Route).
 * null = aún no cargados (no filtrar por módulo).
 */
export function isPathEnabledByModules(
  pathname: string,
  activeModuleRoutes: string[] | null | undefined,
): boolean {
  if (activeModuleRoutes == null) {
    return true;
  }

  return activeModuleRoutes.some((route) => {
    const normalized = route.trim();
    if (!normalized) return false;
    if (normalized === "/") return pathname === "/";
    return (
      pathname === normalized || pathname.startsWith(`${normalized}/`)
    );
  });
}

/** Un ítem del menú se muestra si su href está cubierto por algún módulo activo. */
export function isHrefEnabledByModules(
  href: string,
  activeModuleRoutes: string[] | null | undefined,
): boolean {
  if (activeModuleRoutes == null) {
    return true;
  }

  if (isPathEnabledByModules(href, activeModuleRoutes)) {
    return true;
  }

  // p. ej. menú /catalogos visible si hay submódulo activo /catalogos/clientes
  return activeModuleRoutes.some((route) => {
    const normalized = route.trim();
    if (!normalized || normalized === "/") return false;
    return normalized.startsWith(`${href}/`);
  });
}

export function getAccessibleHrefs(
  userRoles: string[],
  userPermissions: string[] = [],
  activeModuleRoutes: string[] | null = null,
) {
  return collectNavHrefs(
    filterNavigation(
      navigation,
      userRoles,
      userPermissions,
      activeModuleRoutes,
    ),
  );
}

/** Primera ruta del menú a la que el usuario puede entrar (o null). */
export function getFirstAccessibleHref(
  userRoles: string[],
  userPermissions: string[] = [],
  activeModuleRoutes: string[] | null = null,
): string | null {
  return (
    getAccessibleHrefs(userRoles, userPermissions, activeModuleRoutes)[0] ??
    null
  );
}

export function canAccessRoute(
  pathname: string,
  userRoles: string[],
  userPermissions: string[] = [],
  activeModuleRoutes: string[] | null = null,
) {
  if (!isPathEnabledByModules(pathname, activeModuleRoutes)) {
    return false;
  }

  const allowedHrefs = getAccessibleHrefs(
    userRoles,
    userPermissions,
    activeModuleRoutes,
  );

  if (pathname === "/" || pathname === "") {
    return (
      hasPermission(userPermissions, PERMISSION_CODES.DashboardView, userRoles) ||
      allowedHrefs.includes("/")
    );
  }

  return allowedHrefs.some(
    (href) =>
      href !== "/" &&
      (pathname === href || pathname.startsWith(`${href}/`)),
  );
}

export function canManageUsers(
  userRoles: string[],
  userPermissions: string[] = [],
) {
  return hasPermission(
    userPermissions,
    PERMISSION_CODES.AdministrationManage,
    userRoles,
  );
}

export function canManageCatalogs(
  userRoles: string[],
  userPermissions: string[] = [],
) {
  return hasAnyPermission(
    userPermissions,
    [
      PERMISSION_CODES.CatalogsManage,
      PERMISSION_CODES.CatalogsCreate,
      PERMISSION_CODES.CatalogsEdit,
    ],
    userRoles,
  );
}

export function canAccessNavItem(
  item: NavItem,
  userRoles: string[],
  userPermissions: string[] = [],
  activeModuleRoutes: string[] | null = null,
) {
  if (!isHrefEnabledByModules(item.href, activeModuleRoutes)) {
    return false;
  }

  if (item.permission) {
    return hasPermission(userPermissions, item.permission, userRoles);
  }

  if (item.permissions?.length) {
    return hasAnyPermission(userPermissions, item.permissions, userRoles);
  }

  // Compatibilidad legacy por roles si el ítem aún no tiene permission.
  if (item.roles?.length && !hasAnyRole(userRoles, item.roles)) {
    return false;
  }

  if (
    item.policy === "ManageUsers" &&
    !canManageUsers(userRoles, userPermissions)
  ) {
    return false;
  }

  if (
    item.policy === "ManageCatalogs" &&
    !canManageCatalogs(userRoles, userPermissions)
  ) {
    return false;
  }

  return true;
}

export function filterNavigation(
  entries: NavEntry[],
  userRoles: string[],
  userPermissions: string[] = [],
  activeModuleRoutes: string[] | null = null,
): NavEntry[] {
  return entries
    .map((entry) => {
      if (isNavGroup(entry)) {
        const items = entry.items.filter((item) =>
          canAccessNavItem(
            item,
            userRoles,
            userPermissions,
            activeModuleRoutes,
          ),
        );

        if (items.length === 0) return null;

        return { ...entry, items } satisfies NavGroup;
      }

      return canAccessNavItem(
        entry,
        userRoles,
        userPermissions,
        activeModuleRoutes,
      )
        ? entry
        : null;
    })
    .filter((entry): entry is NavEntry => entry !== null);
}
