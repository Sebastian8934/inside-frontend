import type { DailyLiquidityCloseDetail } from "@/types/liquidity";
import { LIQUIDITY_CATEGORY_LABELS } from "@/types/liquidity";
import type { ReportTableData } from "@/components/features/reports/lib/report-table";
import { formatCop, formatDateOnly } from "@/lib/utils/format";

export function buildLiquidityDailyReportData(
  close: DailyLiquidityCloseDetail,
): ReportTableData {
  const summaryRows = [
    {
      concepto: "Cuentas bancarias",
      valor: formatCop(close.accountsBalanceCop ?? 0),
    },
    {
      concepto: "Efectivo",
      valor: formatCop(close.cashBalanceCop ?? 0),
    },
    {
      concepto: "CxP proveedor",
      valor: formatCop(close.payablesBalanceCop ?? 0),
    },
    {
      concepto: "Pendiente delivery",
      valor: formatCop(close.pendingDeliveryCop ?? 0),
    },
    {
      concepto: "Cargue USDT",
      valor: formatCop(close.usdtBalanceCop ?? 0),
    },
    {
      concepto: "SALDO INSIDE",
      valor: formatCop(close.saldoInsideCop ?? 0),
    },
  ];

  const lineRows = close.positionLines.map((line) => ({
    categoria: LIQUIDITY_CATEGORY_LABELS[line.category] ?? line.category,
    concepto: line.concept,
    monto: formatCop(line.amountCop),
  }));

  return {
    title: "Liquidez diaria — SALDO INSIDE",
    subtitle: `Fecha: ${formatDateOnly(close.operationDate)} · Estado: ${close.status} · Generado: ${new Date().toLocaleString("es-CO")}`,
    fileBaseName: `liquidez-diaria-${close.operationDate}`,
    columns: [
      { key: "concepto", header: "Concepto" },
      { key: "valor", header: "Valor COP", align: "right" },
    ],
    rows: [
      ...summaryRows,
      ...(lineRows.length > 0
        ? [
            { concepto: "—", valor: "—" },
            { concepto: "DETALLE DE POSICIONES", valor: "" },
            ...lineRows.map((line) => ({
              concepto: `${line.categoria}: ${line.concepto}`,
              valor: line.monto,
            })),
          ]
        : []),
    ],
  };
}
