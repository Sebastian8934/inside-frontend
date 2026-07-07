"use client";

import { useMemo, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LiquidityPositionLineSheet } from "@/components/features/liquidity/components/liquidity-position-line-sheet";
import { useLiquidityMutations } from "@/components/features/liquidity/hooks/use-liquidity-mutations";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { EmptyState } from "@/components/shared/data-states";
import { useConfirmAction } from "@/hooks/use-confirm-action";
import type {
  DailyLiquidityCloseDetail,
  LiquidityPositionLine,
} from "@/types/liquidity";
import {
  isLiquidityCloseDraft,
  LIQUIDITY_CATEGORY_LABELS,
  LIQUIDITY_POSITION_CATEGORIES,
} from "@/types/liquidity";
import { formatCop } from "@/lib/utils/format";

type Props = {
  close: DailyLiquidityCloseDetail;
  companyId: number;
};

export function LiquidityPositionLinesSection({ close, companyId }: Props) {
  const isDraft = isLiquidityCloseDraft(close.status);
  const { deletePositionLine } = useLiquidityMutations(companyId);
  const { requestConfirm, confirmDialogProps } = useConfirmAction();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<LiquidityPositionLine | null>(
    null,
  );
  const [defaultCategory, setDefaultCategory] = useState<string | undefined>();

  const nextSortOrder =
    close.positionLines.reduce((max, line) => Math.max(max, line.sortOrder), 0) +
    1;

  const linesByCategory = useMemo(() => {
    const grouped = new Map<string, LiquidityPositionLine[]>();

    for (const category of LIQUIDITY_POSITION_CATEGORIES) {
      grouped.set(category, []);
    }

    for (const line of close.positionLines) {
      const list = grouped.get(line.category) ?? [];
      list.push(line);
      grouped.set(line.category, list);
    }

    return LIQUIDITY_POSITION_CATEGORIES.map((category) => ({
      category,
      label: LIQUIDITY_CATEGORY_LABELS[category] ?? category,
      lines: (grouped.get(category) ?? []).slice().sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
        return a.id - b.id;
      }),
      subtotal: (grouped.get(category) ?? []).reduce(
        (sum, line) => sum + line.amountCop,
        0,
      ),
    }));
  }, [close.positionLines]);

  function openCreate(category?: string) {
    setEditingLine(null);
    setDefaultCategory(category);
    setSheetOpen(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Posición de liquidez</h3>
          <p className="text-sm text-gray-500">
            Líneas por categoría que componen el saldo INSIDE
          </p>
        </div>
        <Button size="sm" disabled={!isDraft} onClick={() => openCreate()}>
          <Plus className="mr-2 size-4" />
          Línea
        </Button>
      </div>

      {close.positionLines.length === 0 ? (
        <EmptyState message="Sin líneas de posición. Agregue cuentas, efectivo u otras partidas." />
      ) : (
        linesByCategory.map(({ category, label, lines, subtotal }) =>
          lines.length === 0 ? null : (
            <Card key={category}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{label}</CardTitle>
                  <Badge variant="outline">{lines.length}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold tabular-nums">
                    {formatCop(subtotal)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!isDraft}
                    onClick={() => openCreate(category)}
                  >
                    <Plus className="mr-1 size-4" />
                    Agregar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Concepto</TableHead>
                      <TableHead className="text-right">Monto COP</TableHead>
                      <TableHead className="w-[90px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell>{line.concept}</TableCell>
                        <TableCell className="text-right tabular-nums font-medium">
                          {formatCop(line.amountCop)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={!isDraft}
                              onClick={() => {
                                setEditingLine(line);
                                setDefaultCategory(undefined);
                                setSheetOpen(true);
                              }}
                            >
                              <Edit className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={!isDraft}
                              onClick={() =>
                                requestConfirm({
                                  title: "¿Eliminar línea de posición?",
                                  description:
                                    "Se eliminará la línea del cierre de liquidez. Esta acción no se puede deshacer.",
                                  confirmLabel: "Eliminar",
                                  onConfirm: () =>
                                    deletePositionLine.mutate(line.id),
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
              </CardContent>
            </Card>
          ),
        )
      )}

      <LiquidityPositionLineSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        closeId={close.id}
        line={editingLine}
        nextSortOrder={nextSortOrder}
        defaultCategory={defaultCategory}
      />

      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}
