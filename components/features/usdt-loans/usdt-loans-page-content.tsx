"use client";

import { useState } from "react";
import { Edit, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UsdtLoanFormSheet } from "@/components/features/usdt-loans";
import { useUsdtLoansList } from "@/components/features/usdt-loans/hooks/use-usdt-loans-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useIsClientOnly } from "@/hooks/use-user-roles";
import { formatDate, formatUsdt, usdtColorClass } from "@/lib/utils/format";
import type { UsdtLoan } from "@/types/usdt-loans";

export function UsdtLoansPageContent() {
  const companyId = useActiveCompanyId();
  const isClientOnly = useIsClientOnly();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<UsdtLoan | null>(null);

  const { data = [], isLoading } = useUsdtLoansList(
    { companyId },
    Boolean(companyId) || isClientOnly,
  );

  const totalPending = data.reduce((sum, loan) => sum + loan.pendingUsdt, 0);

  if (!companyId && !isClientOnly) {
    return (
      <div className="p-6">
        <EmptyState message="Seleccione una empresa." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title={isClientOnly ? "Mis préstamos USDT" : "Préstamos USDT"}
        description={
          isClientOnly
            ? "Consulta de USDT prestado, devuelto y pendiente"
            : "Control de USDT prestado y devuelto por cliente"
        }
        actions={
          !isClientOnly ? (
            <Button
              size="sm"
              onClick={() => {
                setEditingLoan(null);
                setSheetOpen(true);
              }}
            >
              <Plus className="mr-2 size-4" />
              Préstamo
            </Button>
          ) : undefined
        }
      />

      <Card className="mb-4">
        <CardContent className="p-4">
          <p className="text-xs text-gray-600">TOTAL PENDIENTE</p>
          <p className={`text-2xl font-bold tabular-nums ${usdtColorClass(totalPending)}`}>
            {formatUsdt(totalPending)}
          </p>
        </CardContent>
      </Card>

      {isLoading ? (
        <LoadingState label="Cargando préstamos..." />
      ) : data.length === 0 ? (
        <EmptyState
          message={
            isClientOnly
              ? "Sin préstamos USDT registrados a tu nombre."
              : "Sin préstamos registrados. Agregue el primero con el botón Préstamo."
          }
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {!isClientOnly ? <TableHead>Cliente</TableHead> : null}
                  <TableHead className="text-right">Prestado</TableHead>
                  <TableHead className="text-right">Devuelto</TableHead>
                  <TableHead className="text-right">Pendiente</TableHead>
                  <TableHead className="text-right">Tasa prom.</TableHead>
                  <TableHead>Actualizado</TableHead>
                  {!isClientOnly ? <TableHead className="w-[60px]" /> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((loan) => (
                  <TableRow key={loan.id}>
                    {!isClientOnly ? (
                      <TableCell>
                        <div className="font-medium">{loan.clientCode}</div>
                        <div className="text-xs text-gray-500">{loan.clientName}</div>
                      </TableCell>
                    ) : null}
                    <TableCell className="text-right tabular-nums">
                      {loan.lentUsdt.toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8,
                      })}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {loan.returnedUsdt.toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8,
                      })}
                    </TableCell>
                    <TableCell
                      className={`text-right tabular-nums font-semibold ${usdtColorClass(loan.pendingUsdt)}`}
                    >
                      {loan.pendingUsdt.toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 8,
                      })}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {loan.averageRate?.toLocaleString("es-CO") ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(loan.updatedAt)}
                    </TableCell>
                    {!isClientOnly ? (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingLoan(loan);
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
          </CardContent>
        </Card>
      )}

      {!isClientOnly ? (
        <UsdtLoanFormSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          loan={editingLoan}
        />
      ) : null}
    </div>
  );
}
