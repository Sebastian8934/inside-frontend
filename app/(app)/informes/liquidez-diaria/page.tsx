import { Suspense } from "react";
import { LiquidityDailyReport } from "@/components/features/reports";
import { LoadingState } from "@/components/shared/data-states";

export default function LiquidityDailyReportPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando informe..." />}>
      <LiquidityDailyReport />
    </Suspense>
  );
}
