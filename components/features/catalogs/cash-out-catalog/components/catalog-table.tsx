"use client";

import type { ReactNode } from "react";
import { Edit } from "lucide-react";
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
import { EmptyState, LoadingState } from "@/components/shared/data-states";

type CatalogTableProps<T> = {
  isLoading: boolean;
  emptyMessage: string;
  rows: T[];
  columns: string[];
  renderRow: (row: T) => ReactNode;
  canEdit: boolean;
};

export function CatalogTable<T>({
  isLoading,
  emptyMessage,
  rows,
  columns,
  renderRow,
  canEdit,
}: CatalogTableProps<T>) {
  return (
    <Card>
      <CardContent className="p-0">
        {isLoading ? <LoadingState /> : null}
        {!isLoading && rows.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : null}
        {!isLoading && rows.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
                {canEdit ? <TableHead className="w-[60px]" /> : null}
              </TableRow>
            </TableHeader>
            <TableBody>{rows.map((row) => renderRow(row))}</TableBody>
          </Table>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <Badge variant={active ? "default" : "secondary"}>
      {active ? "Activo" : "Inactivo"}
    </Badge>
  );
}

export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick}>
      <Edit className="size-4" />
    </Button>
  );
}
