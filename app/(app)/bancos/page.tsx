import { Suspense } from "react";
import { BankingPageContent } from "@/components/features/banking/banking-page-content";
import { LoadingState } from "@/components/shared/data-states";

export default function BancosPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando bancos..." />}>
      <BankingPageContent />
    </Suspense>
  );
}
