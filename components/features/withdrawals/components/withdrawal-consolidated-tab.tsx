"use client";

import { useMemo, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { WithdrawalConsolidatedSheet } from "@/components/features/withdrawals/components/withdrawal-consolidated-sheet";
import { useWithdrawalConsolidatedList } from "@/components/features/withdrawals/hooks/use-withdrawal-consolidated-list";
import { useWithdrawalConsolidatedMutations } from "@/components/features/withdrawals/hooks/use-withdrawal-mutations";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { useActiveCompanyId, useOperativeDate } from "@/hooks/use-active-company";
import { formatCop, formatDateOnly } from "@/lib/utils/format";
import type { WithdrawalConsolidatedItem } from "@/types/withdrawals";

export function WithdrawalConsolidatedTab() {
  const companyId = useActiveCompanyId();
  const operativeDate = useOperativeDate();

  const [periodMonth, setPeriodMonth] = useState<string>(
    String(operativeDate.getMonth() + 1),
  );
  const [periodYear, setPeriodYear] = useState<string>(
    String(operativeDate.getFullYear()),
  );
  const [holdingFilter, setHoldingFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [soloConImporte, setSoloConImporte] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingItem, setEditingItem] =
    useState<WithdrawalConsolidatedItem | null>(null);

  const filters = useMemo(
    () => ({
      companyId,
      periodMonth: Number(periodMonth),
      periodYear: Number(periodYear),
    }),
    [companyId, periodMonth, periodYear],
  );

  const { data = [], isLoading } = useWithdrawalConsolidatedList(filters);
  const { deleteConsolidated } = useWithdrawalConsolidatedMutations(companyId);

  const holdings = useMemo(() => {
    const values = new Set<string>();
    for (const item of data) {
      if (item.holding) values.add(item.holding);
    }
    return Array.from(values).sort();
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      if (holdingFilter !== "all" && item.holding !== holdingFilter) return false;
      if (soloConImporte && item.amountCop <= 0) return false;
      if (
        search &&
        !item.withdrawalCompanyName.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [data, holdingFilter, soloConImporte, search]);

  const totalFiltrado = filtered.reduce((sum, item) => sum + item.amountCop, 0);

  if (!companyId) {
    return <EmptyState message="Seleccione una empresa." />;
  }

  if (isLoading) {
    return <LoadingState label="Cargando consolidado..." />;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="grid grid-cols-1 gap-4 p-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Mes</Label>
            <Select value={periodMonth} onValueChange={setPeriodMonth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, index) => (
                  <SelectItem key={index + 1} value={String(index + 1)}>
                    {index + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Año</Label>
            <Input
              type="number"
              value={periodYear}
              onChange={(event) => setPeriodYear(event.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Buscar empresa</Label>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nombre de empresa de retiro"
            />
          </div>
          <div className="space-y-2">
            <Label>Holding</Label>
            <Select value={holdingFilter} onValueChange={setHoldingFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {holdings.map((holding) => (
                  <SelectItem key={holding} value={holding}>
                    {holding}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 md:col-span-2">
            <Checkbox
              id="solo-importe"
              checked={soloConImporte}
              onCheckedChange={(checked) => setSoloConImporte(checked === true)}
            />
            <Label htmlFor="solo-importe" className="font-normal">
              Solo con importe &gt; 0
            </Label>
          </div>
          <div className="flex items-end justify-end md:col-span-1">
            <Button
              onClick={() => {
                setEditingItem(null);
                setSheetOpen(true);
              }}
            >
              <Plus className="mr-2 size-4" />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <EmptyState message="Sin registros consolidados." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Holding</TableHead>
                  <TableHead className="text-right">Importe COP</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDateOnly(item.operationDate)}</TableCell>
                    <TableCell className="font-medium">
                      {item.withdrawalCompanyName}
                    </TableCell>
                    <TableCell>
                      {item.holding ? (
                        <Badge variant="outline">{item.holding}</Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold text-red-600">
                      {formatCop(item.amountCop)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingItem(item);
                            setSheetOpen(true);
                          }}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteConsolidated.mutate(item.id)}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100 font-semibold">
                  <TableCell colSpan={3}>Total filtrado</TableCell>
                  <TableCell className="text-right tabular-nums text-red-700">
                    {formatCop(totalFiltrado)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <WithdrawalConsolidatedSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        companyId={companyId}
        item={editingItem}
        defaultPeriodMonth={Number(periodMonth)}
        defaultPeriodYear={Number(periodYear)}
      />
    </div>
  );
}
