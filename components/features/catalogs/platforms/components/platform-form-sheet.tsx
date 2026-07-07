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
import { usePlatformForm } from "@/components/features/catalogs/platforms/hooks/use-platform-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import type { Platform } from "@/types/catalogs";

type PlatformFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number | null;
  platform?: Platform | null;
};

export function PlatformFormSheet({
  open,
  onOpenChange,
  companyId,
  platform,
}: PlatformFormSheetProps) {
  const { form, handleSubmit, isEditing, isSubmitting } = usePlatformForm({
    open,
    platform,
    companyId,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="xs"
      title={isEditing ? "Editar plataforma" : "Nueva plataforma"}
      footer={
        <FormModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" form="platform-form" disabled={isSubmitting}>
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
          id="platform-form"
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
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
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
                  <FormLabel>Activa</FormLabel>
                  <FormControl>
                    <InactiveConfirmSwitch
                      checked={field.value ?? true}
                      onCheckedChange={field.onChange}
                      entityName="esta plataforma"
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
