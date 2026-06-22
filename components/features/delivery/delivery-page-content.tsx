"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DeliveryMovementsTab,
  DeliverySummaryTab,
} from "@/components/features/delivery";
import { PageHeader } from "@/components/shared/page-header";
import { useIsClientOnly } from "@/hooks/use-user-roles";
import { useOperativeDate } from "@/hooks/use-active-company";
import { toDateOnlyString } from "@/lib/api/build-url";
import { formatDateOnly } from "@/lib/utils/format";

export function DeliveryPageContent() {
  const isClientOnly = useIsClientOnly();
  const operativeDate = useOperativeDate();
  const operationDate = toDateOnlyString(operativeDate);

  return (
    <div className="p-6">
      <PageHeader
        title={isClientOnly ? "Mi delivery" : "Delivery"}
        description={
          isClientOnly
            ? "Consulta de saldos y movimientos de delivery"
            : `Control de entregas y saldos por cliente — ${formatDateOnly(operationDate)}`
        }
      />

      <Tabs defaultValue={isClientOnly ? "resumen" : "movimientos"} className="space-y-4">
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="movimientos">
          <DeliveryMovementsTab readOnly={isClientOnly} />
        </TabsContent>

        <TabsContent value="resumen">
          <DeliverySummaryTab clientPortal={isClientOnly} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
