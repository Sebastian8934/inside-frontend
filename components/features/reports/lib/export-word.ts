import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { ReportTableData } from "@/components/features/reports/lib/report-table";
import { downloadBlob } from "@/components/features/reports/lib/report-table";

function cell(text: string, options?: { bold?: boolean; alignRight?: boolean }) {
  return new TableCell({
    width: { size: 1200, type: WidthType.DXA },
    children: [
      new Paragraph({
        alignment: options?.alignRight
          ? AlignmentType.RIGHT
          : AlignmentType.LEFT,
        children: [
          new TextRun({
            text,
            bold: options?.bold,
            size: 18,
          }),
        ],
      }),
    ],
  });
}

export async function exportReportToWord(data: ReportTableData) {
  const headerRow = new TableRow({
    children: data.columns.map((column) =>
      cell(column.header, {
        bold: true,
        alignRight: column.align === "right",
      }),
    ),
  });

  const bodyRows = data.rows.map(
    (row) =>
      new TableRow({
        children: data.columns.map((column) =>
          cell(String(row[column.key] ?? ""), {
            alignRight: column.align === "right",
          }),
        ),
      }),
  );

  const document = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: data.title,
            heading: HeadingLevel.HEADING_1,
          }),
          ...(data.subtitle
            ? [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: data.subtitle,
                      italics: true,
                      size: 20,
                      color: "666666",
                    }),
                  ],
                }),
              ]
            : []),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [headerRow, ...bodyRows],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(document);
  downloadBlob(blob, `${data.fileBaseName}.docx`);
}
