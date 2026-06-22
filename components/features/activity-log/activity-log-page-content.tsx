"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
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
import { ActivityLogFormSheet } from "@/components/features/activity-log";
import { useActivityLogsList } from "@/components/features/activity-log/hooks/use-activity-logs-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId, useOperativeDate } from "@/hooks/use-active-company";
import { toDateOnlyString } from "@/lib/api/build-url";
import { formatDate } from "@/lib/utils/format";

const LIMIT_OPTIONS = [50, 100, 200, 500] as const;

export function ActivityLogPageContent() {
  const companyId = useActiveCompanyId();
  const operativeDate = useOperativeDate();
  const defaultDate = toDateOnlyString(operativeDate);

  const [dateFrom, setDateFrom] = useState(defaultDate);
  const [dateTo, setDateTo] = useState(defaultDate);
  const [typeFilter, setTypeFilter] = useState("all");
  const [limit, setLimit] = useState(String(LIMIT_OPTIONS[1]));
  const [sheetOpen, setSheetOpen] = useState(false);

  const filters = useMemo(
    () => ({
      companyId,
      dateFrom,
      dateTo,
      activityType: typeFilter === "all" ? undefined : typeFilter,
      limit: Number(limit),
    }),
    [companyId, dateFrom, dateTo, typeFilter, limit],
  );

  const { data: logs = [], isLoading } = useActivityLogsList(filters);

  const activityTypes = useMemo(
    () =>
      [...new Set(logs.map((log) => log.activityType))].sort((a, b) =>
        a.localeCompare(b, "es"),
      ),
    [logs],
  );

  if (!companyId) {
    return (
      <div className="p-6">
        <PageHeader
          title="Auditoría"
          description="Registro de actividad operativa"
        />
        <EmptyState message="Seleccione una empresa." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Auditoría"
        description="Historial de actividad y notas operativas"
        actions={
          <Button size="sm" onClick={() => setSheetOpen(true)}>
            <Plus className="mr-2 size-4" />
            Registrar actividad
          </Button>
        }
      />

      <Card className="mb-4">
        <CardContent className="grid gap-4 p-4 md:grid-cols-5">
          <div className="space-y-2">
            <Label>Desde</Label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Hasta</Label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {activityTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Límite</Label>
            <Select value={limit} onValueChange={setLimit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LIMIT_OPTIONS.map((value) => (
                  <SelectItem key={value} value={String(value)}>
                    {value} registros
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-500">
              Mostrando {logs.length} registro{logs.length === 1 ? "" : "s"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingState label="Cargando actividad..." />
          ) : logs.length === 0 ? (
            <EmptyState message="Sin actividad para los filtros seleccionados." />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Referencia</TableHead>
                    <TableHead>Usuario</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        {formatDate(log.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.activityType}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[360px]">
                        {log.description}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {log.referenceEntity
                          ? `${log.referenceEntity}${log.referenceId != null ? ` #${log.referenceId}` : ""}`
                          : "—"}
                      </TableCell>
                      <TableCell className="max-w-[140px] truncate text-xs text-gray-500">
                        {log.createdByUserId ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ActivityLogFormSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
