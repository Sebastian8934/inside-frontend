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
import { useUsdtLoanCatalogQueries } from "@/components/features/usdt-loans/hooks/use-usdt-loan-catalog-queries";
import { useUsdtLoanForm } from "@/components/features/usdt-loans/hooks/use-usdt-loan-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import type { UsdtLoan } from "@/types/usdt-loans";

type UsdtLoanFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loan?: UsdtLoan | null;
};

export function UsdtLoanFormSheet({
  open,
  onOpenChange,
  loan,
}: UsdtLoanFormSheetProps) {
  const companyId = useActiveCompanyId();
  const { clients } = useUsdtLoanCatalogQueries(companyId, open);

  const { form, handleSubmit, isEditing, isSubmitting, pendingUsdt } =
    useUsdtLoanForm({
      open,
      loan,
      companyId,
      onSuccess: () => onOpenChange(false),
    });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="xs"
      title={
        isEditing && loan
          ? `Editar préstamo — ${loan.clientCode}`
          : "Nuevo préstamo USDT"
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
            form="usdt-loan-form"
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
          id="usdt-loan-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          {!isEditing ? (
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
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
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          <FormField
            control={form.control}
            name="lentUsdt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>USDT prestado</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.00000001"
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
            name="returnedUsdt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>USDT devuelto</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step="0.00000001"
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
            name="averageRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tasa promedio</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
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

          <div className="rounded-md bg-gray-50 p-3 text-sm">
            <span className="text-gray-600">Pendiente: </span>
            <span className="font-semibold tabular-nums">
              {pendingUsdt.toLocaleString("es-CO", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 8,
              })}{" "}
              USDT
            </span>
          </div>
        </form>
      </Form>
    </FormModal>
  );
}
