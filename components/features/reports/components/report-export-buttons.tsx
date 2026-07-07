"use client";

import { useState } from "react";
import { FileDown, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  exportReport,
  type ReportExportFormat,
} from "@/components/features/reports/lib/export-report";
import type { ReportTableData } from "@/components/features/reports/lib/report-table";

type Props = {
  data: ReportTableData | null;
  disabled?: boolean;
};

const FORMATS: {
  format: ReportExportFormat;
  label: string;
  icon: typeof FileText;
}[] = [
  { format: "pdf", label: "PDF", icon: FileText },
  { format: "excel", label: "Excel", icon: FileSpreadsheet },
  { format: "word", label: "Word", icon: FileDown },
];

export function ReportExportButtons({ data, disabled }: Props) {
  const [exporting, setExporting] = useState<ReportExportFormat | null>(null);

  async function handleExport(format: ReportExportFormat) {
    if (!data || data.rows.length === 0) {
      toast.error("No hay datos para exportar.");
      return;
    }

    setExporting(format);
    try {
      await exportReport(format, data);
      toast.success(`Informe descargado en ${format.toUpperCase()}.`);
    } catch {
      toast.error(`No se pudo generar el archivo ${format.toUpperCase()}.`);
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FORMATS.map(({ format, label, icon: Icon }) => (
        <Button
          key={format}
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || !data || exporting !== null}
          onClick={() => void handleExport(format)}
        >
          {exporting === format ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Icon className="size-4" />
          )}
          {label}
        </Button>
      ))}
    </div>
  );
}
