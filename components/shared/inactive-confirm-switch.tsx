"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { ConfirmActionDialog } from "@/components/shared/confirm-action-dialog";

type Props = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  entityName: string;
};

export function InactiveConfirmSwitch({
  checked,
  onCheckedChange,
  entityName,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleChange = (next: boolean) => {
    if (checked && !next) {
      setConfirmOpen(true);
      return;
    }
    onCheckedChange(next);
  };

  return (
    <>
      <Switch checked={checked} onCheckedChange={handleChange} />
      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={`¿Marcar ${entityName} como inactivo?`}
        description={`El registro dejará de estar disponible para nuevas operaciones. Podrás reactivarlo editándolo más adelante.`}
        confirmLabel="Marcar inactivo"
        onConfirm={() => {
          onCheckedChange(false);
          setConfirmOpen(false);
        }}
      />
    </>
  );
}
