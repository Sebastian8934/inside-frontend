import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ReportTableData } from "@/components/features/reports/lib/report-table";

export function exportReportToPdf(data: ReportTableData) {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

  doc.setFontSize(14);
  doc.text(data.title, 40, 36);

  if (data.subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(90);
    doc.text(data.subtitle, 40, 54);
    doc.setTextColor(0);
  }

  autoTable(doc, {
    startY: data.subtitle ? 68 : 50,
    head: [data.columns.map((column) => column.header)],
    body: data.rows.map((row) =>
      data.columns.map((column) => String(row[column.key] ?? "")),
    ),
    styles: {
      fontSize: 8,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
    },
    columnStyles: Object.fromEntries(
      data.columns.map((column, index) => [
        index,
        { halign: column.align === "right" ? "right" : "left" },
      ]),
    ),
  });

  doc.save(`${data.fileBaseName}.pdf`);
}
