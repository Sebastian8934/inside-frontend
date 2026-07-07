export type ReportDefinition = {
  id: string;
  title: string;
  description: string;
  href: string;
  /** Origen en Excel de negocio */
  excelSource: string;
  available: boolean;
};

/**
 * Catálogo de informes. Solo los marcados como available tienen pantalla.
 * Los demás quedan listados como próximos (Fases futuras).
 */
export const REPORTS: ReportDefinition[] = [
  {
    id: "resumen-clientes-delivery",
    title: "Resumen clientes delivery",
    description:
      "Saldos por cliente: por pagar, pagado y saldo total (histórico y año vigente).",
    href: "/informes/resumen-clientes-delivery",
    excelSource: "6. DELIVERY BUSINESS.xlsx → hoja Resumen Clientes",
    available: true,
  },
  {
    id: "resumen-otc",
    title: "Resumen contrapartes OTC",
    description:
      "Dispersado, cobro, utilidad y saldo USDT por mesa OTC.",
    href: "/informes/resumen-otc",
    excelSource: "2. INVENTARIO 2026.xlsx → hojas por contraparte / Resumen OTC",
    available: true,
  },
  {
    id: "liquidez-diaria",
    title: "Liquidez diaria (SALDO INSIDE)",
    description:
      "Cierre de tesorería del día: cuentas, efectivo, delivery y USDT.",
    href: "/informes/liquidez-diaria",
    excelSource: "Líquidez diaria 2026 - INSIDE GROUP.xlsx",
    available: true,
  },
  {
    id: "negociaciones-dia",
    title: "Negociaciones del día",
    description:
      "Consolidado comercial del día: líneas, tasas y totales por plataforma.",
    href: "/informes/negociaciones-dia",
    excelSource: "NEGOCIACIONES DIARIAS 2026.xlsx → hoja por fecha",
    available: true,
  },
];

export function getReportById(id: string): ReportDefinition | undefined {
  return REPORTS.find((report) => report.id === id);
}
