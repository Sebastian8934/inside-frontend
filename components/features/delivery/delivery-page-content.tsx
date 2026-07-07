"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DeliveryMovementsTab,
  DeliverySummaryTab,
} from "@/components/features/delivery";
import { DateRangeFilter } from "@/components/shared/date-range-filter";
import { PageHeader } from "@/components/shared/page-header";
import { startOfToday } from "@/hooks/use-operation-date";
import { useIsClientOnly } from "@/hooks/use-user-roles";
import { toDateOnlyString } from "@/lib/api/build-url";

export function DeliveryPageContent() {
  const isClientOnly = useIsClientOnly();
  const defaultTab = isClientOnly ? "resumen" : "movimientos";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const today = startOfToday();
  const defaultDate = toDateOnlyString(today);
  const yearStart = `${today.getFullYear()}-01-01`;
  const [dateFrom, setDateFrom] = useState(
    isClientOnly ? yearStart : defaultDate,
  );
  const [dateTo, setDateTo] = useState(defaultDate);

  return (
    <div className="p-6">
      <PageHeader
        title={isClientOnly ? "Mi delivery" : "Delivery"}
        description={
          isClientOnly
            ? "Consulta de saldos y movimientos de delivery"
            : "Control de entregas y saldos por cliente"
        }
        filters={
          activeTab === "movimientos" ? (
            <DateRangeFilter
              dateFrom={dateFrom}
              dateTo={dateTo}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
            />
          ) : null
        }
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
        </TabsList>

        <TabsContent value="movimientos">
          <DeliveryMovementsTab
            readOnly={isClientOnly}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            hideDateFilters
          />
        </TabsContent>

        <TabsContent value="resumen">
          <DeliverySummaryTab clientPortal={isClientOnly} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
