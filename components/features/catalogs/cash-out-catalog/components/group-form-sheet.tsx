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
import { useCashOutGroupForm } from "@/components/features/catalogs/cash-out-catalog/hooks/use-cash-out-group-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import type { CashOutGroup } from "@/types/cash-out";

type GroupFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number | null;
  group?: CashOutGroup | null;
};

export function GroupFormSheet({
  open,
  onOpenChange,
  companyId,
  group,
}: GroupFormSheetProps) {
  const { form, handleSubmit, isEditing, isSubmitting } = useCashOutGroupForm({
    open,
    group,
    companyId,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="xs"
      title={isEditing ? "Editar grupo" : "Nuevo grupo"}
      footer={
        <FormModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" form="cash-out-group-form" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Guardar"
            )}
          </Button>
        </FormModalFooter>
      }
    >
      <Form {...form}>
        <form
          id="cash-out-group-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                      entityName="este grupo"
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
