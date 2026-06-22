"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCommercialRep,
  updateCommercialRep,
} from "@/components/features/catalogs/commercial-reps/api/commercial-reps.api";
import type { CommercialRepFormValues } from "@/components/features/catalogs/commercial-reps/schemas/commercial-rep.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";

export function useCommercialRepMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["commercial-reps"] });
  };

  const createMutation = useMutation({
    mutationFn: (values: CommercialRepFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createCommercialRep({
        initials: values.initials.trim(),
        fullName: values.fullName.trim(),
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Comercial creado.");
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
      values: CommercialRepFormValues;
    }) =>
      updateCommercialRep(
        id,
        {
          initials: values.initials.trim(),
          fullName: values.fullName.trim(),
          isActive: values.isActive ?? true,
        },
        companyId,
      ),
    onSuccess: () => {
      toast.success("Comercial actualizado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createCommercialRep: createMutation,
    updateCommercialRep: updateMutation,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
