"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlockchainTab } from "@/components/features/inventory/blockchain";
import { MovementsTab } from "@/components/features/inventory/movements";
import { OtcSummaryTab } from "@/components/features/inventory/otc-summary";
import { DateRangeFilter } from "@/components/shared/date-range-filter";
import { OperationDateFilter } from "@/components/shared/operation-date-filter";
import { PageHeader } from "@/components/shared/page-header";
import { startOfToday, useOperationDate } from "@/hooks/use-operation-date";
import { toDateOnlyString } from "@/lib/api/build-url";

export function InventoryPageContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const defaultTab =
    tabParam === "otc" || tabParam === "blockchain" ? tabParam : "movimientos";

  const [activeTab, setActiveTab] = useState(defaultTab);
  const defaultDate = toDateOnlyString(startOfToday());
  const [dateFrom, setDateFrom] = useState(defaultDate);
  const [dateTo, setDateTo] = useState(defaultDate);
  const { operationDate, setOperationDate, operationDateString } =
    useOperationDate();

  const headerFilters =
    activeTab === "movimientos" ? (
      <DateRangeFilter
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />
    ) : activeTab === "otc" ? (
      <OperationDateFilter
        date={operationDate}
        onDateChange={setOperationDate}
      />
    ) : null;

  return (
    <div className="p-6">
      <PageHeader
        title="Inventario USDT"
        description="Ledger de movimientos USDT"
        filters={headerFilters}
      />

      <Tabs
        key={defaultTab}
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="otc">Resumen OTC</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>
        <TabsContent value="movimientos">
          <MovementsTab
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            hideDateFilters
          />
        </TabsContent>
        <TabsContent value="otc">
          <OtcSummaryTab
            operationDateString={operationDateString}
            hideDateFilter
          />
        </TabsContent>
        <TabsContent value="blockchain">
          <BlockchainTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
