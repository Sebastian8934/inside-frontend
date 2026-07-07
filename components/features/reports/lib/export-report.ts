import type { ReportTableData } from "@/components/features/reports/lib/report-table";
import { exportReportToExcel } from "@/components/features/reports/lib/export-excel";
import { exportReportToPdf } from "@/components/features/reports/lib/export-pdf";
import { exportReportToWord } from "@/components/features/reports/lib/export-word";

export type ReportExportFormat = "pdf" | "excel" | "word";

export async function exportReport(
  format: ReportExportFormat,
  data: ReportTableData,
) {
  switch (format) {
    case "pdf":
      exportReportToPdf(data);
      return;
    case "excel":
      exportReportToExcel(data);
      return;
    case "word":
      await exportReportToWord(data);
      return;
    default: {
      const _exhaustive: never = format;
      throw new Error(`Formato no soportado: ${_exhaustive}`);
    }
  }
}
