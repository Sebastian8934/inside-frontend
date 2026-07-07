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
import { CashOutPayrollSheet } from "@/components/features/cash-out/components/cash-out-payroll-sheet";
import { useCashOutMutations } from "@/components/features/cash-out/hooks/use-cash-out-mutations";
import { useCashOutPayrollList } from "@/components/features/cash-out/hooks/use-cash-out-payroll-list";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useConfirmAction } from "@/hooks/use-confirm-action";
import type { PayrollEntry } from "@/types/cash-out";
import { getPeriodFromDate, MONTH_NAMES } from "@/types/cash-out";
import { formatCop } from "@/lib/utils/format";

export function CashOutPayrollTab() {
  const companyId = useActiveCompanyId();
  const defaultPeriod = getPeriodFromDate(new Date());

  const [periodMonth, setPeriodMonth] = useState(
    String(defaultPeriod.periodMonth),
  );
  const [periodYear, setPeriodYear] = useState(
    String(defaultPeriod.periodYear),
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PayrollEntry | null>(null);

  const filters = useMemo(
    () => ({
      companyId,
      periodMonth: Number(periodMonth),
      periodYear: Number(periodYear),
    }),
    [companyId, periodMonth, periodYear],
  );

  const { data: entries = [], isLoading } = useCashOutPayrollList(filters);
  const { deletePayroll } = useCashOutMutations(companyId);
  const { requestConfirm, confirmDialogProps } = useConfirmAction();

  const totalPayroll = entries.reduce((sum, entry) => sum + entry.totalCop, 0);

  if (!companyId) {
    return <EmptyState message="Seleccione una empresa." />;
  }

  return (
    <div className="space-y-4">
      <Card className="border-red-200 bg-red-50/50">
        <CardContent className="p-4">
          <p className="text-xs text-gray-600">TOTAL NÓMINA DEL PERÍODO</p>
          <p className="text-2xl font-bold tabular-nums text-red-800">
            {formatCop(totalPayroll)}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {entries.length} empleado{entries.length === 1 ? "" : "s"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Mes</Label>
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
            <Label>Año</Label>
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
            setEditingEntry(null);
            setSheetOpen(true);
          }}
        >
          <Plus className="mr-2 size-4" />
          Empleado
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingState label="Cargando nómina..." />
          ) : entries.length === 0 ? (
            <EmptyState message="Sin registros de nómina para el período." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empleado</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead className="text-right">Salario base</TableHead>
                  <TableHead className="text-right">Bonificación</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[90px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.employeeName}
                    </TableCell>
                    <TableCell>{entry.jobTitle}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(entry.baseSalaryCop)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(entry.bonusCop)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold text-red-700">
                      {formatCop(entry.totalCop)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingEntry(entry);
                            setSheetOpen(true);
                          }}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            requestConfirm({
                              title: "¿Eliminar registro de nómina?",
                              description:
                                "Se eliminará el registro del período. Esta acción no se puede deshacer.",
                              confirmLabel: "Eliminar",
                              onConfirm: () => deletePayroll.mutate(entry.id),
                            })
                          }
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100 font-semibold">
                  <TableCell colSpan={4}>Total nómina</TableCell>
                  <TableCell className="text-right tabular-nums text-red-800">
                    {formatCop(totalPayroll)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CashOutPayrollSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        companyId={companyId}
        entry={editingEntry}
        defaultPeriod={{
          periodMonth: Number(periodMonth),
          periodYear: Number(periodYear),
        }}
      />

      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}
