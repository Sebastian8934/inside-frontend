import { Suspense } from "react";
import { CashOutPageContent } from "@/components/features/cash-out";
import { LoadingState } from "@/components/shared/data-states";

export default function CashOutPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando cash out..." />}>
      <CashOutPageContent />
    </Suspense>
  );
}
