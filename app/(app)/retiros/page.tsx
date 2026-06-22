import { Suspense } from "react";
import { WithdrawalsPageContent } from "@/components/features/withdrawals";
import { LoadingState } from "@/components/shared/data-states";

export default function RetirosPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando retiros..." />}>
      <WithdrawalsPageContent />
    </Suspense>
  );
}
