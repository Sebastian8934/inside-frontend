"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createOtcCounterparty,
  updateOtcCounterparty,
} from "@/components/features/catalogs/otc-counterparties/api/otc-counterparties.api";
import type { OtcCounterpartyFormValues } from "@/components/features/catalogs/otc-counterparties/schemas/otc-counterparty.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";

export function useOtcCounterpartyMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["otc-counterparties"] });
  };

  const createMutation = useMutation({
    mutationFn: (values: OtcCounterpartyFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createOtcCounterparty({
        code: values.code.trim(),
        name: values.name.trim(),
        type: values.type.trim(),
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Contraparte creada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: OtcCounterpartyFormValues;
    }) =>
      updateOtcCounterparty(
        id,
        {
          code: values.code.trim(),
          name: values.name.trim(),
          type: values.type.trim(),
          isActive: values.isActive ?? true,
        },
        companyId,
      ),
    onSuccess: () => {
      toast.success("Contraparte actualizada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createOtcCounterparty: createMutation,
    updateOtcCounterparty: updateMutation,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
