import { Suspense } from "react";
import { DeliveryClientsReport } from "@/components/features/reports";
import { LoadingState } from "@/components/shared/data-states";

export default function ResumenClientesDeliveryReportPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando informe..." />}>
      <DeliveryClientsReport />
    </Suspense>
  );
}
