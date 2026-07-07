import { Suspense } from "react";
import { OtcSummaryReport } from "@/components/features/reports";
import { LoadingState } from "@/components/shared/data-states";

export default function OtcSummaryReportPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando informe..." />}>
      <OtcSummaryReport />
    </Suspense>
  );
}
