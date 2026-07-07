"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InactiveConfirmSwitch } from "@/components/shared/inactive-confirm-switch";
import { useCommercialRepsList } from "@/components/features/catalogs/commercial-reps/hooks/use-commercial-reps-list";
import { useClientsList } from "@/components/features/catalogs/clients/hooks/use-clients-list";
import { useRolesList } from "@/components/features/users/hooks/use-roles-list";
import { useUserForm } from "@/components/features/users/hooks/use-user-form";
import { useAccessibleCompanies } from "@/hooks/use-accessible-companies";
import { useCompanyContext } from "@/hooks/use-company-context";
import { identityPasswordHint } from "@/lib/validation/password.schema";
import { getRoleLabel, ROLE_IDS } from "@/config/roles";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import type { UserDetail } from "@/types/users";

type UserFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserDetail | null;
  defaultCompanyId: number;
};

export function UserFormSheet({
  open,
  onOpenChange,
  user,
  defaultCompanyId,
}: UserFormSheetProps) {
  const { data: roles = [] } = useRolesList();
  const { data: companyContext } = useCompanyContext();
  const { data: companies = [] } = useAccessibleCompanies();
  const callerIsSuperUser =
    companyContext?.role === ROLE_IDS.SuperUser;

  const { form, handleSubmit, isEditing, isSubmitting } = useUserForm({
    open,
    user,
    defaultCompanyId,
    onSuccess: () => onOpenChange(false),
  });

  const companyId = form.watch("companyId");
  const selectedRole = form.watch("role");
  const companyAccessIds = form.watch("companyAccessIds") ?? [];

  const { data: clients = [] } = useClientsList(companyId ?? defaultCompanyId);
  const { data: commercialReps = [] } = useCommercialRepsList(
    companyId ?? defaultCompanyId,
  );

  useEffect(() => {
    if (!open) return;

    if (selectedRole === ROLE_IDS.SuperUser) {
      const current = form.getValues("companyAccessIds") ?? [];
      const company = form.getValues("companyId");

      if (company && !current.includes(company)) {
        form.setValue("companyAccessIds", [...current, company]);
      }
    }
  }, [open, selectedRole, form]);

  function toggleCompanyAccess(id: number, checked: boolean) {
    const current = form.getValues("companyAccessIds") ?? [];
    const next = checked
      ? [...new Set([...current, id])]
      : current.filter((value) => value !== id);

    form.setValue("companyAccessIds", next, { shouldValidate: true });
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={isEditing ? "Editar usuario" : "Nuevo usuario"}
      description={
        isEditing
          ? "Actualiza los datos del usuario."
          : "Crea un nuevo usuario del sistema."
      }
      footer={
        <FormModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" form="user-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isEditing ? (
              "Guardar"
            ) : (
              "Crear"
            )}
          </Button>
        </FormModalFooter>
      }
    >
      <Form {...form}>
        <form
          id="user-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          {!isEditing ? (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>{identityPasswordHint}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : null}

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.name}>
                        {role.displayName ?? getRoleLabel(role.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa principal</FormLabel>
                {callerIsSuperUser ? (
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar empresa" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={String(company.id)}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <FormControl>
                    <Input
                      readOnly
                      value={
                        companies.find((c) => c.id === field.value)?.name ??
                        `Empresa #${field.value}`
                      }
                    />
                  </FormControl>
                )}
                <FormDescription>
                  Empresa por defecto del perfil del usuario.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedRole === ROLE_IDS.SuperUser && callerIsSuperUser ? (
            <FormField
              control={form.control}
              name="companyAccessIds"
              render={() => (
                <FormItem>
                  <FormLabel>Acceso multi-empresa</FormLabel>
                  <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                    {companies.map((company) => (
                      <label
                        key={company.id}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={companyAccessIds.includes(company.id)}
                          onCheckedChange={(checked) =>
                            toggleCompanyAccess(company.id, checked === true)
                          }
                        />
                        <span>{company.name}</span>
                      </label>
                    ))}
                  </div>
                  <FormDescription>
                    Empresas que el SuperUsuario puede operar y cambiar en el
                    header.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          {selectedRole === ROLE_IDS.Client ? (
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente vinculado</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) =>
                      field.onChange(value ? Number(value) : null)
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={String(client.id)}>
                          {client.code} — {client.correctedName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Requerido para usuarios con rol Cliente (portal).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          {selectedRole === ROLE_IDS.Employee ? (
            <FormField
              control={form.control}
              name="commercialRepId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Representante comercial</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : "none"}
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? null : Number(value))
                    }
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Opcional" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Sin vincular</SelectItem>
                      {commercialReps.map((rep) => (
                        <SelectItem key={rep.id} value={String(rep.id)}>
                          {rep.initials} — {rep.fullName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Opcional. Vincula al empleado con un comercial del
                    catálogo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          {isEditing ? (
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel>Activo</FormLabel>
                  <FormControl>
                    <InactiveConfirmSwitch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      entityName="este usuario"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ) : null}
        </form>
      </Form>
    </FormModal>
  );
}
