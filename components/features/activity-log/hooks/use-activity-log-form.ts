"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useActivityLogMutations } from "@/components/features/activity-log/hooks/use-activity-log-mutations";
import {
  activityLogDefaultValues,
  activityLogSchema,
  type ActivityLogFormValues,
} from "@/components/features/activity-log/schemas/activity-log.schema";

type UseActivityLogFormOptions = {
  open: boolean;
  companyId: number | null;
  onSuccess?: () => void;
};

export function useActivityLogForm({
  open,
  companyId,
  onSuccess,
}: UseActivityLogFormOptions) {
  const { createActivityLog } = useActivityLogMutations(companyId);

  const form = useForm<ActivityLogFormValues>({
    resolver: zodResolver(activityLogSchema),
    defaultValues: activityLogDefaultValues,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(activityLogDefaultValues);
  }, [open, form]);

  async function handleSubmit(values: ActivityLogFormValues) {
    await createActivityLog.mutateAsync(values);
    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
}
