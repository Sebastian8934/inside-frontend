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
import { CommercialRepFormSheet } from "@/components/features/catalogs/commercial-reps/components/commercial-rep-form-sheet";
import { useCommercialRepsList } from "@/components/features/catalogs/commercial-reps/hooks/use-commercial-reps-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { canManageCatalogs } from "@/lib/auth/permissions";
import { useUserPermissions, useUserRoles } from "@/hooks/use-user-roles";
import type { CommercialRep } from "@/types/catalogs";

export function CommercialRepsPanel() {
  const companyId = useActiveCompanyId();
  const userRoles = useUserRoles();
  const userPermissions = useUserPermissions();
  const canEdit = canManageCatalogs(userRoles, userPermissions);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<CommercialRep | null>(null);

  const { data, isLoading, isError } = useCommercialRepsList(companyId);

  return (
    <div>
      <PageHeader
        title="Comerciales"
        description="Representantes comerciales"
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
              Nuevo comercial
            </Button>
          ) : null
        }
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? <LoadingState /> : null}
          {isError ? (
            <EmptyState message="No se pudieron cargar los comerciales." />
          ) : null}
          {!isLoading && !isError && data?.length === 0 ? (
            <EmptyState message="No hay comerciales registrados." />
          ) : null}
          {data && data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Iniciales</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  {canEdit ? <TableHead className="w-[60px]" /> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((rep) => (
                  <TableRow key={rep.id}>
                    <TableCell className="font-medium">{rep.initials}</TableCell>
                    <TableCell>{rep.fullName}</TableCell>
                    <TableCell>
                      <Badge variant={rep.isActive ? "default" : "secondary"}>
                        {rep.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    {canEdit ? (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(rep);
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

      <CommercialRepFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        companyId={companyId}
        rep={editing}
      />
    </div>
  );
}
