"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
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
import { EmptyState, LoadingState } from "@/components/shared/data-states";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import { createModule, fetchModules, fetchMyPermissions, updateModule } from "@/lib/api/permissions";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";
import { queryKeys } from "@/lib/query/query-keys";
import { useAuthStore } from "@/stores/auth-store";
import type { AppModule } from "@/types/permissions";

type ModuleFormValues = {
  code: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  sortOrder: number;
  parentModuleId: number | null;
  isActive: boolean;
  seedCrudPermissions: boolean;
};

const EMPTY_FORM: ModuleFormValues = {
  code: "",
  name: "",
  description: "",
  route: "",
  icon: "",
  sortOrder: 0,
  parentModuleId: null,
  isActive: true,
  seedCrudPermissions: true,
};

export function ModulesPanel() {
  const queryClient = useQueryClient();
  const setUserPermissions = useAuthStore((s) => s.setUserPermissions);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AppModule | null>(null);
  const [values, setValues] = useState<ModuleFormValues>(EMPTY_FORM);

  const { data: modules = [], isLoading } = useQuery({
    queryKey: queryKeys.modules.all(true),
    queryFn: () => fetchModules(true),
  });

  function openCreate() {
    setEditing(null);
    setValues(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(module: AppModule) {
    setEditing(module);
    setValues({
      code: module.code,
      name: module.name,
      description: module.description ?? "",
      route: module.route ?? "",
      icon: module.icon ?? "",
      sortOrder: module.sortOrder,
      parentModuleId: module.parentModuleId ?? null,
      isActive: module.isActive,
      seedCrudPermissions: true,
    });
    setModalOpen(true);
  }

  function handleOpenChange(open: boolean) {
    setModalOpen(open);
    if (!open) {
      setEditing(null);
      setValues(EMPTY_FORM);
    }
  }

  const createMutation = useMutation({
    mutationFn: createModule,
    onSuccess: async () => {
      toast.success("Módulo creado.");
      handleOpenChange(false);
      await queryClient.invalidateQueries({ queryKey: ["modules"] });
      await queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Parameters<typeof updateModule>[1];
    }) => updateModule(id, payload),
    onSuccess: async (_data, variables) => {
      const isActive = variables.payload.isActive ?? true;
      toast.success("Módulo actualizado.");
      handleOpenChange(false);
      await queryClient.invalidateQueries({ queryKey: ["modules"] });
      try {
        const permissions = await fetchMyPermissions();
        setUserPermissions(permissions);
      } catch {
        // El menú se actualiza igual vía módulos activos.
      }
      toast.message(
        isActive
          ? "Módulo activo: visible en el menú (si el rol tiene permiso)."
          : "Módulo inactivo: oculto del menú para todos los usuarios.",
      );
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const saving = createMutation.isPending || updateMutation.isPending;

  function handleSave() {
    if (!values.code.trim() || !values.name.trim()) return;

    if (editing) {
      updateMutation.mutate({
        id: editing.id,
        payload: {
          name: values.name,
          description: values.description || null,
          route: values.route || null,
          icon: values.icon || null,
          sortOrder: values.sortOrder,
          parentModuleId: values.parentModuleId,
          isActive: values.isActive,
        },
      });
      return;
    }

    createMutation.mutate({
      code: values.code,
      name: values.name,
      description: values.description || null,
      route: values.route || null,
      icon: values.icon || null,
      sortOrder: values.sortOrder,
      parentModuleId: values.parentModuleId,
      isActive: values.isActive,
      seedCrudPermissions: values.seedCrudPermissions,
    });
  }

  if (isLoading) return <LoadingState />;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        <strong className="font-medium text-foreground">Activo</strong>: el
        módulo aparece en el menú (si el rol tiene el permiso View).{" "}
        <strong className="font-medium text-foreground">Inactivo</strong>: se
        oculta del menú para todos, aunque el rol tenga permiso. Es un apagado
        global del módulo, distinto de los permisos por rol.
      </p>
      <div className="flex justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus className="size-4" />
          Nuevo módulo
        </Button>
      </div>

      {modules.length === 0 ? (
        <EmptyState message="No hay módulos registrados." />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Orden</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell className="font-mono text-xs">
                      {module.code}
                    </TableCell>
                    <TableCell className="font-medium">{module.name}</TableCell>
                    <TableCell>{module.route ?? "—"}</TableCell>
                    <TableCell>{module.sortOrder}</TableCell>
                    <TableCell>
                      <Badge variant={module.isActive ? "default" : "secondary"}>
                        {module.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(module)}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <FormModal
        open={modalOpen}
        onOpenChange={handleOpenChange}
        size="xs"
        title={editing ? "Editar módulo" : "Nuevo módulo"}
        description={
          editing
            ? "Actualiza los datos del módulo."
            : "Crea un módulo y opcionalmente genera permisos CRUD."
        }
        footer={
          <FormModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={saving || !values.code.trim() || !values.name.trim()}
              onClick={handleSave}
            >
              {saving ? <Loader2 className="size-4 animate-spin" /> : "Guardar"}
            </Button>
          </FormModalFooter>
        }
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Código</Label>
            <Input
              value={values.code}
              disabled={Boolean(editing)}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, code: e.target.value }))
              }
              placeholder="Ej. Inventory"
            />
          </div>
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input
              value={values.name}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Descripción</Label>
            <Input
              value={values.description}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Ruta</Label>
            <Input
              value={values.route}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, route: e.target.value }))
              }
              placeholder="/inventario"
            />
          </div>
          <div className="space-y-2">
            <Label>Icono</Label>
            <Input
              value={values.icon}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, icon: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Orden</Label>
            <Input
              type="number"
              value={values.sortOrder}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  sortOrder: Number(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>ID módulo padre (opcional)</Label>
            <Input
              type="number"
              value={values.parentModuleId ?? ""}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  parentModuleId: e.target.value
                    ? Number(e.target.value)
                    : null,
                }))
              }
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={values.isActive}
              onCheckedChange={(checked) =>
                setValues((prev) => ({
                  ...prev,
                  isActive: checked === true,
                }))
              }
            />
            Activo
          </label>
          {!editing ? (
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={values.seedCrudPermissions}
                onCheckedChange={(checked) =>
                  setValues((prev) => ({
                    ...prev,
                    seedCrudPermissions: checked === true,
                  }))
                }
              />
              Generar permisos View/Create/Edit/Delete
            </label>
          ) : null}
        </div>
      </FormModal>
    </div>
  );
}
