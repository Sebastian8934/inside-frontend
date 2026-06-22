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
import { Textarea } from "@/components/ui/textarea";
import { useCashOutTransactionCostForm } from "@/components/features/cash-out/hooks/use-cash-out-transaction-cost-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import type { CashOutTransactionCost } from "@/types/cash-out";

type CashOutTransactionCostSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  cost?: CashOutTransactionCost | null;
  defaultDate: string;
};

export function CashOutTransactionCostSheet({
  open,
  onOpenChange,
  companyId,
  cost,
  defaultDate,
}: CashOutTransactionCostSheetProps) {
  const { form, handleSubmit, isEditing, isSubmitting } =
    useCashOutTransactionCostForm({
      open,
      cost,
      companyId,
      defaultDate,
      onSuccess: () => onOpenChange(false),
    });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={
        isEditing ? "Editar costo por transacción" : "Nuevo costo por transacción"
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
            form="cash-out-transaction-cost-form"
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
          id="cash-out-transaction-cost-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="costDate"
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
            name="operationalGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo operativo</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} maxLength={150} />
                </FormControl>
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
                  <Input {...field} value={field.value ?? ""} maxLength={200} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="amountCop"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto COP</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      className="tabular-nums"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : e.target.valueAsNumber,
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
              name="costPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>% costo</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.0001"
                      className="tabular-nums"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ""
                            ? null
                            : e.target.valueAsNumber,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comentario</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    maxLength={500}
                    rows={3}
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
