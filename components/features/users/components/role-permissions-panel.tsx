"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRolesList } from "@/components/features/users/hooks/use-roles-list";
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import {
  fetchMyPermissions,
  fetchPermissions,
  fetchRolePermissions,
  setRolePermissions,
} from "@/lib/api/permissions";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";
import { queryKeys } from "@/lib/query/query-keys";
import { getRoleLabel } from "@/lib/auth/permissions";
import { normalizeRoleId, normalizeRoleIds } from "@/config/roles";
import { useAuthStore } from "@/stores/auth-store";
import type { AppPermission } from "@/types/permissions";

export function RolePermissionsPanel() {
  const queryClient = useQueryClient();
  const setUserPermissions = useAuthStore((s) => s.setUserPermissions);
  const currentUserRoles = useAuthStore((s) => s.user?.roles ?? []);
  const { data: roles = [], isLoading: rolesLoading } = useRolesList();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());

  const { data: allPermissions, isLoading: permissionsLoading } = useQuery({
    queryKey: queryKeys.permissions.all(),
    queryFn: () => fetchPermissions(),
  });

  const {
    data: rolePermissions,
    isLoading: rolePermsLoading,
    isFetching: rolePermsFetching,
  } = useQuery({
    queryKey: queryKeys.permissions.role(selectedRoleId),
    queryFn: () => fetchRolePermissions(selectedRoleId),
    enabled: Boolean(selectedRoleId),
  });

  useEffect(() => {
    if (!selectedRoleId) {
      setSelectedIds((prev) => (prev.size === 0 ? prev : new Set()));
      return;
    }

    if (!rolePermissions) return;

    const nextIds = rolePermissions.map((p) => p.id);
    setSelectedIds((prev) => {
      if (
        prev.size === nextIds.length &&
        nextIds.every((id) => prev.has(id))
      ) {
        return prev;
      }
      return new Set(nextIds);
    });
  }, [selectedRoleId, rolePermissions]);

  const saveMutation = useMutation({
    mutationFn: () =>
      setRolePermissions(selectedRoleId, {
        roleId: selectedRoleId,
        permissionIds: [...selectedIds],
      }),
    onSuccess: async () => {
      toast.success("Permisos del rol actualizados.");
      await queryClient.invalidateQueries({
        queryKey: queryKeys.permissions.role(selectedRoleId),
      });

      const selectedRole = roles.find((r) => r.id === selectedRoleId);
      const selectedCanonical = selectedRole
        ? normalizeRoleId(selectedRole.name)
        : null;
      const myRoles = normalizeRoleIds(currentUserRoles);

      if (selectedCanonical && myRoles.includes(selectedCanonical)) {
        try {
          const permissions = await fetchMyPermissions();
          setUserPermissions(permissions);
          toast.message("Se actualizaron los permisos de tu sesión.");
        } catch {
          toast.message(
            "Guarda y vuelve a iniciar sesión para ver el cambio en el menú.",
          );
        }
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });

  const grouped = useMemo(() => {
    const map = new Map<string, AppPermission[]>();
    for (const permission of allPermissions ?? []) {
      const key = permission.moduleName ?? permission.moduleCode ?? "Otros";
      const list = map.get(key) ?? [];
      list.push(permission);
      map.set(key, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [allPermissions]);

  function togglePermission(id: number, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function toggleModule(modulePermissions: AppPermission[], checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const permission of modulePermissions) {
        if (checked) next.add(permission.id);
        else next.delete(permission.id);
      }
      return next;
    });
  }

  if (rolesLoading || permissionsLoading) {
    return <LoadingState />;
  }

  if (roles.length === 0) {
    return <EmptyState message="No hay roles disponibles." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-2">
          <Label>Rol</Label>
          <Select
            value={selectedRoleId || undefined}
            onValueChange={setSelectedRoleId}
          >
            <SelectTrigger className="w-[260px]">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.displayName ?? getRoleLabel(role.name)} ({role.name})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          disabled={
            !selectedRoleId || saveMutation.isPending || rolePermsFetching
          }
          onClick={() => saveMutation.mutate()}
        >
          Guardar permisos
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Desmarca permisos y pulsa Guardar. Si editas tu propio rol, el menú se
        actualiza al guardar. Otros usuarios lo verán al volver a iniciar
        sesión.
      </p>

      {!selectedRoleId ? (
        <EmptyState message="Selecciona un rol para editar sus permisos." />
      ) : rolePermsLoading ? (
        <LoadingState label="Cargando permisos del rol..." />
      ) : (
        <Card>
          <CardContent className="space-y-6 p-4">
            {grouped.map(([moduleName, permissions]) => {
              const allChecked = permissions.every((p) =>
                selectedIds.has(p.id),
              );
              const someChecked =
                !allChecked && permissions.some((p) => selectedIds.has(p.id));

              return (
                <div key={moduleName} className="space-y-2">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <Checkbox
                      checked={
                        allChecked ? true : someChecked ? "indeterminate" : false
                      }
                      onCheckedChange={(value) =>
                        toggleModule(permissions, value === true)
                      }
                    />
                    <h3 className="font-medium">{moduleName}</h3>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12" />
                        <TableHead>Código</TableHead>
                        <TableHead>Acción</TableHead>
                        <TableHead>Nombre</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissions.map((permission) => (
                        <TableRow key={permission.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedIds.has(permission.id)}
                              onCheckedChange={(value) =>
                                togglePermission(permission.id, value === true)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {permission.code}
                          </TableCell>
                          <TableCell>{permission.action}</TableCell>
                          <TableCell>{permission.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
