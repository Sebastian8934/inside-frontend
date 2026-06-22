"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountFormSheet } from "@/components/features/catalogs/cash-out-catalog/components/account-form-sheet";
import {
  CatalogTable,
  EditButton,
  StatusBadge,
} from "@/components/features/catalogs/cash-out-catalog/components/catalog-table";
import { ConceptFormSheet } from "@/components/features/catalogs/cash-out-catalog/components/concept-form-sheet";
import { GroupFormSheet } from "@/components/features/catalogs/cash-out-catalog/components/group-form-sheet";
import {
  useCashOutConceptsList,
  useCashOutGroupsList,
  usePaymentAccountsList,
} from "@/components/features/catalogs/cash-out-catalog/hooks/use-cash-out-catalog-lists";
import { EmptyState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { canManageCatalogs } from "@/lib/auth/permissions";
import { useAuthStore } from "@/stores/auth-store";
import type {
  CashOutConcept,
  CashOutGroup,
  PaymentAccount,
} from "@/types/cash-out";

export function CashOutCatalogPanel() {
  const companyId = useActiveCompanyId();
  const userRoles = useAuthStore((state) => state.user?.roles ?? []);
  const canEdit = canManageCatalogs(userRoles);

  const { data: groups = [], isLoading: groupsLoading } =
    useCashOutGroupsList(companyId);
  const { data: concepts = [], isLoading: conceptsLoading } =
    useCashOutConceptsList(companyId);
  const { data: accounts = [], isLoading: accountsLoading } =
    usePaymentAccountsList(companyId);

  if (!companyId) {
    return <EmptyState message="Seleccione una empresa." />;
  }

  return (
    <div>
      <PageHeader
        title="Catálogo Cash out"
        description="Grupos, conceptos y cuentas de pago para egresos"
      />

      <Tabs defaultValue="grupos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grupos">Grupos ({groups.length})</TabsTrigger>
          <TabsTrigger value="conceptos">
            Conceptos ({concepts.length})
          </TabsTrigger>
          <TabsTrigger value="cuentas">
            Cuentas ({accounts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grupos">
          <GroupsTab
            groups={groups}
            isLoading={groupsLoading}
            canEdit={canEdit}
            companyId={companyId}
          />
        </TabsContent>

        <TabsContent value="conceptos">
          <ConceptsTab
            concepts={concepts}
            groups={groups}
            isLoading={conceptsLoading}
            canEdit={canEdit}
            companyId={companyId}
          />
        </TabsContent>

        <TabsContent value="cuentas">
          <AccountsTab
            accounts={accounts}
            isLoading={accountsLoading}
            canEdit={canEdit}
            companyId={companyId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GroupsTab({
  groups,
  isLoading,
  canEdit,
  companyId,
}: {
  groups: CashOutGroup[];
  isLoading: boolean;
  canEdit: boolean;
  companyId: number;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<CashOutGroup | null>(null);

  return (
    <>
      {canEdit ? (
        <div className="mb-4 flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setSheetOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Grupo
          </Button>
        </div>
      ) : null}

      <CatalogTable
        isLoading={isLoading}
        emptyMessage="Sin grupos registrados."
        rows={groups}
        columns={["Nombre", "Estado"]}
        renderRow={(group) => (
          <TableRow key={group.id}>
            <TableCell className="font-medium">{group.name}</TableCell>
            <TableCell>
              <StatusBadge active={group.isActive} />
            </TableCell>
            {canEdit ? (
              <TableCell>
                <EditButton
                  onClick={() => {
                    setEditing(group);
                    setSheetOpen(true);
                  }}
                />
              </TableCell>
            ) : null}
          </TableRow>
        )}
        canEdit={canEdit}
      />

      <GroupFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        companyId={companyId}
        group={editing}
      />
    </>
  );
}

function ConceptsTab({
  concepts,
  groups,
  isLoading,
  canEdit,
  companyId,
}: {
  concepts: CashOutConcept[];
  groups: CashOutGroup[];
  isLoading: boolean;
  canEdit: boolean;
  companyId: number;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<CashOutConcept | null>(null);

  return (
    <>
      {canEdit ? (
        <div className="mb-4 flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setSheetOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Concepto
          </Button>
        </div>
      ) : null}

      <CatalogTable
        isLoading={isLoading}
        emptyMessage="Sin conceptos registrados."
        rows={concepts}
        columns={["Grupo", "Concepto", "Estado"]}
        renderRow={(concept) => (
          <TableRow key={concept.id}>
            <TableCell>{concept.groupName}</TableCell>
            <TableCell className="font-medium">{concept.name}</TableCell>
            <TableCell>
              <StatusBadge active={concept.isActive} />
            </TableCell>
            {canEdit ? (
              <TableCell>
                <EditButton
                  onClick={() => {
                    setEditing(concept);
                    setSheetOpen(true);
                  }}
                />
              </TableCell>
            ) : null}
          </TableRow>
        )}
        canEdit={canEdit}
      />

      <ConceptFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        companyId={companyId}
        concept={editing}
        groups={groups}
      />
    </>
  );
}

function AccountsTab({
  accounts,
  isLoading,
  canEdit,
  companyId,
}: {
  accounts: PaymentAccount[];
  isLoading: boolean;
  canEdit: boolean;
  companyId: number;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentAccount | null>(null);

  return (
    <>
      {canEdit ? (
        <div className="mb-4 flex justify-end">
          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setSheetOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" />
            Cuenta
          </Button>
        </div>
      ) : null}

      <CatalogTable
        isLoading={isLoading}
        emptyMessage="Sin cuentas de pago registradas."
        rows={accounts}
        columns={["Nombre", "Estado"]}
        renderRow={(account) => (
          <TableRow key={account.id}>
            <TableCell className="font-medium">{account.name}</TableCell>
            <TableCell>
              <StatusBadge active={account.isActive} />
            </TableCell>
            {canEdit ? (
              <TableCell>
                <EditButton
                  onClick={() => {
                    setEditing(account);
                    setSheetOpen(true);
                  }}
                />
              </TableCell>
            ) : null}
          </TableRow>
        )}
        canEdit={canEdit}
      />

      <AccountFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        companyId={companyId}
        account={editing}
      />
    </>
  );
}
