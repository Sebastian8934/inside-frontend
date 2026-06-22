"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePlatformMutations } from "@/components/features/catalogs/platforms/hooks/use-platform-mutations";
import {
  platformDefaultValues,
  platformSchema,
  platformToFormValues,
  type PlatformFormValues,
} from "@/components/features/catalogs/platforms/schemas/platform.schema";
import type { Platform } from "@/types/catalogs";

type UsePlatformFormOptions = {
  open: boolean;
  platform?: Platform | null;
  companyId: number | null;
  onSuccess?: () => void;
};

export function usePlatformForm({
  open,
  platform,
  companyId,
  onSuccess,
}: UsePlatformFormOptions) {
  const { createPlatform, updatePlatform } = usePlatformMutations(companyId);

  const form = useForm<PlatformFormValues>({
    resolver: zodResolver(platformSchema),
    defaultValues: platformDefaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (platform) {
      form.reset(platformToFormValues(platform));
      return;
    }

    form.reset(platformDefaultValues);
  }, [open, platform, form]);

  async function handleSubmit(values: PlatformFormValues) {
    if (platform) {
      await updatePlatform.mutateAsync({ id: platform.id, values });
    } else {
      await createPlatform.mutateAsync(values);
    }

    onSuccess?.();
  }

  return {
    form,
    handleSubmit,
    isEditing: Boolean(platform),
    isSubmitting: form.formState.isSubmitting,
  };
}
