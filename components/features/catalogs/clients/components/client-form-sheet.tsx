"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InactiveConfirmSwitch } from "@/components/shared/inactive-confirm-switch";
import { useClientForm } from "@/components/features/catalogs/clients/hooks/use-client-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import type { Client } from "@/types/catalogs";

type ClientFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number | null;
  client?: Client | null;
};

export function ClientFormSheet({
  open,
  onOpenChange,
  companyId,
  client,
}: ClientFormSheetProps) {
  const { form, handleSubmit, isEditing, isSubmitting } = useClientForm({
    open,
    client,
    companyId,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="xs"
      title={isEditing ? "Editar cliente" : "Nuevo cliente"}
      description={
        isEditing
          ? "Actualiza los datos del cliente."
          : "Registra un nuevo cliente en el catálogo."
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
          <Button
            type="submit"
            form="client-form"
            disabled={isSubmitting}
          >
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
          id="client-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="FAY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="correctedName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre corregido</FormLabel>
                <FormControl>
                  <Input placeholder="FAY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isEditing ? (
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel>Activo</FormLabel>
                  <FormControl>
                    <InactiveConfirmSwitch
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                      entityName="este cliente"
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
