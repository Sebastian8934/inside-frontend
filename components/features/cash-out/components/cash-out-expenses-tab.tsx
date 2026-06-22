"use client";

import { useMemo, useState } from "react";
import { Check, Edit, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { CashOutExpenseSheet } from "@/components/features/cash-out/components/cash-out-expense-sheet";
import { useCashOutCatalogQueries } from "@/components/features/cash-out/hooks/use-cash-out-catalog-queries";
import {
  useCashOutExpenseSummary,
  useCashOutExpensesList,
} from "@/components/features/cash-out/hooks/use-cash-out-expenses-list";
import { useCashOutMutations } from "@/components/features/cash-out/hooks/use-cash-out-mutations";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { useActiveCompanyId, useOperativeDate } from "@/hooks/use-active-company";
import type { CashOutExpenseListItem } from "@/types/cash-out";
import { getPeriodFromDate, MONTH_NAMES } from "@/types/cash-out";
import { formatCop, formatDateOnly } from "@/lib/utils/format";

export function CashOutExpensesTab() {
  const companyId = useActiveCompanyId();
  const operativeDate = useOperativeDate();
  const defaultPeriod = getPeriodFromDate(operativeDate);

  const [periodMonth, setPeriodMonth] = useState(
    String(defaultPeriod.periodMonth),
  );
  const [periodYear, setPeriodYear] = useState(
    String(defaultPeriod.periodYear),
  );
  const [groupFilter, setGroupFilter] = useState("all");
  const [reviewedFilter, setReviewedFilter] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingExpense, setEditingExpense] =
    useState<CashOutExpenseListItem | null>(null);

  const defaultDate = `${periodYear}-${periodMonth.padStart(2, "0")}-01`;

  const filters = useMemo(
    () => ({
      companyId,
      periodMonth: Number(periodMonth),
      periodYear: Number(periodYear),
      groupId: groupFilter === "all" ? undefined : Number(groupFilter),
      isReviewed:
        reviewedFilter === "all"
          ? undefined
          : reviewedFilter === "reviewed"
            ? true
            : false,
    }),
    [companyId, periodMonth, periodYear, groupFilter, reviewedFilter],
  );

  const { data: expenses = [], isLoading } = useCashOutExpensesList(filters);
  const { data: summary } = useCashOutExpenseSummary(
    companyId,
    Number(periodMonth),
    Number(periodYear),
  );
  const { groups } = useCashOutCatalogQueries(companyId);

  const { deleteExpense, reviewExpense } = useCashOutMutations(companyId);

  if (!companyId) {
    return <EmptyState message="Seleccione una empresa." />;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">TOTAL MES</p>
            <p className="text-2xl font-bold tabular-nums text-red-800">
              {formatCop(summary?.totalAmountCop ?? 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">SIN REVISAR</p>
            <p className="text-2xl font-bold">
              {summary?.unreviewedCount ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">CONCEPTO PRINCIPAL</p>
            <p className="text-lg font-semibold">
              {summary?.topConceptName ?? "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-4">
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
          <div className="space-y-2">
            <Label>Grupo</Label>
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={String(group.id)}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Revisión</Label>
            <Select value={reviewedFilter} onValueChange={setReviewedFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="reviewed">Revisados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setEditingExpense(null);
            setSheetOpen(true);
          }}
        >
          <Plus className="mr-2 size-4" />
          Egreso
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingState label="Cargando egresos..." />
          ) : expenses.length === 0 ? (
            <EmptyState message="Sin egresos para el período seleccionado." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Cuenta</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="w-[120px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {formatDateOnly(expense.expenseDate)}
                      </TableCell>
                      <TableCell>{expense.groupName}</TableCell>
                      <TableCell>{expense.conceptName}</TableCell>
                      <TableCell className="max-w-[180px] truncate">
                        {expense.description}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {expense.paymentAccountName}
                      </TableCell>
                      <TableCell className="text-right tabular-nums font-semibold text-red-700">
                        {formatCop(expense.amountCop)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={expense.isReviewed ? "secondary" : "outline"}
                        >
                          {expense.isReviewed ? "Revisado" : "Pendiente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          {!expense.isReviewed ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Marcar revisado"
                              onClick={() =>
                                reviewExpense.mutate(expense.id)
                              }
                            >
                              <Check className="size-4 text-green-600" />
                            </Button>
                          ) : null}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingExpense(expense);
                              setSheetOpen(true);
                            }}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteExpense.mutate(expense.id)}
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

      <CashOutExpenseSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        companyId={companyId}
        expense={editingExpense}
        defaultDate={defaultDate}
      />
    </div>
  );
}
