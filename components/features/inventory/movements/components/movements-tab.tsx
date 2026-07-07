"use client";

import { useMemo, useState } from "react";
import { Edit, Plus } from "lucide-react";
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
import { MovementFormSheet } from "@/components/features/inventory/movements/components/movement-form-sheet";
import { useMovementCatalogQueries } from "@/components/features/inventory/movements/hooks/use-movement-catalog-queries";
import { useMovementsList } from "@/components/features/inventory/movements/hooks/use-movements-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { toDateOnlyString } from "@/lib/api/build-url";
import { startOfToday } from "@/hooks/use-operation-date";
import type { InventoryMovement } from "@/types/inventory";
import { MOVEMENT_TYPES } from "@/types/inventory";
import {
  formatCop,
  formatDateOnly,
  formatUsdt,
  truncateHash,
  usdtColorClass,
} from "@/lib/utils/format";

export function MovementsTab({
  dateFrom: dateFromProp,
  dateTo: dateToProp,
  onDateFromChange,
  onDateToChange,
  hideDateFilters = false,
}: {
  dateFrom?: string;
  dateTo?: string;
  onDateFromChange?: (value: string) => void;
  onDateToChange?: (value: string) => void;
  hideDateFilters?: boolean;
} = {}) {
  const companyId = useActiveCompanyId();
  const defaultDate = toDateOnlyString(startOfToday());

  const [internalDateFrom, setInternalDateFrom] = useState(defaultDate);
  const [internalDateTo, setInternalDateTo] = useState(defaultDate);
  const dateFrom = dateFromProp ?? internalDateFrom;
  const dateTo = dateToProp ?? internalDateTo;
  const setDateFrom = onDateFromChange ?? setInternalDateFrom;
  const setDateTo = onDateToChange ?? setInternalDateTo;
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [hashFilter, setHashFilter] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingMovement, setEditingMovement] =
    useState<InventoryMovement | null>(null);

  const filters = useMemo(
    () => ({
      companyId,
      dateFrom,
      dateTo,
      clientId: clientFilter === "all" ? undefined : Number(clientFilter),
      movementType: typeFilter === "all" ? undefined : typeFilter,
      txHash: hashFilter || undefined,
    }),
    [companyId, dateFrom, dateTo, clientFilter, typeFilter, hashFilter],
  );

  const { data: movements, isLoading } = useMovementsList(filters);
  const { clients } = useMovementCatalogQueries(companyId);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent
          className={`grid gap-4 p-4 ${hideDateFilters ? "md:grid-cols-3" : "md:grid-cols-5"}`}
        >
          {!hideDateFilters ? (
            <>
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
            </>
          ) : null}
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
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {MOVEMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Buscar hash</Label>
            <Input
              placeholder="0x..."
              value={hashFilter}
              onChange={(e) => setHashFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setEditingMovement(null);
            setSheetOpen(true);
          }}
        >
          <Plus className="size-4" />
          Movimiento USDT
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? <LoadingState /> : null}
          {!isLoading && movements?.length === 0 ? (
            <EmptyState message="No hay movimientos para los filtros seleccionados." />
          ) : null}
          {movements && movements.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>USDT</TableHead>
                    <TableHead>Tasa</TableHead>
                    <TableHead>Total COP</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Hash</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {formatDateOnly(movement.operationDate)}
                      </TableCell>
                      <TableCell
                        className={usdtColorClass(movement.usdtAmount)}
                      >
                        {formatUsdt(movement.usdtAmount)}
                      </TableCell>
                      <TableCell>
                        {movement.purchaseRate?.toLocaleString("es-CO") ?? "—"}
                      </TableCell>
                      <TableCell>
                        {movement.totalCop != null
                          ? formatCop(movement.totalCop)
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{movement.movementType}</Badge>
                      </TableCell>
                      <TableCell>{movement.clientCode}</TableCell>
                      <TableCell>
                        {movement.txHash
                          ? truncateHash(movement.txHash)
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingMovement(movement);
                            setSheetOpen(true);
                          }}
                        >
                          <Edit className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <MovementFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        movement={editingMovement}
        companyId={companyId}
        defaultDate={defaultDate}
      />
    </div>
  );
}
