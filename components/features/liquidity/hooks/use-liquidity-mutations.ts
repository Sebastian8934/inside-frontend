"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  closeLiquidityDayApi,
  createLiquidityCloseApi,
  createLiquidityPositionLineApi,
  deleteLiquidityPositionLineApi,
  refreshLiquidityFromDeliveryApi,
  updateLiquidityCloseApi,
  updateLiquidityPositionLineApi,
} from "@/components/features/liquidity/api/liquidity.api";
import type { LiquidityCloseFormValues } from "@/components/features/liquidity/schemas/liquidity-close.schema";
import type { LiquidityPositionLineFormValues } from "@/components/features/liquidity/schemas/liquidity-position-line.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";
import { queryKeys } from "@/lib/query/query-keys";

export function useLiquidityMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.liquidity.root });
  };

  const createClose = useMutation({
    mutationFn: (operationDate: string) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createLiquidityCloseApi({
        operationDate,
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Cierre de liquidez creado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateClose = useMutation({
    mutationFn: ({
      closeId,
      values,
    }: {
      closeId: number;
      values: LiquidityCloseFormValues;
    }) =>
      updateLiquidityCloseApi(
        closeId,
        { notes: values.notes?.trim() || null },
        companyId,
      ),
    onSuccess: () => {
      toast.success("Notas actualizadas.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const refreshFromDelivery = useMutation({
    mutationFn: (closeId: number) =>
      refreshLiquidityFromDeliveryApi(closeId, companyId),
    onSuccess: () => {
      toast.success("Pendiente delivery actualizado desde saldos.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const closeDay = useMutation({
    mutationFn: (closeId: number) => closeLiquidityDayApi(closeId, companyId),
    onSuccess: () => {
      toast.success("Cierre de liquidez cerrado.");
      invalidate();
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const createPositionLine = useMutation({
    mutationFn: ({
      closeId,
      values,
    }: {
      closeId: number;
      values: LiquidityPositionLineFormValues;
    }) => createLiquidityPositionLineApi(closeId, values, companyId),
    onSuccess: () => {
      toast.success("Línea creada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updatePositionLine = useMutation({
    mutationFn: ({
      lineId,
      values,
    }: {
      lineId: number;
      values: LiquidityPositionLineFormValues;
    }) => updateLiquidityPositionLineApi(lineId, values, companyId),
    onSuccess: () => {
      toast.success("Línea actualizada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deletePositionLine = useMutation({
    mutationFn: (lineId: number) =>
      deleteLiquidityPositionLineApi(lineId, companyId),
    onSuccess: () => {
      toast.success("Línea eliminada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createClose,
    updateClose,
    refreshFromDelivery,
    closeDay,
    createPositionLine,
    updatePositionLine,
    deletePositionLine,
    isPending:
      createClose.isPending ||
      updateClose.isPending ||
      refreshFromDelivery.isPending ||
      closeDay.isPending ||
      createPositionLine.isPending ||
      updatePositionLine.isPending ||
      deletePositionLine.isPending,
  };
}
