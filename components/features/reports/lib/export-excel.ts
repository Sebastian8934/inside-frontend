import * as XLSX from "xlsx";
import type { ReportTableData } from "@/components/features/reports/lib/report-table";
import { downloadBlob } from "@/components/features/reports/lib/report-table";

export function exportReportToExcel(data: ReportTableData) {
  const headerRow = data.columns.map((column) => column.header);
  const bodyRows = data.rows.map((row) =>
    data.columns.map((column) => row[column.key] ?? ""),
  );

  const sheetData = [
    [data.title],
    data.subtitle ? [data.subtitle] : [],
    [],
    headerRow,
    ...bodyRows,
  ].filter((row) => row.length > 0);

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Informe");

  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  downloadBlob(blob, `${data.fileBaseName}.xlsx`);
}
