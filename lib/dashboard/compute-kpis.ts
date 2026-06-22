import type { DashboardSummary } from "@/types/dashboard";

export type DashboardKpi = {
  id: string;
  title: string;
  value: string;
  currency: string;
  trend: string;
  available: boolean;
  positive?: boolean;
  warning?: boolean;
};

export function buildDashboardKpisFromSummary(
  summary: DashboardSummary,
  formatCop: (n: number) => string,
  formatUsdt: (n: number) => string,
): DashboardKpi[] {
  const saldoInsideAvailable =
    summary.hasLiquidityClose && summary.saldoInsideCop != null;

  const negotiatedAvailable =
    summary.hasNegotiationDay && summary.negotiatedCopToday != null;

  return [
    {
      id: "saldo-inside",
      title: "Saldo INSIDE (hoy)",
      value: saldoInsideAvailable
        ? formatCop(summary.saldoInsideCop!)
        : "—",
      currency: saldoInsideAvailable ? "" : "COP",
      trend: summary.hasLiquidityClose
        ? (summary.liquidityCloseStatus ?? "Cierre registrado")
        : "Sin cierre de liquidez",
      available: saldoInsideAvailable,
      positive: (summary.saldoInsideCop ?? 0) >= 0,
    },
    {
      id: "usdt-net",
      title: "USDT en inventario",
      value: formatUsdt(summary.usdtNetToday).replace(" USDT", ""),
      currency: "USDT",
      trend: `${summary.inventoryMovementCountToday} movimiento${summary.inventoryMovementCountToday === 1 ? "" : "s"} hoy`,
      available: true,
      positive: summary.usdtNetToday >= 0,
    },
    {
      id: "negotiated",
      title: "Negociado hoy",
      value: negotiatedAvailable
        ? formatCop(summary.negotiatedCopToday!)
        : "—",
      currency: "",
      trend: summary.hasNegotiationDay
        ? `${summary.negotiationLineCountToday} línea${summary.negotiationLineCountToday === 1 ? "" : "s"} · ${summary.negotiationDayStatus ?? "Abierto"}`
        : "Sin negociación del día",
      available: negotiatedAvailable,
      positive: (summary.negotiatedCopToday ?? 0) >= 0,
    },
    {
      id: "delivery",
      title: "Pendiente delivery",
      value: formatCop(summary.pendingDeliveryCop),
      currency: "",
      trend: `${summary.deliveryClientsWithBalance} cliente${summary.deliveryClientsWithBalance === 1 ? "" : "s"} con saldo`,
      available: true,
      positive: summary.pendingDeliveryCop >= 0,
    },
    {
      id: "cashout",
      title: "Egresos cash out (mes)",
      value: formatCop(summary.cashOutMonthCop),
      currency: "",
      trend:
        summary.cashOutUnreviewedMonth > 0
          ? `${summary.cashOutUnreviewedMonth} sin revisar`
          : "Mes en curso",
      available: true,
      positive: false,
      warning: summary.cashOutUnreviewedMonth > 0,
    },
    {
      id: "liquidity-open",
      title: "Días sin cerrar liquidez",
      value: String(summary.openLiquidityDaysCount),
      currency: "días",
      trend:
        summary.openLiquidityDaysCount > 0
          ? "Revisar cierres pendientes"
          : "Al día",
      available: true,
      positive: summary.openLiquidityDaysCount === 0,
      warning: summary.openLiquidityDaysCount > 0,
    },
  ];
}
