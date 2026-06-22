"use client";

import { useMemo, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WithdrawalCompanyLineSheet } from "@/components/features/withdrawals/components/withdrawal-company-line-sheet";
import { WithdrawalTransferSheet } from "@/components/features/withdrawals/components/withdrawal-transfer-sheet";
import { useWithdrawalCatalogQueries } from "@/components/features/withdrawals/hooks/use-withdrawal-catalog-queries";
import { useWithdrawalDayDetail } from "@/components/features/withdrawals/hooks/use-withdrawal-day-detail";
import { useWithdrawalDays } from "@/components/features/withdrawals/hooks/use-withdrawal-days";
import {
  useWithdrawalDayMutations,
  useWithdrawalTransferMutations,
} from "@/components/features/withdrawals/hooks/use-withdrawal-mutations";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { useActiveCompanyId, useOperativeDate } from "@/hooks/use-active-company";
import { toDateOnlyString } from "@/lib/api/build-url";
import { formatCop, formatDateOnly } from "@/lib/utils/format";
import type {
  WithdrawalCompany,
  WithdrawalCompanyLine,
  WithdrawalTransfer,
} from "@/types/withdrawals";
import { emptyWithdrawalSlots } from "@/types/withdrawals";

type DisplayLine = {
  company: WithdrawalCompany;
  line: WithdrawalCompanyLine;
};

export function WithdrawalDayTab() {
  const companyId = useActiveCompanyId();
  const operativeDate = useOperativeDate();
  const operationDate = toDateOnlyString(operativeDate);

  const [soloConMovimiento, setSoloConMovimiento] = useState(false);
  const [lineSheetOpen, setLineSheetOpen] = useState(false);
  const [transferSheetOpen, setTransferSheetOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<DisplayLine | null>(null);
  const [editingTransfer, setEditingTransfer] =
    useState<WithdrawalTransfer | null>(null);

  const dayFilters = useMemo(
    () => ({ companyId, dateFrom: operationDate, dateTo: operationDate }),
    [companyId, operationDate],
  );

  const { data: dayList, isLoading: daysLoading } = useWithdrawalDays(dayFilters);
  const dayId = dayList?.[0]?.id;

  const { data: dayDetail, isLoading: detailLoading } = useWithdrawalDayDetail(
    dayId,
    companyId,
  );

  const { companies } = useWithdrawalCatalogQueries(companyId);
  const { createDay } = useWithdrawalDayMutations(companyId);
  const { deleteTransfer } = useWithdrawalTransferMutations(companyId);

  const displayLines = useMemo(() => {
    return companies.map((company) => {
      const existing = dayDetail?.companyLines.find(
        (line) => line.withdrawalCompanyId === company.id,
      );

      const line: WithdrawalCompanyLine = existing ?? {
        withdrawalCompanyId: company.id,
        withdrawalCompanyName: company.name,
        clientId: null,
        clientCode: null,
        slots: emptyWithdrawalSlots(),
        totalCop: 0,
      };

      return { company, line };
    });
  }, [companies, dayDetail]);

  const visibleLines = soloConMovimiento
    ? displayLines.filter((item) => item.line.totalCop > 0)
    : displayLines;

  const isLoading = daysLoading || (dayId ? detailLoading : false);

  if (!companyId) {
    return <EmptyState message="Seleccione una empresa." />;
  }

  if (isLoading) {
    return <LoadingState label="Cargando retiros del día..." />;
  }

  if (!dayId) {
    return (
      <div className="space-y-4 py-12 text-center">
        <EmptyState
          message={`No hay día de retiros para ${formatDateOnly(operationDate)}.`}
        />
        <Button
          onClick={() => createDay.mutate(operationDate)}
          disabled={createDay.isPending}
        >
          <Plus className="mr-2 size-4" />
          Crear día de retiros
        </Button>
      </div>
    );
  }

  if (!dayDetail) {
    return <LoadingState label="Cargando detalle..." />;
  }

  const companiesWithMovement = displayLines.filter(
    (item) => item.line.totalCop > 0,
  ).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">TOTAL RETIROS (día)</p>
            <p className="text-2xl font-bold tabular-nums text-blue-900">
              {formatCop(dayDetail.totalWithdrawalsCop)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">TOTAL TRANSFERENCIAS</p>
            <p className="text-2xl font-bold tabular-nums">
              {formatCop(dayDetail.totalTransfersCop)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">Empresas con retiro &gt; 0</p>
            <p className="text-2xl font-bold">{companiesWithMovement}</p>
            <p className="mt-1 text-[10px] text-gray-500">
              de {displayLines.length} filas
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-600">Fecha operativa</p>
            <p className="text-lg font-semibold">
              {formatDateOnly(dayDetail.operationDate)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="solo-movimiento"
          checked={soloConMovimiento}
          onCheckedChange={(checked) => setSoloConMovimiento(checked === true)}
        />
        <Label htmlFor="solo-movimiento" className="text-sm font-normal">
          Solo empresas con movimiento
        </Label>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Reporte de retiros diarios</CardTitle>
          <p className="text-sm text-gray-500">
            Empresa · Cliente (holding) · Retiro 1–10 · Total
          </p>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 min-w-[180px] bg-white">
                  Empresa
                </TableHead>
                <TableHead className="min-w-[140px]">Cliente</TableHead>
                {Array.from({ length: 10 }, (_, index) => (
                  <TableHead
                    key={index}
                    className="min-w-[100px] text-right"
                  >
                    Retiro {index + 1}
                  </TableHead>
                ))}
                <TableHead className="sticky right-12 min-w-[120px] bg-white text-right font-semibold">
                  Total
                </TableHead>
                <TableHead className="sticky right-0 bg-white" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleLines.map((item) => (
                <TableRow key={item.company.id} className="hover:bg-gray-50">
                  <TableCell className="sticky left-0 bg-white font-medium">
                    {item.company.name}
                  </TableCell>
                  <TableCell>
                    {item.line.clientCode ? (
                      <Badge variant="outline" className="text-xs font-normal">
                        {item.line.clientCode}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </TableCell>
                  {item.line.slots.map((slot) => (
                    <TableCell
                      key={slot.slotIndex}
                      className="text-right tabular-nums text-sm"
                    >
                      {slot.amountCop > 0 ? (
                        <span
                          className={
                            slot.isActive ? "font-medium text-red-600" : ""
                          }
                        >
                          {formatCop(slot.amountCop)}
                        </span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="sticky right-12 bg-white text-right tabular-nums font-bold">
                    {item.line.totalCop > 0 ? (
                      <span className="text-red-600">
                        {formatCop(item.line.totalCop)}
                      </span>
                    ) : (
                      <span className="text-gray-400">$0</span>
                    )}
                  </TableCell>
                  <TableCell className="sticky right-0 bg-white">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingLine(item);
                        setLineSheetOpen(true);
                      }}
                    >
                      <Edit className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base">
              Transferencias / consignaciones / pagos
            </CardTitle>
            <p className="text-sm text-gray-500">
              Movimientos bancarios asociados al día
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setEditingTransfer(null);
              setTransferSheetOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Agregar
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {dayDetail.transfers.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500">
              Sin transferencias registradas.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Monto COP</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {dayDetail.transfers.map((transfer) => (
                  <TableRow key={transfer.id}>
                    <TableCell className="font-medium">
                      {transfer.withdrawalCompanyName}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{transfer.transferType}</Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-semibold text-red-600">
                      {formatCop(transfer.amountCop)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingTransfer(transfer);
                            setTransferSheetOpen(true);
                          }}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTransfer.mutate(transfer.id)}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-100 font-semibold">
                  <TableCell colSpan={2}>Total transferencias</TableCell>
                  <TableCell className="text-right tabular-nums text-red-700">
                    {formatCop(dayDetail.totalTransfersCop)}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <WithdrawalCompanyLineSheet
        open={lineSheetOpen}
        onOpenChange={setLineSheetOpen}
        dayId={dayId}
        companyId={companyId}
        line={editingLine}
      />
      <WithdrawalTransferSheet
        open={transferSheetOpen}
        onOpenChange={setTransferSheetOpen}
        dayId={dayId}
        companyId={companyId}
        transfer={editingTransfer}
      />
    </div>
  );
}
