"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { useNegotiationDayDetail } from "@/components/features/negotiations/hooks/use-negotiation-day-detail";
import { useNegotiationDays } from "@/components/features/negotiations/hooks/use-negotiation-days";
import { ReportExportButtons } from "@/components/features/reports/components/report-export-buttons";
import { buildNegotiationsDayReportData } from "@/components/features/reports/lib/build-negotiations-day-report";
import { OperationDateFilter } from "@/components/shared/operation-date-filter";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useOperationDate } from "@/hooks/use-operation-date";
import { formatCop, formatDateOnly, formatUsdt } from "@/lib/utils/format";

export function NegotiationsDayReport() {
  const companyId = useActiveCompanyId();
  const { operationDate, setOperationDate, operationDateString } =
    useOperationDate();

  const dayFilters = useMemo(
    () => ({
      companyId,
      dateFrom: operationDateString,
      dateTo: operationDateString,
    }),
    [companyId, operationDateString],
  );

  const { data: dayList, isLoading: listLoading } =
    useNegotiationDays(dayFilters);
  const dayId = dayList?.[0]?.id;

  const { data: dayDetail, isLoading: detailLoading } =
    useNegotiationDayDetail(dayId, companyId);

  const reportData = useMemo(
    () => (dayDetail ? buildNegotiationsDayReportData(dayDetail) : null),
    [dayDetail],
  );

  const isLoading = listLoading || (dayId ? detailLoading : false);

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
        title="Negociaciones del día"
        description="Consolidado comercial del día: líneas, tasas y totales."
        filters={
          <OperationDateFilter
            date={operationDate}
            onDateChange={setOperationDate}
          />
        }
        actions={
          <ReportExportButtons
            data={reportData}
            disabled={isLoading || !dayDetail}
          />
        }
      />

      {isLoading ? (
        <LoadingState label="Cargando negociaciones..." />
      ) : !dayDetail ? (
        <EmptyState
          message={`No hay negociaciones para ${formatDateOnly(operationDateString)}.`}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-600">ESTADO</p>
                <Badge className="mt-1">{dayDetail.status}</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-600">LÍNEAS</p>
                <p className="text-xl font-bold">{dayDetail.lines.length}</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-4">
                <p className="text-xs text-gray-600">TOTAL NEGOCIADO</p>
                <p className="text-xl font-bold tabular-nums text-blue-900">
                  {dayDetail.grandTotalCop != null
                    ? formatCop(dayDetail.grandTotalCop)
                    : "—"}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-0">
              {dayDetail.lines.length === 0 ? (
                <EmptyState message="Sin líneas de negociación registradas." />
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Plataforma</TableHead>
                        <TableHead>Contraparte</TableHead>
                        <TableHead>Lado</TableHead>
                        <TableHead className="text-right">USDT</TableHead>
                        <TableHead className="text-right">Tasa neta</TableHead>
                        <TableHead className="text-right">Total COP</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dayDetail.lines.map((line) => (
                        <TableRow key={line.id}>
                          <TableCell>{line.lineNumber}</TableCell>
                          <TableCell>{line.platformName ?? "—"}</TableCell>
                          <TableCell>{line.otcCounterpartyCode ?? "—"}</TableCell>
                          <TableCell>{line.side ?? "—"}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {line.quantityUsdt != null
                              ? formatUsdt(line.quantityUsdt)
                              : "—"}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {line.netRate ?? "—"}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {line.totalCop != null
                              ? formatCop(line.totalCop)
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{line.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
