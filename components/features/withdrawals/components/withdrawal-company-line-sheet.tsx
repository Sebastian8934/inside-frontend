"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useWithdrawalCompanyLineForm } from "@/components/features/withdrawals/hooks/use-withdrawal-company-line-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import type {
  WithdrawalCompany,
  WithdrawalCompanyLine,
} from "@/types/withdrawals";

type LineContext = {
  company: WithdrawalCompany;
  line: WithdrawalCompanyLine;
};

type WithdrawalCompanyLineSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayId: number;
  companyId: number | null;
  line: LineContext | null;
};

export function WithdrawalCompanyLineSheet({
  open,
  onOpenChange,
  dayId,
  companyId,
  line,
}: WithdrawalCompanyLineSheetProps) {
  const { clients } = useWithdrawalCatalogQueries(companyId, open);

  const { form, handleSubmit, isSubmitting } = useWithdrawalCompanyLineForm({
    open,
    line,
    dayId,
    companyId,
    onSuccess: () => onOpenChange(false),
  });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={
        line ? `Editar retiros — ${line.company.name}` : "Editar retiros"
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
            form="withdrawal-company-line-form"
            disabled={!line || isSubmitting}
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Guardar"}
          </Button>
        </FormModalFooter>
      }
    >
      <Form {...form}>
        <form
          id="withdrawal-company-line-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente (holding)</FormLabel>
                <Select
                  value={field.value ? String(field.value) : "none"}
                  onValueChange={(value) =>
                    field.onChange(value === "none" ? null : Number(value))
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Sin cliente</SelectItem>
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

          <div className="space-y-3">
            <FormLabel>Retiros 1–10 (COP)</FormLabel>
            {form.watch("slots").map((slot, index) => (
              <FormField
                key={slot.slotIndex}
                control={form.control}
                name={`slots.${index}.amountCop`}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-3">
                      <span className="w-16 text-sm text-gray-500">
                        Retiro {slot.slotIndex}
                      </span>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          className="tabular-nums"
                          value={field.value || ""}
                          onChange={(event) => {
                            const amount = Number(event.target.value) || 0;
                            field.onChange(amount);
                            form.setValue(`slots.${index}.isActive`, amount > 0);
                          }}
                        />
                      </FormControl>
                      <Checkbox checked={field.value > 0} disabled />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </form>
      </Form>
    </FormModal>
  );
}
