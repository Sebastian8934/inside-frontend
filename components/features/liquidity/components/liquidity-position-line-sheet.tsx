"use client";

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
import { useLiquidityPositionLineForm } from "@/components/features/liquidity/hooks/use-liquidity-position-line-form";
import { FormModal, FormModalFooter } from "@/components/shared/form-modal";
import { useActiveCompanyId } from "@/hooks/use-active-company";
import type { LiquidityPositionLine } from "@/types/liquidity";
import {
  LIQUIDITY_CATEGORY_LABELS,
  LIQUIDITY_POSITION_CATEGORIES,
} from "@/types/liquidity";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  closeId: number;
  line: LiquidityPositionLine | null;
  nextSortOrder: number;
  defaultCategory?: string;
};

export function LiquidityPositionLineSheet({
  open,
  onOpenChange,
  closeId,
  line,
  nextSortOrder,
  defaultCategory,
}: Props) {
  const companyId = useActiveCompanyId();

  const { form, handleSubmit, isEditing, isSubmitting } =
    useLiquidityPositionLineForm({
      open,
      closeId,
      companyId,
      line,
      nextSortOrder,
      defaultCategory,
      onSuccess: () => onOpenChange(false),
    });

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      title={isEditing ? "Editar línea de posición" : "Nueva línea de posición"}
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
            form="liquidity-position-line-form"
            disabled={isSubmitting}
          >
            Guardar
          </Button>
        </FormModalFooter>
      }
    >
      <Form {...form}>
        <form
          id="liquidity-position-line-form"
          className="space-y-4"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LIQUIDITY_POSITION_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {LIQUIDITY_CATEGORY_LABELS[cat] ?? cat}
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
                    min={0}
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
        </form>
      </Form>
    </FormModal>
  );
}
