"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useOtcSummaryList } from "@/components/features/inventory/otc-summary/hooks/use-otc-summary-list";
import { ReportExportButtons } from "@/components/features/reports/components/report-export-buttons";
import { buildOtcSummaryReportData } from "@/components/features/reports/lib/build-otc-summary-report";
import { OperationDateFilter } from "@/components/shared/operation-date-filter";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useOperationDate } from "@/hooks/use-operation-date";
import { formatCop, formatUsdt, usdtColorClass } from "@/lib/utils/format";

export function OtcSummaryReport() {
  const companyId = useActiveCompanyId();
  const { operationDate, setOperationDate, operationDateString } =
    useOperationDate();

  const { data = [], isLoading } = useOtcSummaryList({
    companyId,
    date: operationDateString,
  });

  const reportData = useMemo(
    () =>
      data.length > 0
        ? buildOtcSummaryReportData(data, operationDateString)
        : null,
    [data, operationDateString],
  );

  const totals = useMemo(
    () =>
      data.reduce(
        (acc, row) => ({
          dispersadoCop: acc.dispersadoCop + row.dispersadoCop,
          cobroCop: acc.cobroCop + row.cobroCop,
          utilidadCop: acc.utilidadCop + row.utilidadCop,
          saldoUsdt: acc.saldoUsdt + row.saldoUsdt,
        }),
        { dispersadoCop: 0, cobroCop: 0, utilidadCop: 0, saldoUsdt: 0 },
      ),
    [data],
  );

  if (!companyId) {
    return (
      <div className="p-6">
        <EmptyState message="Seleccione una empresa para generar el informe." />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/informes">
            <ArrowLeft className="size-4" />
            Informes
          </Link>
        </Button>
      </div>

      <PageHeader
        title="Resumen contrapartes OTC"
        description="Dispersado, cobro, utilidad y saldo USDT por mesa OTC del día."
        filters={
          <OperationDateFilter
            date={operationDate}
            onDateChange={setOperationDate}
          />
        }
        actions={
          <ReportExportButtons
            data={reportData}
            disabled={isLoading || data.length === 0}
          />
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Dispersado" value={formatCop(totals.dispersadoCop)} />
        <KpiCard label="Cobro" value={formatCop(totals.cobroCop)} />
        <KpiCard label="Utilidad" value={formatCop(totals.utilidadCop)} highlight />
        <KpiCard label="Saldo USDT" value={formatUsdt(totals.saldoUsdt)} />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingState label="Cargando informe..." />
          ) : data.length === 0 ? (
            <EmptyState message="Sin datos OTC para la fecha seleccionada." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contraparte</TableHead>
                  <TableHead className="text-right">Dispersado</TableHead>
                  <TableHead className="text-right">Cobro</TableHead>
                  <TableHead className="text-right">Utilidad</TableHead>
                  <TableHead className="text-right">Saldo USDT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.otcCounterpartyId}>
                    <TableCell className="font-medium">
                      {row.otcCounterpartyCode}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(row.dispersadoCop)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(row.cobroCop)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(row.utilidadCop)}
                    </TableCell>
                    <TableCell
                      className={`text-right tabular-nums ${usdtColorClass(row.saldoUsdt)}`}
                    >
                      {formatUsdt(row.saldoUsdt)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100 font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCop(totals.dispersadoCop)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCop(totals.cobroCop)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCop(totals.utilidadCop)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatUsdt(totals.saldoUsdt)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-blue-200 bg-blue-50/50" : undefined}>
      <CardContent className="p-4">
        <p className="text-xs text-gray-600">{label.toUpperCase()}</p>
        <p
          className={`text-xl font-bold tabular-nums ${
            highlight ? "text-blue-900" : ""
          }`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
