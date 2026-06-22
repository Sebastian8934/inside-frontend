"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createWithdrawalConsolidatedApi,
  createWithdrawalDayApi,
  createWithdrawalTransferApi,
  deleteWithdrawalConsolidatedApi,
  deleteWithdrawalTransferApi,
  updateWithdrawalConsolidatedApi,
  updateWithdrawalTransferApi,
  upsertWithdrawalCompanyLineApi,
} from "@/components/features/withdrawals/api/withdrawals.api";
import type { WithdrawalCompanyLineFormValues } from "@/components/features/withdrawals/schemas/withdrawal-company-line.schema";
import type { WithdrawalConsolidatedFormValues } from "@/components/features/withdrawals/schemas/withdrawal-consolidated.schema";
import type { WithdrawalTransferFormValues } from "@/components/features/withdrawals/schemas/withdrawal-transfer.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";
import { queryKeys } from "@/lib/query/query-keys";

function invalidateWithdrawals(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.withdrawals.root });
}

export function useWithdrawalDayMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const createDay = useMutation({
    mutationFn: (operationDate: string) => {
      if (!companyId) throw new Error("Empresa no seleccionada.");
      return createWithdrawalDayApi(operationDate, companyId);
    },
    onSuccess: () => {
      toast.success("Día de retiros creado.");
      invalidateWithdrawals(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return { createDay };
}

export function useWithdrawalCompanyLineMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const upsertLine = useMutation({
    mutationFn: ({
      dayId,
      withdrawalCompanyId,
      values,
    }: {
      dayId: number;
      withdrawalCompanyId: number;
      values: WithdrawalCompanyLineFormValues;
    }) => {
      if (!companyId) throw new Error("Empresa no seleccionada.");

      return upsertWithdrawalCompanyLineApi(
        dayId,
        {
          withdrawalCompanyId,
          clientId: values.clientId ?? null,
          slots: values.slots.map((slot) => ({
            ...slot,
            isActive: slot.amountCop > 0,
          })),
        },
        companyId,
      );
    },
    onSuccess: () => {
      toast.success("Línea guardada.");
      invalidateWithdrawals(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return { upsertLine };
}

export function useWithdrawalTransferMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const saveTransfer = useMutation({
    mutationFn: ({
      dayId,
      transferId,
      values,
    }: {
      dayId: number;
      transferId?: number;
      values: WithdrawalTransferFormValues;
    }) => {
      if (!companyId) throw new Error("Empresa no seleccionada.");

      const payload = {
        withdrawalCompanyId: values.withdrawalCompanyId,
        amountCop: values.amountCop,
        transferType: values.transferType,
      };

      if (transferId) {
        return updateWithdrawalTransferApi(transferId, payload, companyId);
      }

      return createWithdrawalTransferApi(dayId, payload, companyId);
    },
    onSuccess: (_, { transferId }) => {
      toast.success(
        transferId ? "Transferencia actualizada." : "Transferencia creada.",
      );
      invalidateWithdrawals(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteTransfer = useMutation({
    mutationFn: (transferId: number) => {
      if (!companyId) throw new Error("Empresa no seleccionada.");
      return deleteWithdrawalTransferApi(transferId, companyId);
    },
    onSuccess: () => {
      toast.success("Transferencia eliminada.");
      invalidateWithdrawals(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return { saveTransfer, deleteTransfer };
}

export function useWithdrawalConsolidatedMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const saveConsolidated = useMutation({
    mutationFn: ({
      itemId,
      values,
    }: {
      itemId?: number;
      values: WithdrawalConsolidatedFormValues;
    }) => {
      if (!companyId) throw new Error("Empresa no seleccionada.");

      const payload = {
        operationDate: values.operationDate,
        withdrawalCompanyId: values.withdrawalCompanyId,
        amountCop: values.amountCop,
        holding: values.holding || null,
        periodMonth: values.periodMonth,
        periodYear: values.periodYear,
      };

      if (itemId) {
        return updateWithdrawalConsolidatedApi(itemId, payload, companyId);
      }

      return createWithdrawalConsolidatedApi({ ...payload, companyId });
    },
    onSuccess: (_, { itemId }) => {
      toast.success(itemId ? "Registro actualizado." : "Registro creado.");
      invalidateWithdrawals(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const deleteConsolidated = useMutation({
    mutationFn: (itemId: number) => {
      if (!companyId) throw new Error("Empresa no seleccionada.");
      return deleteWithdrawalConsolidatedApi(itemId, companyId);
    },
    onSuccess: () => {
      toast.success("Registro eliminado.");
      invalidateWithdrawals(queryClient);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return { saveConsolidated, deleteConsolidated };
}
