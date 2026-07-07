import type { DailyNegotiationDetail } from "@/types/negotiations";
import type { ReportTableData } from "@/components/features/reports/lib/report-table";
import { formatCop, formatDateOnly, formatUsdt } from "@/lib/utils/format";

export function buildNegotiationsDayReportData(
  day: DailyNegotiationDetail,
): ReportTableData {
  const reportRows = day.lines.map((line) => ({
    linea: String(line.lineNumber),
    plataforma: line.platformName ?? "—",
    contraparte: line.otcCounterpartyCode ?? "—",
    lado: line.side ?? "—",
    usdt: line.quantityUsdt != null ? formatUsdt(line.quantityUsdt) : "—",
    tasaNeta: line.netRate ?? "—",
    totalCop: line.totalCop != null ? formatCop(line.totalCop) : "—",
    estado: line.status,
  }));

  if (day.grandTotalCop != null) {
    reportRows.push({
      linea: "",
      plataforma: "",
      contraparte: "",
      lado: "TOTAL",
      usdt: "",
      tasaNeta: "",
      totalCop: formatCop(day.grandTotalCop),
      estado: day.status,
    });
  }

  return {
    title: "Negociaciones del día",
    subtitle: `Fecha: ${formatDateOnly(day.operationDate)} · Estado: ${day.status} · Generado: ${new Date().toLocaleString("es-CO")}`,
    fileBaseName: `negociaciones-${day.operationDate}`,
    columns: [
      { key: "linea", header: "#" },
      { key: "plataforma", header: "Plataforma" },
      { key: "contraparte", header: "Contraparte" },
      { key: "lado", header: "Lado" },
      { key: "usdt", header: "USDT", align: "right" },
      { key: "tasaNeta", header: "Tasa neta", align: "right" },
      { key: "totalCop", header: "Total COP", align: "right" },
      { key: "estado", header: "Estado" },
    ],
    rows: reportRows,
  };
}
