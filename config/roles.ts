/** Identificadores de rol (Identity / API). No cambiar sin migrar la BD. */
export const ROLE_IDS = {
  Admin: "Admin",
  SuperUser: "SuperUser",
  Client: "Client",
  Employee: "Employee",
} as const;

export type RoleId = (typeof ROLE_IDS)[keyof typeof ROLE_IDS];

/** Catálogo único de roles con etiqueta visible en la UI. */
export const APP_ROLES: ReadonlyArray<{ id: RoleId; label: string }> = [
  { id: ROLE_IDS.Admin, label: "Administrador" },
  { id: ROLE_IDS.SuperUser, label: "SuperUsuario" },
  { id: ROLE_IDS.Client, label: "Cliente" },
  { id: ROLE_IDS.Employee, label: "Empleado" },
];

export const ROLE_LABELS: Record<RoleId, string> = Object.fromEntries(
  APP_ROLES.map((role) => [role.id, role.label]),
) as Record<RoleId, string>;

export const INSIDE_ROLES = APP_ROLES.map((role) => role.id);

export const OPERATOR_ROLES: RoleId[] = [
  ROLE_IDS.SuperUser,
  ROLE_IDS.Admin,
  ROLE_IDS.Employee,
];

export const MANAGE_USERS_ROLES: RoleId[] = [
  ROLE_IDS.SuperUser,
  ROLE_IDS.Admin,
];

/** Nombres legacy en BD (español) → ID canónico. */
const LEGACY_ROLE_ALIASES: Record<string, RoleId> = {
  SuperUsuario: ROLE_IDS.SuperUser,
  Administrador: ROLE_IDS.Admin,
  Empleado: ROLE_IDS.Employee,
  Cliente: ROLE_IDS.Client,
};

export function normalizeRoleId(role: string): string {
  if (role in ROLE_LABELS) {
    return role;
  }

  return LEGACY_ROLE_ALIASES[role] ?? role;
}

export function normalizeRoleIds(roles: string[] | undefined | null): string[] {
  if (!roles?.length) {
    return [];
  }

  return [...new Set(roles.map(normalizeRoleId))];
}

export function getRoleLabel(roleId: string): string {
  return ROLE_LABELS[roleId as RoleId] ?? roleId;
}

/** Rol principal para mostrar cuando el usuario tiene varios. */
export function getPrimaryRoleLabel(roles: string[]): string {
  const priority: RoleId[] = [
    ROLE_IDS.SuperUser,
    ROLE_IDS.Admin,
    ROLE_IDS.Employee,
    ROLE_IDS.Client,
  ];

  for (const roleId of priority) {
    if (roles.includes(roleId)) {
      return getRoleLabel(roleId);
    }
  }

  return roles[0] ? getRoleLabel(roles[0]) : "Usuario";
}
