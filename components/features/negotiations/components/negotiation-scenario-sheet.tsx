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
import { useNegotiationScenarioForm } from "@/components/features/negotiations/hooks/use-negotiation-scenario-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import type { NegotiationRateScenario } from "@/types/negotiations";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dayId: number;
  companyId: number;
  scenario: NegotiationRateScenario | null;
  nextSortOrder: number;
};

export function NegotiationScenarioSheet({
  open,
  onOpenChange,
  dayId,
  companyId,
  scenario,
  nextSortOrder,
}: Props) {
  const { form, handleSubmit, isEditing, isSubmitting } =
    useNegotiationScenarioForm({
      open,
      scenario,
      dayId,
      companyId,
      nextSortOrder,
      onSuccess: () => onOpenChange(false),
    });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="xs"
      title={isEditing ? "Editar escenario" : "Nuevo escenario de tasa"}
      footer={
        <FormModalFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form="negotiation-scenario-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Guardar"}
          </Button>
        </FormModalFooter>
      }
    >
      <Form {...form}>
        <form
          id="negotiation-scenario-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
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
          <FormField
            control={form.control}
            name="costPercent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Costo %</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="spread"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spread</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : e.target.valueAsNumber,
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
            name="cobreRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tasa Cobre</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : e.target.valueAsNumber,
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
            name="closingRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tasa cierre</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? null : e.target.valueAsNumber,
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
            name="sortOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orden</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
