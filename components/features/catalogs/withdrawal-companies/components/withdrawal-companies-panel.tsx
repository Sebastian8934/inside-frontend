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
import { WithdrawalCompanyFormSheet } from "@/components/features/catalogs/withdrawal-companies/components/withdrawal-company-form-sheet";
import { useWithdrawalCompaniesList } from "@/components/features/catalogs/withdrawal-companies/hooks/use-withdrawal-companies-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { canManageCatalogs } from "@/lib/auth/permissions";
import { useAuthStore } from "@/stores/auth-store";
import type { WithdrawalCompany } from "@/types/withdrawals";

export function WithdrawalCompaniesPanel() {
  const companyId = useActiveCompanyId();
  const userRoles = useAuthStore((state) => state.user?.roles ?? []);
  const canEdit = canManageCatalogs(userRoles);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<WithdrawalCompany | null>(null);

  const { data, isLoading, isError } = useWithdrawalCompaniesList(companyId);

  return (
    <div>
      <PageHeader
        title="Empresas de retiro"
        description="Catálogo usado en el módulo de retiros"
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
              Nueva empresa
            </Button>
          ) : null
        }
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? <LoadingState /> : null}
          {isError ? (
            <EmptyState message="No se pudieron cargar las empresas de retiro." />
          ) : null}
          {!isLoading && !isError && data?.length === 0 ? (
            <EmptyState message="No hay empresas de retiro registradas." />
          ) : null}
          {data && data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  {canEdit ? <TableHead className="w-[60px]" /> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
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

      <WithdrawalCompanyFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        companyId={companyId}
        company={editing}
      />
    </div>
  );
}
