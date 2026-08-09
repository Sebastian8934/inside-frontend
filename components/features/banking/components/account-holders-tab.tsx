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
import { AccountHolderFormSheet } from "@/components/features/banking/components/account-holder-form-sheet";
import { useAccountHoldersList } from "@/components/features/banking/hooks/use-account-holders-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { hasAnyPermission, PERMISSION_CODES } from "@/lib/auth/permissions";
import { useUserPermissions, useUserRoles } from "@/hooks/use-user-roles";
import type { AccountHolder } from "@/types/banking";

export function AccountHoldersTab() {
  const companyId = useActiveCompanyId();
  const userRoles = useUserRoles();
  const userPermissions = useUserPermissions();
  const canEdit = hasAnyPermission(
    userPermissions,
    [PERMISSION_CODES.BankingCreate, PERMISSION_CODES.BankingEdit],
    userRoles,
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<AccountHolder | null>(null);

  const { data: holders = [], isLoading } = useAccountHoldersList({
    companyId,
    activeOnly: false,
  });

  if (!companyId) {
    return <EmptyState message="Seleccione una empresa." />;
  }

  return (
    <div className="space-y-4">
      {canEdit ? (
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setSheetOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Titular
          </Button>
        </div>
      ) : null}

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <LoadingState label="Cargando titulares..." />
          ) : holders.length === 0 ? (
            <EmptyState message="Sin titulares de cuenta registrados." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  {canEdit ? <TableHead className="w-[60px]" /> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {holders.map((holder) => (
                  <TableRow key={holder.id}>
                    <TableCell className="font-medium">{holder.name}</TableCell>
                    <TableCell>
                      <Badge variant={holder.isActive ? "default" : "secondary"}>
                        {holder.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    {canEdit ? (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditing(holder);
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
          )}
        </CardContent>
      </Card>

      {canEdit ? (
        <AccountHolderFormSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          holder={editing}
        />
      ) : null}
    </div>
  );
}
