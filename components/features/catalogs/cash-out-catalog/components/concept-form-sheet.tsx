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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InactiveConfirmSwitch } from "@/components/shared/inactive-confirm-switch";
import { useCashOutConceptForm } from "@/components/features/catalogs/cash-out-catalog/hooks/use-cash-out-concept-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import type { CashOutConcept, CashOutGroup } from "@/types/cash-out";

type ConceptFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number | null;
  concept?: CashOutConcept | null;
  groups: CashOutGroup[];
};

export function ConceptFormSheet({
  open,
  onOpenChange,
  companyId,
  concept,
  groups,
}: ConceptFormSheetProps) {
  const { form, handleSubmit, isEditing, isSubmitting } = useCashOutConceptForm({
    open,
    concept,
    companyId,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="xs"
      title={isEditing ? "Editar concepto" : "Nuevo concepto"}
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
            form="cash-out-concept-form"
            disabled={isSubmitting}
          >
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
          id="cash-out-concept-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="groupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar grupo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={String(group.id)}>
                        {group.name}
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
                      entityName="este concepto"
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
