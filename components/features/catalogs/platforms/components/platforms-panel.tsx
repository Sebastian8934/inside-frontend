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
import { PlatformFormSheet } from "@/components/features/catalogs/platforms/components/platform-form-sheet";
import { usePlatformsList } from "@/components/features/catalogs/platforms/hooks/use-platforms-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { canManageCatalogs } from "@/lib/auth/permissions";
import { useAuthStore } from "@/stores/auth-store";
import type { Platform } from "@/types/catalogs";

export function PlatformsPanel() {
  const companyId = useActiveCompanyId();
  const userRoles = useAuthStore((state) => state.user?.roles ?? []);
  const canEdit = canManageCatalogs(userRoles);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Platform | null>(null);

  const { data, isLoading, isError } = usePlatformsList(companyId);

  return (
    <div>
      <PageHeader
        title="Plataformas"
        description="Plataformas de negociación e inventario"
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
              Nueva plataforma
            </Button>
          ) : null
        }
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? <LoadingState /> : null}
          {isError ? (
            <EmptyState message="No se pudieron cargar las plataformas." />
          ) : null}
          {!isLoading && !isError && data?.length === 0 ? (
            <EmptyState message="No hay plataformas registradas." />
          ) : null}
          {data && data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  {canEdit ? <TableHead className="w-[60px]" /> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((platform) => (
                  <TableRow key={platform.id}>
                    <TableCell className="font-medium">{platform.name}</TableCell>
                    <TableCell>{platform.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={platform.isActive ? "default" : "secondary"}
                      >
                        {platform.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    {canEdit ? (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(platform);
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

      <PlatformFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        companyId={companyId}
        platform={editing}
      />
    </div>
  );
}
