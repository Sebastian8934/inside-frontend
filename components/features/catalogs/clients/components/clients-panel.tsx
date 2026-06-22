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
import { ClientFormSheet } from "@/components/features/catalogs/clients/components/client-form-sheet";
import { useClientsList } from "@/components/features/catalogs/clients/hooks/use-clients-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { canManageCatalogs } from "@/lib/auth/permissions";
import { useAuthStore } from "@/stores/auth-store";
import type { Client } from "@/types/catalogs";

export function ClientsPanel() {
  const companyId = useActiveCompanyId();
  const userRoles = useAuthStore((state) => state.user?.roles ?? []);
  const canEdit = canManageCatalogs(userRoles);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const { data, isLoading, isError } = useClientsList(companyId);

  function openCreate() {
    setEditingClient(null);
    setSheetOpen(true);
  }

  function openEdit(client: Client) {
    setEditingClient(client);
    setSheetOpen(true);
  }

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Maestro de clientes OTC"
        actions={
          canEdit ? (
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" />
              Nuevo cliente
            </Button>
          ) : null
        }
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? <LoadingState /> : null}
          {isError ? (
            <EmptyState message="No se pudieron cargar los clientes." />
          ) : null}
          {!isLoading && !isError && data?.length === 0 ? (
            <EmptyState message="No hay clientes registrados." />
          ) : null}
          {data && data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  {canEdit ? <TableHead>Acciones</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.code}</TableCell>
                    <TableCell>{client.correctedName}</TableCell>
                    <TableCell>
                      <Badge variant={client.isActive ? "default" : "secondary"}>
                        {client.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    {canEdit ? (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(client)}
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

      <ClientFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        companyId={companyId}
        client={editingClient}
      />
    </div>
  );
}
