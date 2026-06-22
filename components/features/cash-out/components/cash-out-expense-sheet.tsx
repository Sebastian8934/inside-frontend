"use client";

import { useEffect, useMemo } from "react";
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
import { useCashOutCatalogQueries } from "@/components/features/cash-out/hooks/use-cash-out-catalog-queries";
import { useCashOutExpenseForm } from "@/components/features/cash-out/hooks/use-cash-out-expense-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import type { CashOutExpenseListItem } from "@/types/cash-out";

type CashOutExpenseSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  expense?: CashOutExpenseListItem | null;
  defaultDate: string;
};

export function CashOutExpenseSheet({
  open,
  onOpenChange,
  companyId,
  expense,
  defaultDate,
}: CashOutExpenseSheetProps) {
  const { groups, concepts, paymentAccounts } = useCashOutCatalogQueries(
    companyId,
    open,
  );

  const { form, handleSubmit, isEditing, isSubmitting } = useCashOutExpenseForm({
    open,
    expense,
    companyId,
    defaultDate,
    onSuccess: () => onOpenChange(false),
  });

  const groupId = form.watch("groupId");

  const filteredConcepts = useMemo(
    () =>
      groupId
        ? concepts.filter((concept) => concept.groupId === groupId)
        : concepts,
    [concepts, groupId],
  );

  useEffect(() => {
    const conceptId = form.getValues("conceptId");
    if (
      conceptId &&
      !filteredConcepts.some((concept) => concept.id === conceptId)
    ) {
      form.setValue("conceptId", 0);
    }
  }, [groupId, filteredConcepts, form]);

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={isEditing ? "Editar egreso" : "Nuevo egreso"}
      footer={
        <FormModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" form="cash-out-expense-form" disabled={isSubmitting}>
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
          id="cash-out-expense-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="expenseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            name="conceptId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Concepto</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                  disabled={!groupId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar concepto" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredConcepts.map((concept) => (
                      <SelectItem key={concept.id} value={String(concept.id)}>
                        {concept.name}
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
            name="paymentAccountId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuenta de pago</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cuenta" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentAccounts.map((account) => (
                      <SelectItem key={account.id} value={String(account.id)}>
                        {account.name}
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
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={500} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amountCop"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto COP</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="tabular-nums"
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? 0 : e.target.valueAsNumber,
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expenseType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo (opcional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    maxLength={100}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormModal>
  );
}
