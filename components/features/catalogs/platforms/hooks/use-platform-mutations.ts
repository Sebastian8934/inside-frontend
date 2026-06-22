"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createPlatform,
  updatePlatform,
} from "@/components/features/catalogs/platforms/api/platforms.api";
import type { PlatformFormValues } from "@/components/features/catalogs/platforms/schemas/platform.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";

export function usePlatformMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["platforms"] });
  };

  const createMutation = useMutation({
    mutationFn: (values: PlatformFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createPlatform({
        name: values.name.trim(),
        type: values.type.trim(),
        companyId,
      });
    },
    onSuccess: () => {
      toast.success("Plataforma creada.");
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
      values: PlatformFormValues;
    }) =>
      updatePlatform(
        id,
        {
          name: values.name.trim(),
          type: values.type.trim(),
          isActive: values.isActive ?? true,
        },
        companyId,
      ),
    onSuccess: () => {
      toast.success("Plataforma actualizada.");
      invalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createPlatform: createMutation,
    updatePlatform: updateMutation,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
