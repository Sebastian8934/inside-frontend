"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReportExportButtons } from "@/components/features/reports/components/report-export-buttons";
import { useDeliveryClientsReport } from "@/components/features/reports/hooks/use-delivery-clients-report";
import { buildDeliveryClientsReportData } from "@/components/features/reports/lib/build-delivery-clients-report";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useAuthQueryEnabled } from "@/hooks/use-auth-query-enabled";
import { fetchClients } from "@/lib/api/clients";
import { queryKeys } from "@/lib/query/query-keys";
import { formatCop } from "@/lib/utils/format";

export function DeliveryClientsReport() {
  const companyId = useActiveCompanyId();
  const authReady = useAuthQueryEnabled();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(String(currentYear));
  const [clientFilter, setClientFilter] = useState("all");

  const yearNumber = Number(year) || currentYear;

  const filters = useMemo(
    () => ({
      companyId: companyId ?? undefined,
      currentYear: yearNumber,
      clientId: clientFilter === "all" ? undefined : Number(clientFilter),
    }),
    [companyId, yearNumber, clientFilter],
  );

  const { data: summary = [], isLoading } = useDeliveryClientsReport(
    filters,
    Boolean(companyId),
  );

  const { data: clients = [] } = useQuery({
    queryKey: queryKeys.clients.all({ companyId }),
    queryFn: () => fetchClients(companyId),
    enabled: authReady && Boolean(companyId),
  });

  const reportData = useMemo(
    () =>
      summary.length > 0
        ? buildDeliveryClientsReportData(summary, yearNumber)
        : null,
    [summary, yearNumber],
  );

  const totals = useMemo(
    () =>
      summary.reduce(
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
      ),
    [summary],
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
        title="Resumen clientes delivery"
        description="Equivalente a la hoja Resumen Clientes del Excel Delivery Business. Exportable en PDF, Excel y Word."
        actions={
          <ReportExportButtons
            data={reportData}
            disabled={isLoading || summary.length === 0}
          />
        }
      />

      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Año vigente</Label>
            <Input
              type="number"
              min={2000}
              max={2100}
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className="tabular-nums"
            />
          </div>
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={String(client.id)}>
                    {client.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Saldo total" value={totals.saldoTotal} highlight />
        <KpiCard label="Por pagar (histórico)" value={totals.porPagarTotal} />
        <KpiCard label="Pagado (histórico)" value={totals.pagadoTotal} />
        <KpiCard label={`Saldo ${yearNumber}`} value={totals.saldoCurrentYear} />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingState label="Cargando informe..." />
          ) : summary.length === 0 ? (
            <EmptyState message="Sin datos de delivery para los filtros seleccionados." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Por pagar</TableHead>
                    <TableHead className="text-right">Pagado</TableHead>
                    <TableHead className="text-right">Saldo año ant.</TableHead>
                    <TableHead className="text-right">
                      Por pagar {yearNumber}
                    </TableHead>
                    <TableHead className="text-right">
                      Pagado {yearNumber}
                    </TableHead>
                    <TableHead className="text-right">
                      Saldo {yearNumber}
                    </TableHead>
                    <TableHead className="text-right font-semibold">
                      Saldo total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.map((row) => (
                    <TableRow key={row.clientId}>
                      <TableCell className="font-medium">
                        {row.clientCode}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCop(row.porPagarTotal)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCop(row.pagadoTotal)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCop(row.saldoPriorYear)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCop(row.porPagarCurrentYear)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCop(row.pagadoCurrentYear)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCop(row.saldoCurrentYear)}
                      </TableCell>
                      <TableCell
                        className={`text-right tabular-nums font-semibold ${
                          row.saldoTotal > 0
                            ? "text-red-700"
                            : row.saldoTotal < 0
                              ? "text-green-700"
                              : ""
                        }`}
                      >
                        {formatCop(row.saldoTotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-100 font-semibold">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(totals.porPagarTotal)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(totals.pagadoTotal)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(totals.saldoPriorYear)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(totals.porPagarCurrentYear)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(totals.pagadoCurrentYear)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(totals.saldoCurrentYear)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(totals.saldoTotal)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
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
  value: number;
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
          {formatCop(value)}
        </p>
      </CardContent>
    </Card>
  );
}
