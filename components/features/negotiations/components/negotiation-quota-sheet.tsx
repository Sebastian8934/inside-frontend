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
import { useNegotiationCatalogQueries } from "@/components/features/negotiations/hooks/use-negotiation-catalog-queries";
import { useNegotiationQuotaForm } from "@/components/features/negotiations/hooks/use-negotiation-quota-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import type { NegotiationDailyQuota } from "@/types/negotiations";
import { NEGOTIATION_QUOTA_STATUSES } from "@/types/negotiations";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayId: number;
  companyId: number;
  quota: NegotiationDailyQuota | null;
};

export function NegotiationQuotaSheet({
  open,
  onOpenChange,
  dayId,
  companyId,
  quota,
}: Props) {
  const { commercialReps, counterparties } = useNegotiationCatalogQueries(
    companyId,
    open,
  );

  const { form, handleSubmit, isEditing, isSubmitting } = useNegotiationQuotaForm(
    {
      open,
      quota,
      dayId,
      companyId,
      onSuccess: () => onOpenChange(false),
    },
  );

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={isEditing ? "Editar cupo diario" : "Nuevo cupo diario"}
      footer={
        <FormModalFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="negotiation-quota-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Guardar"}
          </Button>
        </FormModalFooter>
      }
    >
      <Form {...form}>
        <form
          id="negotiation-quota-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          {!isEditing ? (
            <>
              <FormField
                control={form.control}
                name="commercialRepId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comercial</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Comercial" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {commercialReps.map((r) => (
                          <SelectItem key={r.id} value={String(r.id)}>
                            {r.initials} — {r.fullName}
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
                name="otcCounterpartyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraparte OTC</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ""}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="OTC" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {counterparties.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : quota ? (
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                Comercial:{" "}
                <span className="font-medium text-gray-900">
                  {quota.commercialRepInitials} — {quota.commercialRepName}
                </span>
              </p>
              <p>
                OTC:{" "}
                <span className="font-medium text-gray-900">
                  {quota.otcCounterpartyCode}
                </span>
              </p>
            </div>
          ) : null}

          <FormField
            control={form.control}
            name="quotaAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cupo</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="tabular-nums"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxDailyAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Máximo diario</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="tabular-nums"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="differenceAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Diferencia</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="tabular-nums"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {NEGOTIATION_QUOTA_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormModal>
  );
}
