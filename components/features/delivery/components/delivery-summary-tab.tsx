"use client";

import { useMemo, useState } from "react";
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
import { useDeliveryCatalogQueries } from "@/components/features/delivery/hooks/use-delivery-catalog-queries";
import { useDeliveryClientSummary } from "@/components/features/delivery/hooks/use-delivery-client-summary";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useIsClientOnly } from "@/hooks/use-user-roles";
import { formatCop } from "@/lib/utils/format";

export function DeliverySummaryTab({
  clientPortal = false,
}: {
  clientPortal?: boolean;
}) {
  const companyId = useActiveCompanyId();
  const isClientOnly = useIsClientOnly();
  const readOnlyClient = clientPortal || isClientOnly;
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(String(currentYear));
  const [clientFilter, setClientFilter] = useState("all");

  const filters = useMemo(
    () => ({
      companyId,
      currentYear: Number(year),
      clientId: clientFilter === "all" ? undefined : Number(clientFilter),
    }),
    [companyId, year, clientFilter],
  );

  const { data: summary = [], isLoading } = useDeliveryClientSummary(
    filters,
    Boolean(companyId) || readOnlyClient,
  );
  const { clients } = useDeliveryCatalogQueries(
    companyId,
    Boolean(companyId) && !readOnlyClient,
  );

  const totals = summary.reduce(
    (acc, row) => ({
      porPagarTotal: acc.porPagarTotal + row.porPagarTotal,
      pagadoTotal: acc.pagadoTotal + row.pagadoTotal,
      saldoPriorYear: acc.saldoPriorYear + row.saldoPriorYear,
      porPagarCurrentYear: acc.porPagarCurrentYear + row.porPagarCurrentYear,
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
  );

  if (!companyId && !readOnlyClient) {
    return <EmptyState message="Seleccione una empresa." />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className={`grid gap-4 p-4 ${readOnlyClient ? "md:grid-cols-1" : "md:grid-cols-2"}`}>
          <div className="space-y-2">
            <Label>Año vigente</Label>
            <Input
              type="number"
              min={2000}
              max={2100}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="tabular-nums"
            />
          </div>
          {!readOnlyClient ? (
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Saldo total" value={totals.saldoTotal} highlight />
        <SummaryCard label="Por pagar (histórico)" value={totals.porPagarTotal} />
        <SummaryCard label="Pagado (histórico)" value={totals.pagadoTotal} />
        <SummaryCard label={`Saldo ${year}`} value={totals.saldoCurrentYear} />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingState label="Cargando resumen por cliente..." />
          ) : summary.length === 0 ? (
            <EmptyState message="Sin datos de delivery para los filtros seleccionados." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky left-0 bg-white">
                      {readOnlyClient ? "Código" : "Cliente"}
                    </TableHead>
                    <TableHead className="text-right">Por pagar</TableHead>
                    <TableHead className="text-right">Pagado</TableHead>
                    <TableHead className="text-right">
                      Saldo año ant.
                    </TableHead>
                    <TableHead className="text-right">
                      Por pagar {year}
                    </TableHead>
                    <TableHead className="text-right">Pagado {year}</TableHead>
                    <TableHead className="text-right">Saldo {year}</TableHead>
                    <TableHead className="text-right font-semibold">
                      Saldo total
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.map((row) => (
                    <TableRow key={row.clientId}>
                      <TableCell className="sticky left-0 bg-white font-medium">
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
                  {!readOnlyClient ? (
                    <TableRow className="bg-gray-100 font-semibold">
                      <TableCell className="sticky left-0 bg-gray-100">
                        Total
                      </TableCell>
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
                  ) : null}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({
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
