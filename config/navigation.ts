import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Building2,
  Coins,
  Database,
  FileBarChart2,
  Handshake,
  History,
  Landmark,
  LayoutDashboard,
  Package,
  UserCog,
  Truck,
  Wallet,
} from "lucide-react";
import { INSIDE_ROLES, MANAGE_USERS_ROLES, OPERATOR_ROLES, ROLE_IDS } from "@/config/roles";

export type InsideRole = (typeof INSIDE_ROLES)[number];
export { INSIDE_ROLES };

const ALL_AUTHENTICATED_ROLES = [
  ...OPERATOR_ROLES,
  ROLE_IDS.Client,
] as const;

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  /** Roles que pueden ver este ítem. Vacío = todos los autenticados. */
  roles?: string[];
  /** Política del back requerida (referencia para Fase 1+) */
  policy?: "ManageUsers" | "ManageCatalogs";
  /** Ítem visible pero sin ruta implementada aún */
  disabled?: boolean;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type NavEntry = NavItem | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}

/** Navegación alineada al mock INSIDE. */
export const navigation: NavEntry[] = [
  { title: "Inicio", href: "/", icon: LayoutDashboard },
  {
    title: "OPERACIONES",
    items: [
      {
        title: "Inventario USDT",
        href: "/inventario",
        icon: Package,
        roles: [...OPERATOR_ROLES],
      },
      {
        title: "Negociaciones",
        href: "/negociaciones",
        icon: Handshake,
        roles: [...OPERATOR_ROLES],
      },
    ],
  },
  {
    title: "TESORERÍA",
    items: [
      {
        title: "Liquidez diaria",
        href: "/liquidez",
        icon: Landmark,
        roles: [...OPERATOR_ROLES],
      },
      {
        title: "Delivery",
        href: "/delivery",
        icon: Truck,
        roles: [...ALL_AUTHENTICATED_ROLES],
      },
      {
        title: "Préstamos USDT",
        href: "/prestamos-usdt",
        icon: Coins,
        roles: [...ALL_AUTHENTICATED_ROLES],
      },
    ],
  },
  {
    title: "FINANZAS",
    items: [
      {
        title: "Cash out",
        href: "/cash-out",
        icon: Wallet,
        roles: [...OPERATOR_ROLES],
      },
      {
        title: "Retiros",
        href: "/retiros",
        icon: Banknote,
        roles: [...OPERATOR_ROLES],
      },
      {
        title: "Bancos",
        href: "/bancos",
        icon: Building2,
        roles: [...OPERATOR_ROLES],
      },
    ],
  },
  {
    title: "INFORMES",
    items: [
      {
        title: "Informes",
        href: "/informes",
        icon: FileBarChart2,
        roles: [...OPERATOR_ROLES],
      },
    ],
  },
  {
    title: "CATÁLOGOS",
    items: [
      {
        title: "Catálogos",
        href: "/catalogos",
        icon: Database,
        roles: [...OPERATOR_ROLES],
      },
    ],
  },

  {
    title: "ADMINISTRACIÓN",
    items: [
      {
        title: "Administración",
        href: "/administracion",
        icon: UserCog,
        roles: [...MANAGE_USERS_ROLES],
        policy: "ManageUsers",
      },
    ],
  },
  {
    title: "AUDITORÍA",
    items: [
      {
        title: "Auditoría",
        href: "/auditoria",
        icon: History,
        roles: [...OPERATOR_ROLES],
      },
    ],
  },
];
