import { Suspense } from "react";
import { InventoryPageContent } from "@/components/features/inventory/inventory-page-content";
import { LoadingState } from "@/components/shared/data-states";

export default function InventarioPage() {
  return (
    <Suspense fallback={<LoadingState label="Cargando inventario..." />}>
      <InventoryPageContent />
    </Suspense>
  );
}
