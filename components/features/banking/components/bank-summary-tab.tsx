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
import { useBankMovementSummary } from "@/components/features/banking/hooks/use-bank-movement-summary";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { getPeriodFromDate, MONTH_NAMES } from "@/types/banking";
import { formatCop } from "@/lib/utils/format";

export function BankSummaryTab() {
  const companyId = useActiveCompanyId();
  const defaultPeriod = getPeriodFromDate(new Date());

  const [periodMonth, setPeriodMonth] = useState(
    String(defaultPeriod.periodMonth),
  );
  const [periodYear, setPeriodYear] = useState(
    String(defaultPeriod.periodYear),
  );

  const filters = useMemo(
    () => ({
      companyId,
      periodMonth: Number(periodMonth),
      periodYear: Number(periodYear),
    }),
    [companyId, periodMonth, periodYear],
  );

  const { data: summary = [], isLoading } = useBankMovementSummary(filters);

  const totals = summary.reduce(
    (acc, row) => ({
      abonos: acc.abonos + row.abonos,
      egresos: acc.egresos + row.egresos,
      disponible: acc.disponible + row.disponible,
    }),
    { abonos: 0, egresos: 0, disponible: 0 },
  );

  if (!companyId) {
    return <EmptyState message="Seleccione una empresa." />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Período mes</Label>
            <Select value={periodMonth} onValueChange={setPeriodMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTH_NAMES.map((name, index) => (
                  <SelectItem key={name} value={String(index + 1)}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Período año</Label>
            <Input
              type="number"
              min={2000}
              value={periodYear}
              onChange={(e) => setPeriodYear(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Abonos" value={totals.abonos} positive />
        <SummaryCard label="Egresos" value={totals.egresos} />
        <SummaryCard label="Disponible" value={totals.disponible} highlight />
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingState label="Cargando resumen..." />
          ) : summary.length === 0 ? (
            <EmptyState message="Sin movimientos en el período seleccionado." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titular</TableHead>
                  <TableHead className="text-right">Abonos</TableHead>
                  <TableHead className="text-right">Egresos</TableHead>
                  <TableHead className="text-right font-semibold">
                    Disponible
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.map((row) => (
                  <TableRow key={`${row.accountHolderId}-${row.periodMonth}`}>
                    <TableCell className="font-medium">
                      {row.accountHolderName}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-green-700">
                      {formatCop(row.abonos)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-red-700">
                      {formatCop(row.egresos)}
                    </TableCell>
                    <TableCell
                      className={`text-right tabular-nums font-semibold ${
                        row.disponible >= 0 ? "text-blue-900" : "text-red-800"
                      }`}
                    >
                      {formatCop(row.disponible)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100 font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right tabular-nums text-green-800">
                    {formatCop(totals.abonos)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-red-800">
                    {formatCop(totals.egresos)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCop(totals.disponible)}
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

function SummaryCard({
  label,
  value,
  positive,
  highlight,
}: {
  label: string;
  value: number;
  positive?: boolean;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-blue-200 bg-blue-50/50" : undefined}>
      <CardContent className="p-4">
        <p className="text-xs text-gray-600">{label.toUpperCase()}</p>
        <p
          className={`text-xl font-bold tabular-nums ${
            highlight
              ? "text-blue-900"
              : positive
                ? "text-green-700"
                : "text-red-700"
          }`}
        >
          {formatCop(value)}
        </p>
      </CardContent>
    </Card>
  );
}
