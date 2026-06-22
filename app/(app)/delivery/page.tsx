import { Suspense } from "react";
import { DeliveryPageContent } from "@/components/features/delivery/delivery-page-content";
import { LoadingState } from "@/components/shared/data-states";

export default function DeliveryPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando delivery..." />}>
      <DeliveryPageContent />
    </Suspense>
  );
}
