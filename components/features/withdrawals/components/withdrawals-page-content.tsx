"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WithdrawalConsolidatedTab } from "@/components/features/withdrawals/components/withdrawal-consolidated-tab";
import { WithdrawalDayTab } from "@/components/features/withdrawals/components/withdrawal-day-tab";
import { OperationDateFilter } from "@/components/shared/operation-date-filter";
import { PageHeader } from "@/components/shared/page-header";
import { useOperationDate } from "@/hooks/use-operation-date";

export function WithdrawalsPageContent() {
  const [activeTab, setActiveTab] = useState("dia");
  const { operationDate, setOperationDate, operationDateString } =
    useOperationDate();

  return (
    <div className="p-6">
      <PageHeader
        title="Retiros"
        description="Reporte diario de retiros y consolidado mensual"
        filters={
          activeTab === "dia" ? (
            <OperationDateFilter
              date={operationDate}
              onDateChange={setOperationDate}
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
          <TabsTrigger value="dia">Retiros del día</TabsTrigger>
          <TabsTrigger value="consolidado">Consolidado</TabsTrigger>
        </TabsList>
        <TabsContent value="dia">
          <WithdrawalDayTab
            operationDate={operationDate}
            onOperationDateChange={setOperationDate}
            operationDateString={operationDateString}
          />
        </TabsContent>
        <TabsContent value="consolidado">
          <WithdrawalConsolidatedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
