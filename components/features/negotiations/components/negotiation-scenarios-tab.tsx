"use client";

import { useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
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
import { NegotiationScenarioSheet } from "@/components/features/negotiations/components/negotiation-scenario-sheet";
import { useNegotiationScenarioMutations } from "@/components/features/negotiations/hooks/use-negotiation-mutations";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { EmptyState } from "@/components/shared/data-states";
import { useConfirmAction } from "@/hooks/use-confirm-action";
import type {
  DailyNegotiationDetail,
  NegotiationRateScenario,
} from "@/types/negotiations";
import { isNegotiationDayOpen } from "@/types/negotiations";

type Props = {
  day: DailyNegotiationDetail;
  companyId: number;
};

export function NegotiationScenariosTab({ day, companyId }: Props) {
  const isOpen = isNegotiationDayOpen(day.status);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<NegotiationRateScenario | null>(null);
  const { deleteScenario } = useNegotiationScenarioMutations(companyId);
  const { requestConfirm, confirmDialogProps } = useConfirmAction();

  const nextSortOrder =
    day.rateScenarios.reduce((max, s) => Math.max(max, s.sortOrder), 0) + 1;

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
          Escenario
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {day.rateScenarios.length === 0 ? (
            <EmptyState message="Sin escenarios de tasa." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Orden</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Costo %</TableHead>
                  <TableHead className="text-right">Spread</TableHead>
                  <TableHead className="text-right">Cobre</TableHead>
                  <TableHead className="text-right">Cierre</TableHead>
                  <TableHead className="w-[90px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {day.rateScenarios
                  .slice()
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((scenario) => (
                    <TableRow key={scenario.id}>
                      <TableCell>{scenario.sortOrder}</TableCell>
                      <TableCell className="font-medium">{scenario.name}</TableCell>
                      <TableCell>{scenario.costPercent ?? "—"}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {scenario.spread ?? "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {scenario.cobreRate ?? "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {scenario.closingRate ?? "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={!isOpen}
                            onClick={() => {
                              setEditing(scenario);
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
                                title: "¿Eliminar escenario de tasa?",
                                description:
                                  "Se eliminará el escenario del día. Esta acción no se puede deshacer.",
                                confirmLabel: "Eliminar",
                                onConfirm: () =>
                                  deleteScenario.mutate(scenario.id),
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

      <NegotiationScenarioSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        dayId={day.id}
        companyId={companyId}
        scenario={editing}
        nextSortOrder={nextSortOrder}
      />

      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}
