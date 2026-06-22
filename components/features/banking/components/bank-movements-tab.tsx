"use client";

import { useMemo, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
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
import { BankMovementSheet } from "@/components/features/banking/components/bank-movement-sheet";
import { useAccountHoldersList } from "@/components/features/banking/hooks/use-account-holders-list";
import { useBankMovementMutations } from "@/components/features/banking/hooks/use-bank-movement-mutations";
import { useBankMovementsList } from "@/components/features/banking/hooks/use-bank-movements-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { useActiveCompanyId, useOperativeDate } from "@/hooks/use-active-company";
import { toDateOnlyString } from "@/lib/api/build-url";
import type { BankMovementListItem } from "@/types/banking";
import { getPeriodFromDate, MONTH_NAMES } from "@/types/banking";
import { formatCop, formatDateOnly } from "@/lib/utils/format";

export function BankMovementsTab() {
  const companyId = useActiveCompanyId();
  const operativeDate = useOperativeDate();
  const defaultDate = toDateOnlyString(operativeDate);
  const defaultPeriod = getPeriodFromDate(operativeDate);
  const { deleteMovement } = useBankMovementMutations(companyId);

  const [dateFrom, setDateFrom] = useState(defaultDate);
  const [dateTo, setDateTo] = useState(defaultDate);
  const [holderFilter, setHolderFilter] = useState("all");
  const [periodMonth, setPeriodMonth] = useState(
    String(defaultPeriod.periodMonth),
  );
  const [periodYear, setPeriodYear] = useState(
    String(defaultPeriod.periodYear),
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<BankMovementListItem | null>(null);

  const filters = useMemo(
    () => ({
      companyId,
      dateFrom,
      dateTo,
      accountHolderId:
        holderFilter === "all" ? undefined : Number(holderFilter),
      periodMonth: Number(periodMonth),
      periodYear: Number(periodYear),
    }),
    [companyId, dateFrom, dateTo, holderFilter, periodMonth, periodYear],
  );

  const { data: movements = [], isLoading } = useBankMovementsList(filters);
  const { data: accountHolders = [] } = useAccountHoldersList({
    companyId,
    activeOnly: true,
  });

  const netTotal = movements.reduce((sum, m) => sum + m.amountCop, 0);

  if (!companyId) {
    return <EmptyState message="Seleccione una empresa." />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">MOVIMIENTOS</p>
            <p className="text-2xl font-bold">{movements.length}</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">NETO FILTRADO</p>
            <p className="text-2xl font-bold tabular-nums text-blue-900">
              {formatCop(netTotal)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-5">
          <div className="space-y-2">
            <Label>Fecha desde</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Fecha hasta</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Titular</Label>
            <Select value={holderFilter} onValueChange={setHolderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {accountHolders.map((h) => (
                  <SelectItem key={h.id} value={String(h.id)}>
                    {h.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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

      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setSheetOpen(true);
          }}
        >
          <Plus className="mr-2 size-4" />
          Movimiento
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingState label="Cargando movimientos..." />
          ) : movements.length === 0 ? (
            <EmptyState message="Sin movimientos para los filtros seleccionados." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Titular</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead className="w-[90px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {formatDateOnly(movement.movementDate)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {movement.accountHolderName}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {movement.concept}
                      </TableCell>
                      <TableCell
                        className={`text-right tabular-nums font-semibold ${
                          movement.amountCop >= 0
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {formatCop(movement.amountCop)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {MONTH_NAMES[movement.periodMonth - 1]}{" "}
                        {movement.periodYear}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditing(movement);
                              setSheetOpen(true);
                            }}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteMovement.mutate(movement.id)}
                          >
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <BankMovementSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        movement={editing}
        defaultDate={defaultDate}
        defaultPeriod={{
          periodMonth: Number(periodMonth),
          periodYear: Number(periodYear),
        }}
      />
    </div>
  );
}
