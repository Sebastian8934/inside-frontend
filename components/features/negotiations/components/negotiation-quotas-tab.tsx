"use client";

import { useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import { NegotiationQuotaSheet } from "@/components/features/negotiations/components/negotiation-quota-sheet";
import { useNegotiationQuotaMutations } from "@/components/features/negotiations/hooks/use-negotiation-mutations";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { EmptyState } from "@/components/shared/data-states";
import { useConfirmAction } from "@/hooks/use-confirm-action";
import type {
  DailyNegotiationDetail,
  NegotiationDailyQuota,
} from "@/types/negotiations";
import { isNegotiationDayOpen } from "@/types/negotiations";
import { formatCop } from "@/lib/utils/format";

type Props = {
  day: DailyNegotiationDetail;
  companyId: number;
};

export function NegotiationQuotasTab({ day, companyId }: Props) {
  const isOpen = isNegotiationDayOpen(day.status);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<NegotiationDailyQuota | null>(null);
  const { deleteQuota } = useNegotiationQuotaMutations(companyId);
  const { requestConfirm, confirmDialogProps } = useConfirmAction();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={!isOpen}
          onClick={() => {
            setEditing(null);
            setSheetOpen(true);
          }}
        >
          <Plus className="mr-2 size-4" />
          Cupo
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {day.dailyQuotas.length === 0 ? (
            <EmptyState message="Sin cupos diarios registrados." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comercial</TableHead>
                  <TableHead>OTC</TableHead>
                  <TableHead className="text-right">Cupo</TableHead>
                  <TableHead className="text-right">Máx. diario</TableHead>
                  <TableHead className="text-right">Diferencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[90px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {day.dailyQuotas.map((quota) => (
                  <TableRow key={quota.id}>
                    <TableCell>
                      <span className="font-medium">{quota.commercialRepInitials}</span>
                      <span className="ml-1 text-xs text-gray-500">
                        {quota.commercialRepName}
                      </span>
                    </TableCell>
                    <TableCell>{quota.otcCounterpartyCode}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(quota.quotaAmount)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(quota.maxDailyAmount)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatCop(quota.differenceAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{quota.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={!isOpen}
                          onClick={() => {
                            setEditing(quota);
                            setSheetOpen(true);
                          }}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={!isOpen}
                          onClick={() =>
                            requestConfirm({
                              title: "¿Eliminar cupo diario?",
                              description:
                                "Se eliminará el cupo del día. Esta acción no se puede deshacer.",
                              confirmLabel: "Eliminar",
                              onConfirm: () => deleteQuota.mutate(quota.id),
                            })
                          }
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <NegotiationQuotaSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        dayId={day.id}
        companyId={companyId}
        quota={editing}
      />

      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}
