import type { DeliveryClientSummary } from "@/types/delivery";
import type { ReportTableData } from "@/components/features/reports/lib/report-table";
import { formatCop } from "@/lib/utils/format";

export function buildDeliveryClientsReportData(
  rows: DeliveryClientSummary[],
  year: number,
): ReportTableData {
  const totals = rows.reduce(
    (acc, row) => ({
      porPagarTotal: acc.porPagarTotal + row.porPagarTotal,
      pagadoTotal: acc.pagadoTotal + row.pagadoTotal,
      saldoPriorYear: acc.saldoPriorYear + row.saldoPriorYear,
      porPagarCurrentYear:
        acc.porPagarCurrentYear + row.porPagarCurrentYear,
      pagadoCurrentYear: acc.pagadoCurrentYear + row.pagadoCurrentYear,
      saldoCurrentYear: acc.saldoCurrentYear + row.saldoCurrentYear,
      saldoTotal: acc.saldoTotal + row.saldoTotal,
    }),
    {
      porPagarTotal: 0,
      pagadoTotal: 0,
      saldoPriorYear: 0,
      porPagarCurrentYear: 0,
      pagadoCurrentYear: 0,
      saldoCurrentYear: 0,
      saldoTotal: 0,
    },
  );

  const reportRows = [
    ...rows.map((row) => ({
      cliente: row.clientCode,
      porPagarTotal: formatCop(row.porPagarTotal),
      pagadoTotal: formatCop(row.pagadoTotal),
      saldoPriorYear: formatCop(row.saldoPriorYear),
      porPagarCurrentYear: formatCop(row.porPagarCurrentYear),
      pagadoCurrentYear: formatCop(row.pagadoCurrentYear),
      saldoCurrentYear: formatCop(row.saldoCurrentYear),
      saldoTotal: formatCop(row.saldoTotal),
    })),
    {
      cliente: "TOTAL",
      porPagarTotal: formatCop(totals.porPagarTotal),
      pagadoTotal: formatCop(totals.pagadoTotal),
      saldoPriorYear: formatCop(totals.saldoPriorYear),
      porPagarCurrentYear: formatCop(totals.porPagarCurrentYear),
      pagadoCurrentYear: formatCop(totals.pagadoCurrentYear),
      saldoCurrentYear: formatCop(totals.saldoCurrentYear),
      saldoTotal: formatCop(totals.saldoTotal),
    },
  ];

  return {
    title: "Resumen clientes delivery",
    subtitle: `Año vigente: ${year} · Generado: ${new Date().toLocaleString("es-CO")}`,
    fileBaseName: `resumen-clientes-delivery-${year}`,
    columns: [
      { key: "cliente", header: "Cliente" },
      { key: "porPagarTotal", header: "Por pagar", align: "right" },
      { key: "pagadoTotal", header: "Pagado", align: "right" },
      { key: "saldoPriorYear", header: "Saldo año ant.", align: "right" },
      {
        key: "porPagarCurrentYear",
        header: `Por pagar ${year}`,
        align: "right",
      },
      {
        key: "pagadoCurrentYear",
        header: `Pagado ${year}`,
        align: "right",
      },
      {
        key: "saldoCurrentYear",
        header: `Saldo ${year}`,
        align: "right",
      },
      { key: "saldoTotal", header: "Saldo total", align: "right" },
    ],
    rows: reportRows,
  };
}
