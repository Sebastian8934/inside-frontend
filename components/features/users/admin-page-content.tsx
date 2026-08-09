"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Loader2, Plus, UserX } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import { PageHeader } from "@/components/shared/page-header";
import { useAccessibleCompanies } from "@/hooks/use-accessible-companies";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { useConfirmAction } from "@/hooks/use-confirm-action";
import { createCompany, deactivateCompany, updateCompany, activateCompany, deleteCompany } from "@/lib/api/companies";
import { createRole, deleteRole, updateRole } from "@/lib/api/roles";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";
import { queryKeys } from "@/lib/query/query-keys";
import {
  canManageUsers,
  getPrimaryRoleLabel,
  getRoleLabel,
} from "@/lib/auth/permissions";
import {
  useIsSuperUser,
  useUserPermissions,
  useUserRoles,
} from "@/hooks/use-user-roles";
import { useAuthStore } from "@/stores/auth-store";
import { INSIDE_ROLES, ROLE_IDS } from "@/config/roles";
import type { CompanyListItem } from "@/types/company";
import type { RoleItem, UserDetail } from "@/types/users";
import { ModulesPanel } from "@/components/features/users/components/modules-panel";
import { RolePermissionsPanel } from "@/components/features/users/components/role-permissions-panel";


export function AdminPageContent() {
  const userRoles = useUserRoles();
  const userPermissions = useUserPermissions();

  if (!canManageUsers(userRoles, userPermissions)) {
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
          <TabsTrigger value="permisos">Permisos por rol</TabsTrigger>
          <TabsTrigger value="modulos">Módulos</TabsTrigger>
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

        <TabsContent value="permisos">
          <RolePermissionsPanel />
        </TabsContent>

        <TabsContent value="modulos">
          <ModulesPanel />
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

function isSystemRole(roleName: string) {
  return (INSIDE_ROLES as readonly string[]).includes(roleName);
}

function RolesPanel() {
  const queryClient = useQueryClient();
  const canManage = useIsSuperUser();
  const { data: roles = [], isLoading } = useRolesList();
  const { requestConfirm, confirmDialogProps } = useConfirmAction();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoleItem | null>(null);
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");

  function resetForm() {
    setEditing(null);
    setName("");
    setDisplayName("");
  }

  function openCreate() {
    resetForm();
    setModalOpen(true);
  }

  function openEdit(role: RoleItem) {
    setEditing(role);
    setName(role.name);
    setDisplayName(role.displayName ?? role.name);
    setModalOpen(true);
  }

  async function invalidateRoles() {
    await queryClient.invalidateQueries({ queryKey: queryKeys.roles.all });
    await queryClient.invalidateQueries({ queryKey: ["permissions"] });
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        return updateRole(editing.id, { name: name.trim() });
      }
      return createRole({
        name: name.trim(),
        displayName: displayName.trim() || name.trim(),
      });
    },
    onSuccess: async () => {
      toast.success(editing ? "Rol actualizado." : "Rol creado.");
      setModalOpen(false);
      resetForm();
      await invalidateRoles();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (roleId: string) => deleteRole(roleId),
    onSuccess: async () => {
      toast.success("Rol eliminado.");
      await invalidateRoles();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  function handleDelete(role: RoleItem) {
    requestConfirm({
      title: "Eliminar rol",
      description: `¿Eliminar el rol "${role.displayName ?? role.name}"? Debe no tener usuarios asignados.`,
      confirmLabel: "Eliminar",
      destructive: true,
      onConfirm: () => deleteMutation.mutate(role.id),
    });
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      {canManage ? (
        <div className="flex justify-end">
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-4" />
            Nuevo rol
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Solo SuperUsuario puede crear, editar o eliminar roles. Los roles del
          sistema no se pueden modificar.
        </p>
      )}

      {roles.length === 0 ? (
        <EmptyState message="No hay roles disponibles." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rol</TableHead>
                  <TableHead>Nombre visible</TableHead>
                  <TableHead>Descripción</TableHead>
                  {canManage ? <TableHead>Acciones</TableHead> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => {
                  const systemRole = isSystemRole(role.name);
                  return (
                    <TableRow key={role.id}>
                      <TableCell className="font-mono text-sm">
                        {role.name}
                      </TableCell>
                      <TableCell>
                        {role.displayName ?? getRoleLabel(role.name)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {getRoleDescription(role.name)}
                      </TableCell>
                      {canManage ? (
                        <TableCell>
                          {systemRole ? (
                            <span className="text-xs text-muted-foreground">
                              Sistema
                            </span>
                          ) : (
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEdit(role)}
                              >
                                <Edit className="size-4" />
                                Editar
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-600"
                                onClick={() => handleDelete(role)}
                              >
                                <UserX className="size-4" />
                                Eliminar
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      ) : null}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <FormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) resetForm();
        }}
        size="xs"
        title={editing ? "Editar rol" : "Nuevo rol"}
        description={
          editing
            ? "Renombra el rol personalizado. Luego revisa Permisos por rol."
            : "Crea un rol. Después asígnale permisos en Permisos por rol."
        }
        footer={
          <FormModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={saveMutation.isPending || !name.trim()}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : editing ? (
                "Guardar"
              ) : (
                "Crear"
              )}
            </Button>
          </FormModalFooter>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre técnico</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Auditor"
            />
            <p className="text-xs text-muted-foreground">
              Letras, números y guion bajo. Debe empezar con letra.
            </p>
          </div>
          {!editing ? (
            <div className="space-y-2">
              <Label>Nombre visible (opcional)</Label>
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ej. Auditor interno"
              />
            </div>
          ) : null}
        </div>
      </FormModal>

      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}

function CompaniesPanel() {
  const queryClient = useQueryClient();
  const canManage = useIsSuperUser();
  const { data: companies = [], isLoading } = useAccessibleCompanies(canManage);
  const { requestConfirm, confirmDialogProps } = useConfirmAction();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CompanyListItem | null>(null);
  const [name, setName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [isActive, setIsActive] = useState(true);

  function resetForm() {
    setEditing(null);
    setName("");
    setTaxId("");
    setIsActive(true);
  }

  function openCreate() {
    resetForm();
    setModalOpen(true);
  }

  function openEdit(company: CompanyListItem) {
    setEditing(company);
    setName(company.name);
    setTaxId(company.taxId ?? "");
    setIsActive(company.isActive);
    setModalOpen(true);
  }

  async function invalidateCompanies() {
    await queryClient.invalidateQueries({ queryKey: ["companies"] });
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: name.trim(),
        taxId: taxId.trim() || null,
        isActive,
      };
      if (editing) {
        return updateCompany(editing.id, payload);
      }
      return createCompany(payload);
    },
    onSuccess: async () => {
      toast.success(editing ? "Empresa actualizada." : "Empresa creada.");
      setModalOpen(false);
      resetForm();
      await invalidateCompanies();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => deactivateCompany(id),
    onSuccess: async () => {
      toast.success("Empresa desactivada.");
      await invalidateCompanies();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => activateCompany(id),
    onSuccess: async () => {
      toast.success("Empresa activada.");
      await invalidateCompanies();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteCompany(id),
    onSuccess: async () => {
      toast.success("Empresa eliminada.");
      await invalidateCompanies();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  function handleDeactivate(company: CompanyListItem) {
    requestConfirm({
      title: "Desactivar empresa",
      description: `¿Desactivar "${company.name}"? Dejará de aparecer en el selector. Puedes reactivarla después.`,
      confirmLabel: "Desactivar",
      destructive: true,
      onConfirm: () => deactivateMutation.mutate(company.id),
    });
  }

  function handleDelete(company: CompanyListItem) {
    requestConfirm({
      title: "Eliminar empresa",
      description: `¿Eliminar permanentemente "${company.name}"? Solo es posible si no tiene datos asociados.`,
      confirmLabel: "Eliminar",
      destructive: true,
      onConfirm: () => deleteMutation.mutate(company.id),
    });
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4">
      {canManage ? (
        <div className="flex justify-end">
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-4" />
            Nueva empresa
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Solo SuperUsuario puede gestionar empresas. Si tienen datos
          asociados no se pueden eliminar (solo desactivar).
        </p>
      )}

      {companies.length === 0 ? (
        <EmptyState message="No tienes empresas accesibles." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Identificación fiscal</TableHead>
                  <TableHead>Estado</TableHead>
                  {canManage ? <TableHead>Acciones</TableHead> : null}
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
                    {canManage ? (
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(company)}
                          >
                            <Edit className="size-4" />
                            Editar
                          </Button>
                          {company.isActive ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeactivate(company)}
                            >
                              Desactivar
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => activateMutation.mutate(company.id)}
                            >
                              Activar
                            </Button>
                          )}
                          {company.canDelete ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-600"
                              onClick={() => handleDelete(company)}
                            >
                              <UserX className="size-4" />
                              Eliminar
                            </Button>
                          ) : (
                            <span className="self-center text-xs text-muted-foreground">
                              Con datos
                            </span>
                          )}
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <FormModal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) resetForm();
        }}
        size="xs"
        title={editing ? "Editar empresa" : "Nueva empresa"}
        description={
          editing
            ? "Actualiza los datos de la empresa."
            : "Crea una empresa del sistema. SuperUsuario la verá de inmediato."
        }
        footer={
          <FormModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={saveMutation.isPending || !name.trim()}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : editing ? (
                "Guardar"
              ) : (
                "Crear"
              )}
            </Button>
          </FormModalFooter>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. INSIDE Colombia"
            />
          </div>
          <div className="space-y-2">
            <Label>Identificación fiscal (opcional)</Label>
            <Input
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              placeholder="NIT / Tax ID"
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isActive}
              onCheckedChange={(value) => setIsActive(value === true)}
              id="company-active"
            />
            <Label htmlFor="company-active">Activa</Label>
          </div>
        </div>
      </FormModal>

      <ConfirmActionDialog {...confirmDialogProps} />
    </div>
  );
}

function getRoleDescription(roleName: string): string {
  switch (roleName) {
    case ROLE_IDS.SuperUser:
      return "Acceso global y multi-empresa. Puede gestionar usuarios, roles y empresas.";
    case ROLE_IDS.Admin:
      return "Administrador de una empresa. Gestiona usuarios y catálogos de su organización.";
    case ROLE_IDS.Employee:
      return "Operador interno. Acceso a módulos operativos según permisos.";
    case ROLE_IDS.Client:
      return "Usuario externo vinculado a un cliente. Acceso de solo lectura al portal.";
    default:
      return "Rol personalizado. Configura sus permisos en Permisos por rol.";
  }
}
