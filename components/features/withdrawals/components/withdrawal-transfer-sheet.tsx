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
import { useWithdrawalTransferForm } from "@/components/features/withdrawals/hooks/use-withdrawal-transfer-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import type { WithdrawalTransfer } from "@/types/withdrawals";
import { WITHDRAWAL_TRANSFER_TYPES } from "@/types/withdrawals";

type WithdrawalTransferSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayId: number;
  companyId: number | null;
  transfer: WithdrawalTransfer | null;
};

export function WithdrawalTransferSheet({
  open,
  onOpenChange,
  dayId,
  companyId,
  transfer,
}: WithdrawalTransferSheetProps) {
  const { companies } = useWithdrawalCatalogQueries(companyId, open);
  const defaultCompanyId = companies[0]?.id;

  const { form, handleSubmit, isEditing, isSubmitting } =
    useWithdrawalTransferForm({
      open,
      transfer,
      dayId,
      companyId,
      defaultCompanyId,
      onSuccess: () => onOpenChange(false),
    });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="xs"
      title={isEditing ? "Editar transferencia" : "Nueva transferencia"}
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
            form="withdrawal-transfer-form"
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
          id="withdrawal-transfer-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="withdrawalCompanyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa" />
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
            name="transferType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {WITHDRAWAL_TRANSFER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
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
            name="amountCop"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monto COP</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    className="tabular-nums"
                    value={field.value || ""}
                    onChange={(event) =>
                      field.onChange(event.target.valueAsNumber || 0)
                    }
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
