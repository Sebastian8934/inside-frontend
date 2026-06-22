"use client";

import { useMemo, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CashOutTransactionCostSheet } from "@/components/features/cash-out/components/cash-out-transaction-cost-sheet";
import { useCashOutMutations } from "@/components/features/cash-out/hooks/use-cash-out-mutations";
import { useCashOutTransactionCostsList } from "@/components/features/cash-out/hooks/use-cash-out-transaction-costs-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { useActiveCompanyId, useOperativeDate } from "@/hooks/use-active-company";
import { toDateOnlyString } from "@/lib/api/build-url";
import type { CashOutTransactionCost } from "@/types/cash-out";
import { formatCop, formatDateOnly } from "@/lib/utils/format";

export function CashOutTransactionCostsTab() {
  const companyId = useActiveCompanyId();
  const operativeDate = useOperativeDate();
  const defaultDate = toDateOnlyString(operativeDate);

  const [dateFrom, setDateFrom] = useState(defaultDate);
  const [dateTo, setDateTo] = useState(defaultDate);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingCost, setEditingCost] =
    useState<CashOutTransactionCost | null>(null);

  const filters = useMemo(
    () => ({ companyId, dateFrom, dateTo }),
    [companyId, dateFrom, dateTo],
  );

  const { data: costs = [], isLoading } = useCashOutTransactionCostsList(filters);
  const { deleteTransactionCost } = useCashOutMutations(companyId);

  const totalAmount = costs.reduce(
    (sum, cost) => sum + (cost.amountCop ?? 0),
    0,
  );

  if (!companyId) {
    return <EmptyState message="Seleccione una empresa." />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-gray-600">TOTAL MONTO (FILTRO)</p>
          <p className="text-2xl font-bold tabular-nums">
            {formatCop(totalAmount)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-2">
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
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setEditingCost(null);
            setSheetOpen(true);
          }}
        >
          <Plus className="mr-2 size-4" />
          Costo
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingState label="Cargando costos..." />
          ) : costs.length === 0 ? (
            <EmptyState message="Sin costos por transacción en el rango." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead className="text-right">%</TableHead>
                    <TableHead>Comentario</TableHead>
                    <TableHead className="w-[90px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {costs.map((cost) => (
                    <TableRow key={cost.id}>
                      <TableCell>{formatDateOnly(cost.costDate)}</TableCell>
                      <TableCell>{cost.operationalGroup ?? "—"}</TableCell>
                      <TableCell className="max-w-[160px] truncate">
                        {cost.description ?? "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {cost.amountCop != null
                          ? formatCop(cost.amountCop)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {cost.costPercentage != null
                          ? `${cost.costPercentage}%`
                          : "—"}
                      </TableCell>
                      <TableCell className="max-w-[140px] truncate text-sm text-gray-600">
                        {cost.comment ?? "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingCost(cost);
                              setSheetOpen(true);
                            }}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTransactionCost.mutate(cost.id)}
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

      <CashOutTransactionCostSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        companyId={companyId}
        cost={editingCost}
        defaultDate={defaultDate}
      />
    </div>
  );
}
