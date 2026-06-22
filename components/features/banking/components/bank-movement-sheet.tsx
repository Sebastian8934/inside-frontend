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
import { useAccountHoldersList } from "@/components/features/banking/hooks/use-account-holders-list";
import { useBankMovementForm } from "@/components/features/banking/hooks/use-bank-movement-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import type { BankMovementListItem } from "@/types/banking";
import { MONTH_NAMES } from "@/types/banking";

type BankMovementSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movement?: BankMovementListItem | null;
  defaultDate: string;
  defaultPeriod: { periodMonth: number; periodYear: number };
};

export function BankMovementSheet({
  open,
  onOpenChange,
  movement,
  defaultDate,
  defaultPeriod,
}: BankMovementSheetProps) {
  const companyId = useActiveCompanyId();
  const { data: accountHolders = [] } = useAccountHoldersList({
    companyId,
    activeOnly: true,
  });

  const { form, handleSubmit, isEditing, isSubmitting } = useBankMovementForm({
    open,
    movement,
    companyId,
    defaultDate,
    defaultPeriod,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={
        isEditing ? "Editar movimiento bancario" : "Nuevo movimiento bancario"
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
            form="bank-movement-form"
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
          id="bank-movement-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="movementDate"
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
            name="accountHolderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titular</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar titular" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accountHolders.map((holder) => (
                      <SelectItem key={holder.id} value={String(holder.id)}>
                        {holder.name}
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
            name="concept"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Concepto</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={200} />
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
                <p className="text-xs text-gray-500">
                  Positivo = abono · Negativo = egreso
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="periodMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período mes</FormLabel>
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MONTH_NAMES.map((name, index) => (
                        <SelectItem key={name} value={String(index + 1)}>
                          {name}
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
              name="periodYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Período año</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={2000}
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
          </div>
        </form>
      </Form>
    </FormModal>
  );
}
