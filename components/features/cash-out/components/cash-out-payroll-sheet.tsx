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
import { useCashOutPayrollForm } from "@/components/features/cash-out/hooks/use-cash-out-payroll-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import type { PayrollEntry } from "@/types/cash-out";
import { MONTH_NAMES } from "@/types/cash-out";
import { formatCop } from "@/lib/utils/format";

type CashOutPayrollSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  entry?: PayrollEntry | null;
  defaultPeriod: { periodMonth: number; periodYear: number };
};

export function CashOutPayrollSheet({
  open,
  onOpenChange,
  companyId,
  entry,
  defaultPeriod,
}: CashOutPayrollSheetProps) {
  const { form, handleSubmit, totalCop, isEditing, isSubmitting } =
    useCashOutPayrollForm({
      open,
      entry,
      companyId,
      defaultPeriod,
      onSuccess: () => onOpenChange(false),
    });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={isEditing ? "Editar nómina" : "Nuevo registro de nómina"}
      footer={
        <FormModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" form="cash-out-payroll-form" disabled={isSubmitting}>
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
          id="cash-out-payroll-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="periodMonth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mes</FormLabel>
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
                  <FormLabel>Año</FormLabel>
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

          <FormField
            control={form.control}
            name="employeeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empleado</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={200} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input {...field} maxLength={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="baseSalaryCop"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salario base COP</FormLabel>
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
            name="bonusCop"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bonificación COP</FormLabel>
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

          <div className="rounded-md bg-gray-50 p-3 text-sm">
            <span className="text-gray-600">Total: </span>
            <span className="font-semibold tabular-nums">
              {formatCop(totalCop)}
            </span>
          </div>
        </form>
      </Form>
    </FormModal>
  );
}
