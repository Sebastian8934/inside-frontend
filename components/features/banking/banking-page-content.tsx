"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AccountHoldersTab,
  BankMovementsTab,
  BankSummaryTab,
} from "@/components/features/banking";
import { DateRangeFilter } from "@/components/shared/date-range-filter";
import { PageHeader } from "@/components/shared/page-header";
import { startOfToday } from "@/hooks/use-operation-date";
import { toDateOnlyString } from "@/lib/api/build-url";

export function BankingPageContent() {
  const [activeTab, setActiveTab] = useState("movimientos");
  const defaultDate = toDateOnlyString(startOfToday());
  const [dateFrom, setDateFrom] = useState(defaultDate);
  const [dateTo, setDateTo] = useState(defaultDate);

  return (
    <div className="p-6">
      <PageHeader
        title="Bancos"
        description="Movimientos bancarios y titulares"
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
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="resumen">Resumen por titular</TabsTrigger>
          <TabsTrigger value="titulares">Titulares</TabsTrigger>
        </TabsList>

        <TabsContent value="movimientos">
          <BankMovementsTab
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            hideDateFilters
          />
        </TabsContent>

        <TabsContent value="resumen">
          <BankSummaryTab />
        </TabsContent>

        <TabsContent value="titulares">
          <AccountHoldersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
