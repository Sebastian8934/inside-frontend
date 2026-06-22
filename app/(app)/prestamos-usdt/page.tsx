import { Suspense } from "react";
import { UsdtLoansPageContent } from "@/components/features/usdt-loans/usdt-loans-page-content";
import { LoadingState } from "@/components/shared/data-states";

export default function PrestamosUsdtPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando préstamos USDT..." />}>
      <UsdtLoansPageContent />
    </Suspense>
  );
}
