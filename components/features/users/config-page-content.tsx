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
import { useUserMutations } from "@/components/features/users/hooks/use-user-mutations";
import { useUsersList } from "@/components/features/users/hooks/use-users-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { PageHeader } from "@/components/shared/page-header";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import { canManageUsers, getPrimaryRoleLabel, getRoleLabel } from "@/lib/auth/permissions";
import { useUserRoles } from "@/hooks/use-user-roles";
import { useAuthStore } from "@/stores/auth-store";
import type { UserDetail } from "@/types/users";

export function ConfigPageContent() {
  const userRoles = useUserRoles();

  if (!canManageUsers(userRoles)) {
    return (
      <div className="p-6">
        <EmptyState message="No tienes permisos para acceder a configuración." />
      </div>
    );
  }

  return <UsersConfigPanel />;
}

function UsersConfigPanel() {
  const companyId = useActiveCompanyId();
  const currentUser = useAuthStore((state) => state.user);
  const { deactivateUser } = useUserMutations();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDetail | null>(null);

  const { data: users, isLoading } = useUsersList();

  return (
    <div className="p-6">
      <PageHeader
        title="Configuración"
        description="Gestión de usuarios y configuración del sistema"
      />

      <Tabs defaultValue="usuarios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
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
                        <TableCell>{user.companyName}</TableCell>
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
                                  deactivateUser.mutate(user.id)
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
    </div>
  );
}
