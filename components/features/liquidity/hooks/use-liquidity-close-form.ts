"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLiquidityMutations } from "@/components/features/liquidity/hooks/use-liquidity-mutations";
import {
  liquidityCloseSchema,
  liquidityCloseToFormValues,
  type LiquidityCloseFormValues,
} from "@/components/features/liquidity/schemas/liquidity-close.schema";
import type { DailyLiquidityCloseDetail } from "@/types/liquidity";

type UseLiquidityCloseFormOptions = {
  close: DailyLiquidityCloseDetail;
  companyId: number;
};

export function useLiquidityCloseForm({
  close,
  companyId,
}: UseLiquidityCloseFormOptions) {
  const { updateClose } = useLiquidityMutations(companyId);

  const form = useForm<LiquidityCloseFormValues>({
    resolver: zodResolver(liquidityCloseSchema),
    defaultValues: liquidityCloseToFormValues(close),
  });

  useEffect(() => {
    form.reset(liquidityCloseToFormValues(close));
  }, [close, form]);

  async function handleSubmit(values: LiquidityCloseFormValues) {
    await updateClose.mutateAsync({ closeId: close.id, values });
  }

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting || updateClose.isPending,
  };
}
