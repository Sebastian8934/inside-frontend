"use client";

import { useCallback, useState } from "react";
import type { ConfirmActionConfig } from "@/components/shared/confirm-action-dialog";

export function useConfirmAction() {
  const [config, setConfig] = useState<ConfirmActionConfig | null>(null);

  const requestConfirm = useCallback((next: ConfirmActionConfig) => {
    setConfig(next);
  }, []);

  const close = useCallback(() => {
    setConfig(null);
  }, []);

  const handleConfirm = useCallback(() => {
    config?.onConfirm();
    close();
  }, [config, close]);

  return {
    requestConfirm,
    confirmDialogProps: config
      ? {
          open: true as const,
          title: config.title,
          description: config.description,
          confirmLabel: config.confirmLabel,
          cancelLabel: config.cancelLabel,
          destructive: config.destructive,
          onConfirm: handleConfirm,
          onOpenChange: (open: boolean) => {
            if (!open) close();
          },
        }
      : {
          open: false as const,
          title: "",
          description: "",
          onConfirm: () => undefined,
          onOpenChange: () => undefined,
        },
  };
}
