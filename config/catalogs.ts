export const CATALOG_TYPES = {
  clientes: {
    title: "Clientes",
    description: "Maestro de clientes OTC",
  },
  cartera: {
    title: "Cartera",
    description: "Wallets y direcciones crypto",
  },
  contrapartes: {
    title: "Contrapartes OTC",
    description: "Contrapartes para operaciones OTC",
  },
  plataformas: {
    title: "Plataformas",
    description: "Plataformas de negociación e inventario",
  },
  comerciales: {
    title: "Comerciales",
    description: "Representantes comerciales",
  },
  "cash-out": {
    title: "Cash out",
    description: "Grupos, conceptos y cuentas de pago",
  },
} as const;

export type CatalogType = keyof typeof CATALOG_TYPES;

export function isCatalogType(value: string): value is CatalogType {
  return value in CATALOG_TYPES;
}

export const CATALOG_TYPE_LIST = Object.keys(
  CATALOG_TYPES,
) as CatalogType[];
