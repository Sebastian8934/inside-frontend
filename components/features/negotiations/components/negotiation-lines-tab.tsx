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
import { NegotiationLineSheet } from "@/components/features/negotiations/components/negotiation-line-sheet";
import { useNegotiationLineMutations } from "@/components/features/negotiations/hooks/use-negotiation-mutations";
import { EmptyState } from "@/components/shared/data-states";
import type { DailyNegotiationDetail, NegotiationLine } from "@/types/negotiations";
import { isNegotiationDayOpen } from "@/types/negotiations";
import { formatCop, formatUsdt, usdtColorClass } from "@/lib/utils/format";

type Props = {
  day: DailyNegotiationDetail;
  companyId: number;
};

export function NegotiationLinesTab({ day, companyId }: Props) {
  const isOpen = isNegotiationDayOpen(day.status);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<NegotiationLine | null>(null);
  const { deleteLine } = useNegotiationLineMutations(companyId);

  const nextLineNumber =
    day.lines.reduce((max, line) => Math.max(max, line.lineNumber), 0) + 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={!isOpen}
          onClick={() => {
            setEditingLine(null);
            setSheetOpen(true);
          }}
        >
          <Plus className="mr-2 size-4" />
          Línea
        </Button>
      </div>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          {day.lines.length === 0 ? (
            <EmptyState message="Sin líneas de negociación." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Plataforma</TableHead>
                  <TableHead>OTC</TableHead>
                  <TableHead>Comercial</TableHead>
                  <TableHead className="text-right">USDT</TableHead>
                  <TableHead className="text-right">Total COP</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-[90px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {day.lines
                  .slice()
                  .sort((a, b) => a.lineNumber - b.lineNumber)
                  .map((line) => (
                    <TableRow key={line.id}>
                      <TableCell>{line.lineNumber}</TableCell>
                      <TableCell>{line.platformName ?? "—"}</TableCell>
                      <TableCell>{line.otcCounterpartyCode ?? "—"}</TableCell>
                      <TableCell>{line.commercialRepInitials ?? "—"}</TableCell>
                      <TableCell
                        className={`text-right tabular-nums ${usdtColorClass(line.quantityUsdt ?? 0)}`}
                      >
                        {line.quantityUsdt != null
                          ? formatUsdt(line.quantityUsdt)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {line.totalCop != null ? formatCop(line.totalCop) : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{line.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={!isOpen}
                            onClick={() => {
                              setEditingLine(line);
                              setSheetOpen(true);
                            }}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={!isOpen}
                            onClick={() => deleteLine.mutate(line.id)}
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

      <NegotiationLineSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        dayId={day.id}
        companyId={companyId}
        line={editingLine}
        nextLineNumber={nextLineNumber}
      />
    </div>
  );
}
