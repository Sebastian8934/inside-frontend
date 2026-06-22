"use client";

import { useState } from "react";
import { Edit, Plus } from "lucide-react";
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
import { OtcCounterpartyFormSheet } from "@/components/features/catalogs/otc-counterparties/components/otc-counterparty-form-sheet";
import { useOtcCounterpartiesList } from "@/components/features/catalogs/otc-counterparties/hooks/use-otc-counterparties-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { canManageCatalogs } from "@/lib/auth/permissions";
import { useAuthStore } from "@/stores/auth-store";
import type { OtcCounterparty } from "@/types/catalogs";

export function OtcCounterpartiesPanel() {
  const companyId = useActiveCompanyId();
  const userRoles = useAuthStore((state) => state.user?.roles ?? []);
  const canEdit = canManageCatalogs(userRoles);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<OtcCounterparty | null>(null);

  const { data, isLoading, isError } = useOtcCounterpartiesList(companyId);

  return (
    <div>
      <PageHeader
        title="Contrapartes OTC"
        description="Contrapartes para operaciones OTC"
        actions={
          canEdit && companyId ? (
            <Button
              size="sm"
              onClick={() => {
                setEditing(null);
                setSheetOpen(true);
              }}
            >
              <Plus className="size-4" />
              Nueva contraparte
            </Button>
          ) : null
        }
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? <LoadingState /> : null}
          {isError ? (
            <EmptyState message="No se pudieron cargar las contrapartes." />
          ) : null}
          {!isLoading && !isError && data?.length === 0 ? (
            <EmptyState message="No hay contrapartes registradas." />
          ) : null}
          {data && data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  {canEdit ? <TableHead className="w-[60px]" /> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.code}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? "default" : "secondary"}>
                        {item.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    {canEdit ? (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(item);
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
          ) : null}
        </CardContent>
      </Card>

      <OtcCounterpartyFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        companyId={companyId}
        counterparty={editing}
      />
    </div>
  );
}
