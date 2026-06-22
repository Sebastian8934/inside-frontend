import { Suspense } from "react";
import { NegotiationsPageContent } from "@/components/features/negotiations";
import { LoadingState } from "@/components/shared/data-states";

export default function NegociacionesPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando negociaciones..." />}>
      <NegotiationsPageContent />
    </Suspense>
  );
}
