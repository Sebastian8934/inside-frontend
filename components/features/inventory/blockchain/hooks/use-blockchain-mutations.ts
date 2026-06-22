"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBlockchainTransactionApi,
  matchBlockchainTransactionApi,
  unmatchBlockchainTransactionApi,
} from "@/components/features/inventory/blockchain/api/blockchain.api";
import type {
  BlockchainMatchFormValues,
  BlockchainTransactionFormValues,
} from "@/components/features/inventory/blockchain/schemas/blockchain.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";
import { queryKeys } from "@/lib/query/query-keys";

export function useBlockchainMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.blockchain.root });
  };

  const createMutation = useMutation({
    mutationFn: (values: BlockchainTransactionFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createBlockchainTransactionApi({
        txHash: values.txHash,
        amountUsdt: values.amountUsdt,
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Transacción registrada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const matchMutation = useMutation({
    mutationFn: ({
      transactionId,
      values,
    }: {
      transactionId: number;
      values: BlockchainMatchFormValues;
    }) =>
      matchBlockchainTransactionApi(
        transactionId,
        { usdtInventoryMovementId: values.usdtInventoryMovementId },
        companyId,
      ),
    onSuccess: () => {
      toast.success("Transacción conciliada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const unmatchMutation = useMutation({
    mutationFn: (id: number) => unmatchBlockchainTransactionApi(id, companyId),
    onSuccess: () => {
      toast.success("Transacción desconciliada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createTransaction: createMutation,
    matchTransaction: matchMutation,
    unmatchTransaction: unmatchMutation,
    isPending:
      createMutation.isPending ||
      matchMutation.isPending ||
      unmatchMutation.isPending,
  };
}
