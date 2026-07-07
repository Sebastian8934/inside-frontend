import type { OtcSummaryItem } from "@/types/inventory";
import type { ReportTableData } from "@/components/features/reports/lib/report-table";
import { formatCop, formatDateOnly, formatUsdt } from "@/lib/utils/format";

export function buildOtcSummaryReportData(
  rows: OtcSummaryItem[],
  date: string,
): ReportTableData {
  const totals = rows.reduce(
    (acc, row) => ({
      dispersadoCop: acc.dispersadoCop + row.dispersadoCop,
      cobroCop: acc.cobroCop + row.cobroCop,
      utilidadCop: acc.utilidadCop + row.utilidadCop,
      saldoUsdt: acc.saldoUsdt + row.saldoUsdt,
    }),
    { dispersadoCop: 0, cobroCop: 0, utilidadCop: 0, saldoUsdt: 0 },
  );

  const reportRows = [
    ...rows.map((row) => ({
      contraparte: row.otcCounterpartyCode,
      dispersado: formatCop(row.dispersadoCop),
      cobro: formatCop(row.cobroCop),
      utilidad: formatCop(row.utilidadCop),
      saldoUsdt: formatUsdt(row.saldoUsdt),
    })),
    {
      contraparte: "TOTAL",
      dispersado: formatCop(totals.dispersadoCop),
      cobro: formatCop(totals.cobroCop),
      utilidad: formatCop(totals.utilidadCop),
      saldoUsdt: formatUsdt(totals.saldoUsdt),
    },
  ];

  return {
    title: "Resumen contrapartes OTC",
    subtitle: `Fecha: ${formatDateOnly(date)} · Generado: ${new Date().toLocaleString("es-CO")}`,
    fileBaseName: `resumen-otc-${date}`,
    columns: [
      { key: "contraparte", header: "Contraparte" },
      { key: "dispersado", header: "Dispersado COP", align: "right" },
      { key: "cobro", header: "Cobro COP", align: "right" },
      { key: "utilidad", header: "Utilidad COP", align: "right" },
      { key: "saldoUsdt", header: "Saldo USDT", align: "right" },
    ],
    rows: reportRows,
  };
}
