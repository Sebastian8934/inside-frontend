import { Suspense } from "react";
import { NegotiationsDayReport } from "@/components/features/reports";
import { LoadingState } from "@/components/shared/data-states";

export default function NegotiationsDayReportPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando informe..." />}>
      <NegotiationsDayReport />
    </Suspense>
  );
}
