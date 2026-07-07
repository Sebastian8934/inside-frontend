"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CashOutExpensesTab } from "@/components/features/cash-out/components/cash-out-expenses-tab";
import { CashOutPayrollTab } from "@/components/features/cash-out/components/cash-out-payroll-tab";
import { CashOutTransactionCostsTab } from "@/components/features/cash-out/components/cash-out-transaction-costs-tab";
import { DateRangeFilter } from "@/components/shared/date-range-filter";
import { PageHeader } from "@/components/shared/page-header";
import { startOfToday } from "@/hooks/use-operation-date";
import { toDateOnlyString } from "@/lib/api/build-url";

export function CashOutPageContent() {
  const [activeTab, setActiveTab] = useState("egresos");
  const defaultDate = toDateOnlyString(startOfToday());
  const [dateFrom, setDateFrom] = useState(defaultDate);
  const [dateTo, setDateTo] = useState(defaultDate);

  return (
    <div className="p-6">
      <PageHeader
        title="Cash out"
        description="Egresos, nómina y costos por transacción"
        filters={
          activeTab === "costos" ? (
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
          <TabsTrigger value="egresos">Egresos</TabsTrigger>
          <TabsTrigger value="nomina">Nómina</TabsTrigger>
          <TabsTrigger value="costos">Costos por transacción</TabsTrigger>
        </TabsList>

        <TabsContent value="egresos">
          <CashOutExpensesTab />
        </TabsContent>

        <TabsContent value="nomina">
          <CashOutPayrollTab />
        </TabsContent>

        <TabsContent value="costos">
          <CashOutTransactionCostsTab
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
            hideDateFilters
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
