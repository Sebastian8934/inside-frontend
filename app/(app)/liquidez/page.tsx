import { Suspense } from "react";
import { LiquidityPageContent } from "@/components/features/liquidity";
import { LoadingState } from "@/components/shared/data-states";

export default function LiquidezPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando liquidez..." />}>
      <LiquidityPageContent />
    </Suspense>
  );
}
