"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLiquidityMutations } from "@/components/features/liquidity/hooks/use-liquidity-mutations";
import {
  liquidityPositionLineDefaultValues,
  liquidityPositionLineSchema,
  liquidityPositionLineToFormValues,
  type LiquidityPositionLineFormValues,
} from "@/components/features/liquidity/schemas/liquidity-position-line.schema";
import type { LiquidityPositionLine } from "@/types/liquidity";

type UseLiquidityPositionLineFormOptions = {
  open: boolean;
  closeId: number;
  companyId: number | null;
  line?: LiquidityPositionLine | null;
  nextSortOrder: number;
  defaultCategory?: string;
  onSuccess?: () => void;
};

export function useLiquidityPositionLineForm({
  open,
  closeId,
  companyId,
  line,
  nextSortOrder,
  defaultCategory,
  onSuccess,
}: UseLiquidityPositionLineFormOptions) {
  const { createPositionLine, updatePositionLine } =
    useLiquidityMutations(companyId);

  const form = useForm<LiquidityPositionLineFormValues>({
    resolver: zodResolver(liquidityPositionLineSchema),
    defaultValues: liquidityPositionLineDefaultValues(
      nextSortOrder,
      defaultCategory,
    ),
  });

  useEffect(() => {
    if (!open) return;

    if (line) {
      form.reset(liquidityPositionLineToFormValues(line));
      return;
    }

    form.reset(
      liquidityPositionLineDefaultValues(nextSortOrder, defaultCategory),
    );
  }, [open, line, nextSortOrder, defaultCategory, form]);

  async function handleSubmit(values: LiquidityPositionLineFormValues) {
    if (line) {
      await updatePositionLine.mutateAsync({ lineId: line.id, values });
    } else {
      await createPositionLine.mutateAsync({ closeId, values });
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(line),
    isSubmitting: form.formState.isSubmitting,
  };
}
