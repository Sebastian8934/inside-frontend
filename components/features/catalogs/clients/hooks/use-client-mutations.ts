"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createClient,
  updateClient,
} from "@/components/features/catalogs/clients/api/clients.api";
import type { ClientFormValues } from "@/components/features/catalogs/clients/schemas/client.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";

export function useClientMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  const createMutation = useMutation({
    mutationFn: (values: ClientFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createClient({
        code: values.code,
        correctedName: values.correctedName,
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Cliente creado.");
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
      values: ClientFormValues;
    }) =>
      updateClient(
        id,
        {
          code: values.code,
          correctedName: values.correctedName,
          isActive: values.isActive ?? true,
        },
        companyId,
      ),
    onSuccess: () => {
      toast.success("Cliente actualizado.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createClient: createMutation,
    updateClient: updateMutation,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
