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
import { INSIDE_ROLES } from "@/config/roles";
import { PERMISSION_CODES } from "@/config/permissions";

export type InsideRole = (typeof INSIDE_ROLES)[number];
export { INSIDE_ROLES };

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  /** Permiso requerido para ver el ítem (preferido). */
  permission?: string;
  /** Alternativa: cualquiera de estos permisos. */
  permissions?: string[];
  /** @deprecated Preferir permission. Roles legacy. */
  roles?: string[];
  /** Política legacy del back. */
  policy?: "ManageUsers" | "ManageCatalogs";
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

/** Navegación alineada a módulos/permisos. */
export const navigation: NavEntry[] = [
  {
    title: "Inicio",
    href: "/",
    icon: LayoutDashboard,
    permission: PERMISSION_CODES.DashboardView,
  },
  {
    title: "OPERACIONES",
    items: [
      {
        title: "Inventario USDT",
        href: "/inventario",
        icon: Package,
        permission: PERMISSION_CODES.InventoryView,
      },
      {
        title: "Negociaciones",
        href: "/negociaciones",
        icon: Handshake,
        permission: PERMISSION_CODES.NegotiationsView,
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
        permission: PERMISSION_CODES.LiquidityView,
      },
      {
        title: "Delivery",
        href: "/delivery",
        icon: Truck,
        permission: PERMISSION_CODES.DeliveryView,
      },
      {
        title: "Préstamos USDT",
        href: "/prestamos-usdt",
        icon: Coins,
        permission: PERMISSION_CODES.UsdtLoansView,
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
        permission: PERMISSION_CODES.CashOutView,
      },
      {
        title: "Retiros",
        href: "/retiros",
        icon: Banknote,
        permission: PERMISSION_CODES.WithdrawalsView,
      },
      {
        title: "Bancos",
        href: "/bancos",
        icon: Building2,
        permission: PERMISSION_CODES.BankingView,
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
        permission: PERMISSION_CODES.ReportsView,
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
        permission: PERMISSION_CODES.CatalogsView,
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
        permissions: [
          PERMISSION_CODES.AdministrationView,
          PERMISSION_CODES.AdministrationManage,
        ],
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
        permission: PERMISSION_CODES.ActivityLogView,
      },
    ],
  },
];
