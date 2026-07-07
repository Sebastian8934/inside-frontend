"use client";

import { useState } from "react";
import { Edit, Plus, UserX } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserFormSheet } from "@/components/features/users";
import { useRolesList } from "@/components/features/users/hooks/use-roles-list";
import { useUserMutations } from "@/components/features/users/hooks/use-user-mutations";
import { useUsersList } from "@/components/features/users/hooks/use-users-list";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useAccessibleCompanies } from "@/hooks/use-accessible-companies";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useConfirmAction } from "@/hooks/use-confirm-action";
import {
  canManageUsers,
  getPrimaryRoleLabel,
  getRoleLabel,
} from "@/lib/auth/permissions";
import { useUserRoles } from "@/hooks/use-user-roles";
import { useAuthStore } from "@/stores/auth-store";
import { ROLE_IDS } from "@/config/roles";
import type { UserDetail } from "@/types/users";

export function AdminPageContent() {
  const userRoles = useUserRoles();

  if (!canManageUsers(userRoles)) {
    return (
      <div className="p-6">
        <EmptyState message="No tienes permisos para acceder a administración." />
      </div>
    );
  }

  return <UsersAdminPanel />;
}

function UsersAdminPanel() {
  const companyId = useActiveCompanyId();
  const currentUser = useAuthStore((state) => state.user);
  const { deactivateUser } = useUserMutations();
  const { requestConfirm, confirmDialogProps } = useConfirmAction();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDetail | null>(null);

  const { data: users, isLoading } = useUsersList();

  return (
    <div className="p-6">
      <PageHeader
        title="Administración"
        description="Usuarios, roles y acceso a empresas del sistema"
      />

      <Tabs defaultValue="usuarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="empresas">Empresas</TabsTrigger>
          <TabsTrigger value="perfil">Mi perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-4">
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setEditingUser(null);
                setSheetOpen(true);
              }}
            >
              <Plus className="size-4" />
              Nuevo usuario
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {isLoading ? <LoadingState /> : null}
              {!isLoading && users?.length === 0 ? (
                <EmptyState message="No hay usuarios registrados." />
              ) : null}
              {users && users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.fullName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {getRoleLabel(user.role)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <span>{user.companyName}</span>
                            {user.role === ROLE_IDS.SuperUser &&
                            user.companyAccessIds.length > 1 ? (
                              <Badge variant="outline" className="text-xs">
                                {user.companyAccessIds.length} empresas
                              </Badge>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.isActive ? "default" : "secondary"}
                          >
                            {user.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingUser(user);
                                setSheetOpen(true);
                              }}
                            >
                              <Edit className="size-4" />
                            </Button>
                            {user.isActive ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600"
                                onClick={() =>
                                  requestConfirm({
                                    title: "¿Desactivar usuario?",
                                    description: `${user.fullName} perderá acceso al sistema hasta que se reactive su cuenta.`,
                                    confirmLabel: "Desactivar",
                                    onConfirm: () =>
                                      deactivateUser.mutate(user.id),
                                  })
                                }
                              >
                                <UserX className="size-4" />
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <RolesPanel />
        </TabsContent>

        <TabsContent value="empresas">
          <CompaniesPanel />
        </TabsContent>

        <TabsContent value="perfil">
          <Card className="max-w-lg">
            <CardContent className="space-y-2 p-6 text-sm">
              <p>
                <span className="text-muted-foreground">Nombre: </span>
                {currentUser?.fullName}
              </p>
              <p>
                <span className="text-muted-foreground">Email: </span>
                {currentUser?.email}
              </p>
              <p>
                <span className="text-muted-foreground">Rol: </span>
                {getPrimaryRoleLabel(currentUser?.roles ?? [])}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <UserFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        user={editingUser}
        defaultCompanyId={companyId ?? 1}
      />

      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}

function RolesPanel() {
  const { data: roles = [], isLoading } = useRolesList();

  if (isLoading) {
    return <LoadingState />;
  }

  if (roles.length === 0) {
    return <EmptyState message="No hay roles disponibles." />;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rol</TableHead>
              <TableHead>Nombre visible</TableHead>
              <TableHead>Descripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-mono text-sm">{role.name}</TableCell>
                <TableCell>{role.displayName ?? getRoleLabel(role.name)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {getRoleDescription(role.name)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function CompaniesPanel() {
  const { data: companies = [], isLoading } = useAccessibleCompanies();

  if (isLoading) {
    return <LoadingState />;
  }

  if (companies.length === 0) {
    return <EmptyState message="No tienes empresas accesibles." />;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Identificación fiscal</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.taxId ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={company.isActive ? "default" : "secondary"}>
                    {company.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function getRoleDescription(roleName: string): string {
  switch (roleName) {
    case ROLE_IDS.SuperUser:
      return "Acceso global y multi-empresa. Puede gestionar usuarios y cambiar de empresa.";
    case ROLE_IDS.Admin:
      return "Administrador de una empresa. Gestiona usuarios y catálogos de su organización.";
    case ROLE_IDS.Employee:
      return "Operador interno. Acceso a módulos operativos según permisos.";
    case ROLE_IDS.Client:
      return "Usuario externo vinculado a un cliente. Acceso de solo lectura al portal.";
    default:
      return "Rol del sistema.";
  }
}
