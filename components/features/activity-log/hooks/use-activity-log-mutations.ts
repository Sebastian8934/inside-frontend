"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createActivityLogApi } from "@/components/features/activity-log/api/activity-log.api";
import { toCreateActivityLogPayload } from "@/components/features/activity-log/lib/map-activity-log-payload";
import type { ActivityLogFormValues } from "@/components/features/activity-log/schemas/activity-log.schema";
import { getApiErrorMessage } from "@/lib/hooks/query-utils";

export function useActivityLogMutations(companyId: number | null) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (values: ActivityLogFormValues) => {
      if (!companyId) {
        throw new Error("Empresa no seleccionada.");
      }

      return createActivityLogApi(
        toCreateActivityLogPayload(values, companyId),
      );
    },
    onSuccess: () => {
      toast.success("Actividad registrada.");
      void queryClient.invalidateQueries({ queryKey: ["activity-log"] });
      void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  return {
    createActivityLog: createMutation,
    isPending: createMutation.isPending,
  };
}
