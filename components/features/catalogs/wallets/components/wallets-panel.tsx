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
import { WalletFormSheet } from "@/components/features/catalogs/wallets/components/wallet-form-sheet";
import { useWalletsList } from "@/components/features/catalogs/wallets/hooks/use-wallets-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { canManageCatalogs } from "@/lib/auth/permissions";
import { useUserPermissions, useUserRoles } from "@/hooks/use-user-roles";
import type { Wallet } from "@/types/catalogs";

export function WalletsPanel() {
  const companyId = useActiveCompanyId();
  const userRoles = useUserRoles();
  const userPermissions = useUserPermissions();
  const canEdit = canManageCatalogs(userRoles, userPermissions);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);

  const { data, isLoading, isError } = useWalletsList(companyId);

  return (
    <div>
      <PageHeader
        title="Cartera"
        description="Wallets y direcciones crypto"
        actions={
          canEdit && companyId ? (
            <Button
              size="sm"
              onClick={() => {
                setEditingWallet(null);
                setSheetOpen(true);
              }}
            >
              <Plus className="size-4" />
              Nueva wallet
            </Button>
          ) : null
        }
      />

      <Card>
        <CardContent className="p-0">
          {isLoading ? <LoadingState /> : null}
          {isError ? (
            <EmptyState message="No se pudieron cargar las carteras." />
          ) : null}
          {!isLoading && !isError && data?.length === 0 ? (
            <EmptyState message="No hay carteras registradas." />
          ) : null}
          {data && data.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Activo</TableHead>
                  <TableHead>Red</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  {canEdit ? <TableHead className="w-[60px]" /> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((wallet) => (
                  <TableRow key={wallet.id}>
                    <TableCell className="font-medium">{wallet.code}</TableCell>
                    <TableCell>{wallet.name}</TableCell>
                    <TableCell>{wallet.asset}</TableCell>
                    <TableCell>{wallet.network}</TableCell>
                    <TableCell>{wallet.walletType}</TableCell>
                    <TableCell>
                      <Badge variant={wallet.isActive ? "default" : "secondary"}>
                        {wallet.isActive ? "Activa" : "Inactiva"}
                      </Badge>
                    </TableCell>
                    {canEdit ? (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingWallet(wallet);
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

      <WalletFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        companyId={companyId}
        wallet={editingWallet}
      />
    </div>
  );
}
