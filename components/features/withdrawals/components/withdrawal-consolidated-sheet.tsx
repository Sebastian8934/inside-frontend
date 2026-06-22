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
import { useWithdrawalCatalogQueries } from "@/components/features/withdrawals/hooks/use-withdrawal-catalog-queries";
import { useWithdrawalConsolidatedForm } from "@/components/features/withdrawals/hooks/use-withdrawal-consolidated-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import { toDateOnlyString } from "@/lib/api/build-url";
import { useOperativeDate } from "@/hooks/use-active-company";
import type { WithdrawalConsolidatedItem } from "@/types/withdrawals";

type WithdrawalConsolidatedSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number | null;
  item: WithdrawalConsolidatedItem | null;
  defaultPeriodMonth: number;
  defaultPeriodYear: number;
};

export function WithdrawalConsolidatedSheet({
  open,
  onOpenChange,
  companyId,
  item,
  defaultPeriodMonth,
  defaultPeriodYear,
}: WithdrawalConsolidatedSheetProps) {
  const operativeDate = useOperativeDate();
  const operationDate = toDateOnlyString(operativeDate);
  const { companies } = useWithdrawalCatalogQueries(companyId, open);
  const defaultCompanyId = companies[0]?.id;

  const { form, handleSubmit, isEditing, isSubmitting } =
    useWithdrawalConsolidatedForm({
      open,
      item,
      companyId,
      operationDate,
      periodMonth: defaultPeriodMonth,
      periodYear: defaultPeriodYear,
      defaultCompanyId,
      onSuccess: () => onOpenChange(false),
    });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={isEditing ? "Editar consolidado" : "Nuevo consolidado"}
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
            form="withdrawal-consolidated-form"
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
          id="withdrawal-consolidated-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="operationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha operación</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="withdrawalCompanyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa de retiro</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="holding"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Holding</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
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
                <FormLabel>Importe COP</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    className="tabular-nums"
                    value={field.value}
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber || 0)
                    }
                  />
                </FormControl>
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
                  <FormLabel>Mes</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber || 1)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="periodYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Año</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber || 2000)
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
