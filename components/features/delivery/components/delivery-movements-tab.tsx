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
import { DeliveryMovementSheet } from "@/components/features/delivery/components/delivery-movement-sheet";
import { useDeliveryCatalogQueries } from "@/components/features/delivery/hooks/use-delivery-catalog-queries";
import { useDeliveryMovementsList } from "@/components/features/delivery/hooks/use-delivery-movements-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { useActiveCompanyId, useOperativeDate } from "@/hooks/use-active-company";
import { useIsClientOnly } from "@/hooks/use-user-roles";
import { toDateOnlyString } from "@/lib/api/build-url";
import type { DeliveryMovementListItem } from "@/types/delivery";
import { DELIVERY_MOVEMENT_TYPES } from "@/types/delivery";
import { formatCop, formatDateOnly } from "@/lib/utils/format";

export function DeliveryMovementsTab({
  readOnly = false,
}: {
  readOnly?: boolean;
}) {
  const companyId = useActiveCompanyId();
  const isClientOnly = useIsClientOnly();
  const readOnlyMode = readOnly || isClientOnly;
  const operativeDate = useOperativeDate();
  const defaultDate = toDateOnlyString(operativeDate);
  const yearStart = `${operativeDate.getFullYear()}-01-01`;

  const [dateFrom, setDateFrom] = useState(readOnly ? yearStart : defaultDate);
  const [dateTo, setDateTo] = useState(defaultDate);
  const [clientFilter, setClientFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [referenceFilter, setReferenceFilter] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingMovement, setEditingMovement] =
    useState<DeliveryMovementListItem | null>(null);

  const filters = useMemo(
    () => ({
      companyId,
      dateFrom,
      dateTo,
      clientId: clientFilter === "all" ? undefined : Number(clientFilter),
      movementType: typeFilter === "all" ? undefined : typeFilter,
      referenceKey: referenceFilter || undefined,
    }),
    [companyId, dateFrom, dateTo, clientFilter, typeFilter, referenceFilter],
  );

  const { data: movements = [], isLoading } = useDeliveryMovementsList(
    filters,
    Boolean(companyId) || readOnlyMode,
  );
  const { clients } = useDeliveryCatalogQueries(
    companyId,
    Boolean(companyId) && !readOnlyMode,
  );

  const totalCop = movements.reduce((sum, m) => sum + m.totalCop, 0);

  if (!companyId && !readOnlyMode) {
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
            <p className="text-xs text-gray-600">NETO FILTRADO (COP)</p>
            <p className="text-2xl font-bold tabular-nums text-blue-900">
              {formatCop(totalCop)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent
          className={`grid gap-4 p-4 ${
            readOnlyMode ? "md:grid-cols-4" : "md:grid-cols-5"
          }`}
        >
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
          {!readOnlyMode ? (
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
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {DELIVERY_MOVEMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Referencia</Label>
            <Input
              placeholder="Buscar..."
              value={referenceFilter}
              onChange={(e) => setReferenceFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {!readOnlyMode ? (
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              setEditingMovement(null);
              setSheetOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Movimiento
          </Button>
        </div>
      ) : null}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingState label="Cargando movimientos..." />
          ) : movements.length === 0 ? (
            <EmptyState message="No hay movimientos para los filtros seleccionados." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Total COP</TableHead>
                    <TableHead>Referencia</TableHead>
                    {!readOnlyMode ? (
                      <TableHead className="w-[60px]" />
                    ) : null}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        {formatDateOnly(movement.operationDate)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{movement.clientCode}</div>
                        <div className="text-xs text-gray-500">
                          {movement.clientName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{movement.movementType}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {movement.concept}
                      </TableCell>
                      <TableCell
                        className={`text-right tabular-nums font-medium ${
                          movement.totalCop < 0 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {formatCop(movement.totalCop)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {movement.referenceKey}
                      </TableCell>
                      {!readOnlyMode ? (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setEditingMovement(movement);
                              setSheetOpen(true);
                            }}
                          >
                            <Edit className="size-4" />
                          </Button>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {!readOnlyMode ? (
        <DeliveryMovementSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          movement={editingMovement}
          defaultDate={defaultDate}
        />
      ) : null}
    </div>
  );
}
