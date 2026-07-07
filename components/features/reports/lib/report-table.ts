export type ReportColumn = {
  key: string;
  header: string;
  align?: "left" | "right";
};

export type ReportTableData = {
  title: string;
  subtitle?: string;
  columns: ReportColumn[];
  rows: Record<string, string | number>[];
  fileBaseName: string;
};

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
